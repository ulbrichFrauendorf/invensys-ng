import {
  AfterContentInit,
  AfterViewInit,
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
  host: { '[class.mobile-only]': 'mobileOnly' },
})
export class ICarousel
  implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() activeIndex = 0;
  @Input() ariaLabel = 'Carousel';
  /** Shows all items on wide containers; enables the carousel at 900px and below. */
  @Input() mobileOnly = false;
  @Output() activeIndexChange = new EventEmitter<number>();
  @ContentChildren(ICarouselItem, { descendants: true })
  items!: QueryList<ICarouselItem>;
  @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLElement>;
  count = 0;
  private readonly changeDetector = inject(ChangeDetectorRef);
  private destroyed = false;
  private changes?: Subscription;
  private resize?: ResizeObserver;
  private frame?: number;

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
    const viewport = this.viewport.nativeElement;
    if (viewport.scrollWidth <= viewport.clientWidth) return;
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
    if (nearest !== this.activeIndex) {
      this.activeIndex = nearest;
      this.activeIndexChange.emit(nearest);
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
    this.frame = requestAnimationFrame(() => this.scrollToActive());
  }

  private scrollToActive(): void {
    const viewport = this.viewport?.nativeElement;
    const item = this.items?.get(this.activeIndex)?.element.nativeElement;
    if (!viewport || !item || viewport.scrollWidth <= viewport.clientWidth)
      return;
    viewport.scrollTo({
      left:
        viewport.scrollLeft +
        item.getBoundingClientRect().left -
        viewport.getBoundingClientRect().left,
      behavior: 'instant',
    });
  }
}
