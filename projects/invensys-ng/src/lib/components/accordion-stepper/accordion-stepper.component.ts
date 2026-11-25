import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  OnChanges,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { IStep } from '../stepper/step.component';
import { StepperBase } from '../stepper/stepper-base';

/**
 * Opens the active step and its shared actions below a themed header.
 * Step changes align the open header with the nearest scroll viewport.
 */
@Component({
  selector: 'i-accordion-stepper',
  imports: [NgTemplateOutlet],
  templateUrl: './accordion-stepper.component.html',
  styleUrl: './accordion-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class IAccordionStepper extends StepperBase implements OnChanges, AfterViewChecked {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly scrollSpace = viewChild.required<ElementRef<HTMLElement>>('scrollSpace');
  private renderedIndex?: number;
  private scrollFrame?: number;

  readonly componentId = UniqueComponentId('i-accordion-stepper-');

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.cancelScroll());
  }

  ngOnChanges(changes: SimpleChanges): void {
    const focused = this.document.activeElement;
    if (
      changes['activeIndex'] &&
      focused &&
      this.host.nativeElement
        .querySelector('.i-accordion-stepper-panel:not([hidden])')
        ?.contains(focused)
    ) {
      afterNextRender(() => this.focusStep(this.activeIndex), { injector: this.injector });
    }
  }

  ngAfterViewChecked(): void {
    const previousIndex = this.renderedIndex;
    this.renderedIndex = this.activeIndex;
    if (previousIndex === undefined || previousIndex === this.activeIndex) return;

    const view = this.document.defaultView;
    if (!view?.requestAnimationFrame) return;

    this.cancelScroll();
    this.scrollFrame = view.requestAnimationFrame(() => {
      this.scrollFrame = undefined;
      this.alignActiveHeader(view);
    });
  }

  protected headerLabel(step: IStep, index: number): string {
    const status = step.completed ? ', completed' : step.optional ? ', optional' : '';
    return `Step ${index + 1} of ${this.steps.length}: ${step.label}${status}`;
  }

  protected selectPrevious(event: Event, index: number): void {
    const previousIndex = index - 1;
    if (!this.canSelect(previousIndex)) {
      return;
    }

    this.selectStep(event, previousIndex);
    afterNextRender(() => this.focusStep(this.activeIndex), { injector: this.injector });
  }

  protected onKeyDown(event: KeyboardEvent, index: number): void {
    this.moveFocus(event, index, 'ArrowUp', 'ArrowDown');
  }

  private cancelScroll(): void {
    if (this.scrollFrame !== undefined) {
      this.document.defaultView?.cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = undefined;
    }
  }

  private alignActiveHeader(view: Window): void {
    const host = this.host.nativeElement;
    const header = host
      .querySelector(`[id="${this.componentId}-step-${this.activeIndex}"]`)
      ?.closest('.i-accordion-stepper-header');
    const scrollSpace = this.scrollSpace().nativeElement;
    scrollSpace.style.blockSize = '';
    const scrollport = this.findScrollport(view, host);
    if (!header?.getClientRects().length || !scrollport?.scrollTo) return;

    const pageLayout = host.closest('i-page-layout');
    const stickyInset =
      pageLayout && scrollport.contains(pageLayout)
        ? Number.parseFloat(
            view
              .getComputedStyle(pageLayout)
              .getPropertyValue('--page-layout-content-sticky-offset'),
          ) || 0
        : 0;
    const scrollPadding = view.getComputedStyle(scrollport).scrollPaddingTop;
    const padding = Number.parseFloat(scrollPadding) || 0;
    const paddingInset = scrollPadding.endsWith('%')
      ? (padding * scrollport.clientHeight) / 100
      : padding;
    const viewportTop =
      scrollport === this.document.scrollingElement
        ? 0
        : scrollport.getBoundingClientRect().top + scrollport.clientTop;
    const top = Math.max(
      0,
      scrollport.scrollTop +
        header.getBoundingClientRect().top -
        viewportTop -
        Math.max(stickyInset, paddingInset),
    );
    const maxScroll = Math.max(0, scrollport.scrollHeight - scrollport.clientHeight);
    if (top > maxScroll) {
      // A short scrollport reports no overflow even if there is empty space below its content.
      const probe = Math.ceil(top - maxScroll + (maxScroll === 0 ? scrollport.clientHeight : 0));
      scrollSpace.style.blockSize = `${probe}px`;
      const excess = scrollport.scrollHeight - scrollport.clientHeight - top;
      scrollSpace.style.blockSize = `${Math.max(0, Math.ceil(probe - excess))}px`;
    }
    scrollport.scrollTo({ top, behavior: 'instant' });
  }

  private findScrollport(view: Window, host: HTMLElement): Element | null {
    for (
      let parent = host.parentElement;
      parent && parent !== this.document.body && parent !== this.document.documentElement;
      parent = parent.parentElement
    ) {
      if (['auto', 'scroll', 'overlay'].includes(view.getComputedStyle(parent).overflowY)) {
        return parent;
      }
    }
    return this.document.scrollingElement;
  }
}
