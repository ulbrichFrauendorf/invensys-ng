import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { IStep } from '../stepper/step.component';
import { StepperBase } from '../stepper/stepper-base';

/** A stepper that opens the active step and its shared actions directly below its header. */
@Component({
  selector: 'i-accordion-stepper',
  imports: [NgTemplateOutlet],
  templateUrl: './accordion-stepper.component.html',
  styleUrl: './accordion-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class IAccordionStepper extends StepperBase implements OnChanges {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly componentId = UniqueComponentId('i-accordion-stepper-');

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
}
