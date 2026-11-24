import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { ICarousel } from '../carousel/carousel.component';
import { ICarouselItem } from '../carousel/carousel-item.directive';
import { StepperBase } from './stepper-base';

export type { StepperChangeEvent } from './stepper-base';
export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * Guided, stateful navigation for multi-step workflows.
 *
 * @example
 * ```html
 * <i-stepper [(activeIndex)]="activeStep" [linear]="true">
 *   <i-step label="Details" description="Name and access" [completed]="detailsValid">
 *     Details form
 *   </i-step>
 *   <i-step label="Columns" [disabled]="!detailsValid">
 *     Column selection
 *   </i-step>
 *   <div stepperActions>
 *     <!-- Shared Back, Continue or Save buttons appear below all step content. -->
 *   </div>
 * </i-stepper>
 * ```
 */
@Component({
  selector: 'i-stepper',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, ICarousel, ICarouselItem],
  templateUrl: './stepper.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './stepper.component.scss',
})
export class IStepper extends StepperBase {
  /** Step headers become swipeable when their minimum widths no longer fit. */
  @Input() orientation: StepperOrientation = 'horizontal';

  readonly componentId = UniqueComponentId('i-stepper-');

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (this.orientation === 'vertical') {
      this.moveFocus(event, index, 'ArrowUp', 'ArrowDown');
    } else {
      this.moveFocus(event, index, 'ArrowLeft', 'ArrowRight');
    }
  }
}
