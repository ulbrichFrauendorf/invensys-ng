import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { IStep } from './step.component';

export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepperChangeEvent {
  originalEvent: Event;
  index: number;
  previousIndex: number;
}

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
 * </i-stepper>
 * ```
 */
@Component({
  selector: 'i-stepper',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class IStepper implements AfterContentInit {
  /** Zero-based index of the active step. */
  @Input() activeIndex = 0;

  /** Prevents skipping incomplete steps when enabled. */
  @Input() linear = false;

  /** Navigation layout. Horizontal steppers collapse to vertical on small screens. */
  @Input() orientation: StepperOrientation = 'horizontal';

  /** Accessible label for the step navigation. */
  @Input() ariaLabel = 'Progress';

  /** Supports two-way binding of the active step. */
  @Output() activeIndexChange = new EventEmitter<number>();

  /** Emitted after the user selects a different step. */
  @Output() onChange = new EventEmitter<StepperChangeEvent>();

  @ContentChildren(IStep) stepComponents!: QueryList<IStep>;

  readonly componentId = UniqueComponentId('i-stepper-');
  steps: IStep[] = [];

  ngAfterContentInit(): void {
    this.syncSteps();
    this.stepComponents.changes.subscribe(() => this.syncSteps());
  }

  selectStep(event: Event, index: number): void {
    if (index === this.activeIndex || !this.canSelect(index)) {
      return;
    }

    const previousIndex = this.activeIndex;
    this.activeIndex = index;
    this.activeIndexChange.emit(index);
    this.onChange.emit({ originalEvent: event, index, previousIndex });
  }

  canSelect(index: number): boolean {
    const step = this.steps[index];
    if (!step || step.disabled) {
      return false;
    }

    if (!this.linear || index <= this.activeIndex) {
      return true;
    }

    return this.steps.slice(0, index).every(item => item.completed || item.optional);
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const directionKeys = this.orientation === 'vertical'
      ? ['ArrowUp', 'ArrowDown']
      : ['ArrowLeft', 'ArrowRight'];

    if (event.key === directionKeys[0]) {
      this.focusAdjacent(index, -1);
      event.preventDefault();
    } else if (event.key === directionKeys[1]) {
      this.focusAdjacent(index, 1);
      event.preventDefault();
    } else if (event.key === 'Home') {
      this.focusBoundary(0, 1);
      event.preventDefault();
    } else if (event.key === 'End') {
      this.focusBoundary(this.steps.length - 1, -1);
      event.preventDefault();
    }
  }

  private syncSteps(): void {
    this.steps = this.stepComponents.toArray();
    if (this.steps.length === 0) {
      this.activeIndex = 0;
      return;
    }

    this.activeIndex = Math.min(Math.max(this.activeIndex, 0), this.steps.length - 1);
  }

  private focusAdjacent(index: number, direction: number): void {
    let nextIndex = index + direction;
    while (nextIndex >= 0 && nextIndex < this.steps.length) {
      if (this.canSelect(nextIndex)) {
        this.focusStep(nextIndex);
        return;
      }
      nextIndex += direction;
    }
  }

  private focusBoundary(index: number, direction: number): void {
    let candidate = index;
    while (candidate >= 0 && candidate < this.steps.length) {
      if (this.canSelect(candidate)) {
        this.focusStep(candidate);
        return;
      }
      candidate += direction;
    }
  }

  private focusStep(index: number): void {
    document.getElementById(`${this.componentId}-step-${index}`)?.focus();
  }
}
