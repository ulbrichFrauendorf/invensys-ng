import {
  AfterContentInit,
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IButton } from '../button/button.component';
import { ICarouselItem } from './carousel-item.directive';

/** Swipeable projected content with bounded controls and two-way slide position. */
@Component({
  selector: 'i-carousel',
  standalone: true,
  imports: [IButton],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    '[class.mobile-only]': 'mobileOnly',
    '[class.full-width]': 'fullWidth',
    '[class.overflow-only]': 'overflowOnly',
    '[class.is-overflowing]': 'overflowing',
  },
})
export class ICarousel
  implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() activeIndex = 0;
  @Input() ariaLabel = 'Carousel';
  /** Shows all items on wide containers; enables the carousel at 900px and below. */
  @Input() mobileOnly = false;
  /** Fits items down to --carousel-min-item-width (180px), showing controls only on overflow. */
  @Input({ transform: booleanAttribute }) overflowOnly = false;
  /** Expands each slide to the viewport width in carousel mode. */
  @Input({ transform: booleanAttribute }) fullWidth = false;
  /** Shows previous/next arrows alongside the slide indicators in carousel mode. */
  @Input({ transform: booleanAttribute }) showNavigators = false;
  @Output() activeIndexChange = new EventEmitter<number>();
  @ContentChildren(ICarouselItem, { descendants: true })
  items!: QueryList<ICarouselItem>;
  @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLElement>;
  count = 0;
  protected overflowing = false;
  protected dragging = false;
  private readonly changeDetector = inject(ChangeDetectorRef);
  private destroyed = false;
  private changes?: Subscription;
  private resize?: ResizeObserver;
  private frame?: number;
  private scrollTarget?: number;
  private pointerDrag?: {
    id: number;
    x: number;
    y: number;
    scrollLeft: number;
  };
  private dragDocument?: Document;
  private suppressClick = false;
  private lastWheelTime = -Infinity;
  private lastWheelDirection = 0;
  private readonly wheelListener = (event: WheelEvent): void => {
    if (event.ctrlKey || event.deltaX !== 0 || event.deltaY === 0) return;
    const viewport = this.viewport.nativeElement;
    if (
      viewport.scrollWidth <= viewport.clientWidth ||
      getComputedStyle(viewport).overflowX === 'visible'
    )
      return;
    const direction = Math.sign(event.deltaY);
    const next = this.activeIndex + direction;
    if (next < 0 || next >= this.count) return;
    event.preventDefault();
    if (
      direction === this.lastWheelDirection &&
      event.timeStamp - this.lastWheelTime < 180
    )
      return;
    this.lastWheelDirection = direction;
    this.lastWheelTime = event.timeStamp;
    this.goTo(next);
    this.changeDetector.markForCheck();
  };
  private readonly captureClick = (event: MouseEvent): void => {
    if (this.suppressClick && event.detail > 0) {
      this.suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  private readonly movePointer = (event: PointerEvent): void => {
    const drag = this.pointerDrag;
    if (!drag || event.pointerId !== drag.id) return;
    if (event.buttons === 0) {
      this.stopDrag();
      return;
    }
    const distance = event.clientX - drag.x;
    if (!this.dragging) {
      if (Math.max(Math.abs(distance), Math.abs(event.clientY - drag.y)) < 6)
        return;
      if (Math.abs(event.clientY - drag.y) > Math.abs(distance)) {
        this.stopDrag();
        return;
      }
      this.dragging = true;
      this.suppressClick = true;
      this.scrollTarget = undefined;
      this.viewport.nativeElement.setPointerCapture(event.pointerId);
      this.changeDetector.detectChanges();
    }
    event.preventDefault();
    this.viewport.nativeElement.scrollLeft = drag.scrollLeft - distance;
  };
  private readonly releasePointer = (event: PointerEvent): void =>
    this.finishDrag(event);

  ngAfterContentInit(): void {
    this.updateItems();
    this.changes = this.items.changes.subscribe(() => {
      queueMicrotask(() => {
        if (this.destroyed) return;
        this.updateItems();
        this.changeDetector.markForCheck();
      });
    });
  }

  ngAfterViewInit(): void {
    this.viewport.nativeElement.addEventListener('wheel', this.wheelListener, {
      passive: false,
    });
    this.viewport.nativeElement.addEventListener(
      'click',
      this.captureClick,
      true,
    );
    if (typeof ResizeObserver !== 'undefined') {
      this.resize = new ResizeObserver(() => this.scheduleScroll());
      this.resize.observe(this.viewport.nativeElement);
    }
    this.scheduleScroll();
  }

  ngOnChanges(): void {
    this.scheduleScroll();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopDrag();
    this.viewport.nativeElement.removeEventListener(
      'wheel',
      this.wheelListener,
    );
    this.viewport.nativeElement.removeEventListener(
      'click',
      this.captureClick,
      true,
    );
    this.changes?.unsubscribe();
    this.resize?.disconnect();
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
  }

  goTo(index: number): void {
    const next = Math.max(0, Math.min(index, this.count - 1));
    if (this.count === 0) return;
    if (next !== this.activeIndex) {
      this.activeIndex = next;
      this.activeIndexChange.emit(next);
    }
    this.scrollToActive();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.target !== this.viewport.nativeElement) return;
    const next =
      event.key === 'ArrowLeft'
        ? this.activeIndex - 1
        : event.key === 'ArrowRight'
          ? this.activeIndex + 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? this.count - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      this.goTo(next);
    }
  }

  onScrollEnd(): void {
    if (this.dragging) return;
    const viewport = this.viewport.nativeElement;
    if (viewport.scrollWidth <= viewport.clientWidth) return;
    const target = this.scrollTarget;
    this.scrollTarget = undefined;
    if (target !== undefined && Math.abs(viewport.scrollLeft - target) < 1)
      return;
    const left = viewport.getBoundingClientRect().left;
    let nearest = 0;
    let distance = Infinity;
    this.items.forEach((item, index) => {
      const delta = Math.abs(
        item.element.nativeElement.getBoundingClientRect().left - left,
      );
      if (delta < distance) {
        distance = delta;
        nearest = index;
      }
    });
    if (
      viewport.scrollLeft >=
      viewport.scrollWidth - viewport.clientWidth - 1
    ) {
      nearest = this.count - 1;
    }
    if (nearest !== this.activeIndex) {
      this.activeIndex = nearest;
      this.activeIndexChange.emit(nearest);
    }
  }

  protected onPointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    this.stopDrag();
    this.suppressClick = false;
    const viewport = this.viewport.nativeElement;
    if (
      viewport.scrollWidth <= viewport.clientWidth ||
      getComputedStyle(viewport).overflowX === 'visible'
    )
      return;
    if (
      (event.target as HTMLElement).closest(
        'input, textarea, select, [contenteditable="true"]',
      )
    )
      return;
    this.pointerDrag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      scrollLeft: viewport.scrollLeft,
    };
    this.dragDocument = viewport.ownerDocument;
    this.dragDocument.addEventListener('pointermove', this.movePointer, true);
    this.dragDocument.addEventListener('pointerup', this.releasePointer, true);
    this.dragDocument.addEventListener(
      'pointercancel',
      this.releasePointer,
      true,
    );
  }

  protected finishDrag(event: PointerEvent): void {
    if (event.pointerId !== this.pointerDrag?.id) return;
    this.stopDrag();
  }

  protected preventNativeDrag(event: DragEvent): void {
    if (this.pointerDrag) event.preventDefault();
  }

  private stopDrag(): void {
    const drag = this.pointerDrag;
    this.pointerDrag = undefined;
    this.dragDocument?.removeEventListener(
      'pointermove',
      this.movePointer,
      true,
    );
    this.dragDocument?.removeEventListener(
      'pointerup',
      this.releasePointer,
      true,
    );
    this.dragDocument?.removeEventListener(
      'pointercancel',
      this.releasePointer,
      true,
    );
    this.dragDocument = undefined;
    const wasDragging = this.dragging;
    this.dragging = false;
    if (drag && this.viewport.nativeElement.hasPointerCapture(drag.id)) {
      this.viewport.nativeElement.releasePointerCapture(drag.id);
    }
    if (wasDragging && !this.destroyed) {
      this.changeDetector.detectChanges();
      this.onScrollEnd();
    }
  }

  private updateItems(): void {
    this.count = this.items.length;
    const next = Math.max(0, Math.min(this.activeIndex, this.count - 1));
    if (next !== this.activeIndex) {
      this.activeIndex = next;
      this.activeIndexChange.emit(next);
    }
    this.scheduleScroll();
  }

  private scheduleScroll(): void {
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      const viewport = this.viewport?.nativeElement;
      const overflowing =
        !!viewport && viewport.scrollWidth > viewport.clientWidth;
      if (overflowing !== this.overflowing) {
        this.overflowing = overflowing;
        this.changeDetector.markForCheck();
      }
      this.scrollToActive();
    });
  }

  private scrollToActive(): void {
    const viewport = this.viewport?.nativeElement;
    const item = this.items?.get(this.activeIndex)?.element.nativeElement;
    if (!viewport || !item || viewport.scrollWidth <= viewport.clientWidth)
      return;
    const left =
      viewport.scrollLeft +
      item.getBoundingClientRect().left -
      viewport.getBoundingClientRect().left;
    this.scrollTarget = Math.max(
      0,
      Math.min(left, viewport.scrollWidth - viewport.clientWidth),
    );
    viewport.scrollTo({
      left: this.scrollTarget,
      behavior: 'instant',
    });
  }
}
