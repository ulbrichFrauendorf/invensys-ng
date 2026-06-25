import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Injector,
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { Subject, Subscription } from 'rxjs';

/**
 * RadioButton Component
 *
 * A form control radio button component for single selection within a group.
 * Fully compatible with Angular Reactive Forms and Template-driven Forms.
 *
 * @example
 * ```html
 * <!-- Basic radio button -->
 * <i-radio-button label="Option 1" value="option1" name="options"></i-radio-button>
 *
 * <!-- Radio button with ngModel -->
 * <i-radio-button
 *   label="Male"
 *   value="male"
 *   name="gender"
 *   [(ngModel)]="selectedGender">
 * </i-radio-button>
 * <i-radio-button
 *   label="Female"
 *   value="female"
 *   name="gender"
 *   [(ngModel)]="selectedGender">
 * </i-radio-button>
 *
 * <!-- Radio button in reactive form -->
 * <i-radio-button
 *   label="Yes"
 *   value="yes"
 *   name="confirmation"
 *   formControlName="confirmation">
 * </i-radio-button>
 *
 * <!-- Disabled radio button -->
 * <i-radio-button
 *   label="Unavailable"
 *   value="unavailable"
 *   name="options"
 *   [disabled]="true">
 * </i-radio-button>
 * ```
 *
 * @remarks
 * This component implements ControlValueAccessor for seamless integration with Angular Forms.
 * Radio buttons with the same `name` attribute work as a group, allowing only one selection.
 *
 * Note: For Reactive Forms (formControlName), the component will attempt to infer the `name`
 * from the `formControlName` directive when `name` is not explicitly set, but it's still
 * recommended to set the `name` Input for clarity and group scoping.
 */
@Component({
  selector: 'i-radio-button',
  standalone: true,
  imports: [],
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IRadioButton),
      multi: true,
    },
  ],
})
export class IRadioButton implements ControlValueAccessor, OnInit, OnDestroy {
  /**
   * Label text displayed next to the radio button
   */
  @Input() label?: string;

  /**
   * The value of this radio option
   */
  @Input() value: any;

  /**
   * Name attribute to group radio buttons
   */
  @Input() name?: string;

  /**
   * HTML id attribute for the radio input element
   */
  @Input() inputId?: string;

  /**
   * Whether the radio button is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Whether the radio button should take full width
   * @default false
   */
  @Input() fluid = false;

  /**
   * Event emitted when radio button is selected
   */
  @Output() onChange = new EventEmitter<any>();

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-radio-button-');

  /**
   * Internal model value (the selected value in the group)
   * @internal
   */
  private _modelValue: any;
  // Grouping state shared across instances (name + form scope)
  private static groupSubjects = new Map<string, Subject<any>>();
  private static groupValues = new Map<string, any>();
  private groupKey?: string;
  private subscription?: Subscription;

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onChangeCallback: (value: any) => void = () => {};

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onTouchedCallback: () => void = () => {};

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private injector: Injector
  ) {}

  /**
   * Gets the effective input ID
   */
  get effectiveInputId(): string {
    return this.inputId || this.componentId;
  }

  /**
   * Checks if this radio button is currently selected
   */
  get checked(): boolean {
    return this._modelValue === this.value;
  }

  /**
   * Selects this radio button
   * @internal
   */
  select(): void {
    if (this.disabled) return;

    if (this._modelValue !== this.value) {
      this._modelValue = this.value;
      this.onChangeCallback(this.value);
      this.onTouchedCallback();

      // Emit after the current change detection cycle completes
      // This ensures Angular forms have processed the value change
      setTimeout(() => {
        this.onChange.emit(this.value);
      }, 0);

      // Notify group subscribers (if name is provided)
      if (this.groupKey) {
        const subject = IRadioButton.groupSubjects.get(this.groupKey);
        if (subject) {
          IRadioButton.groupValues.set(this.groupKey, this.value);
          subject.next(this.value);
        }
      }
    }
  }

  /**
   * Writes a value to the radio button (ControlValueAccessor)
   * @internal
   */
  writeValue(value: any): void {
    this._modelValue = value;

    // If the control receives a value, notify the group so all members update
    if (this.groupKey) {
      const current = IRadioButton.groupValues.get(this.groupKey);
      if (current !== value) {
        let subject = IRadioButton.groupSubjects.get(this.groupKey);
        if (!subject) {
          subject = new Subject<any>();
          IRadioButton.groupSubjects.set(this.groupKey, subject);
        }
        IRadioButton.groupValues.set(this.groupKey, value);
        subject.next(value);
      }
    }
  }

  ngOnInit(): void {
    // If the consumer used reactive forms but didn't provide a 'name' input,
    // try to use the NgControl name for grouping
    const ngControl = this.injector.get(NgControl, null as any);
    if (!this.name && ngControl?.name) {
      try {
        this.name = String(ngControl.name);
      } catch {}
    }

    // Only group radios when a common name is provided
    if (!this.name) return;

    // compute a form-scoped key: name@formId or name@root
    const form = this.elementRef.nativeElement.closest(
      'form'
    ) as HTMLFormElement | null;
    let formKey = 'root';
    if (form) {
      formKey =
        form.id ||
        form.getAttribute('data-invensysng-form-id') ||
        UniqueComponentId('i-radio-form-');
      if (!form.id && !form.getAttribute('data-invensysng-form-id')) {
        form.setAttribute('data-invensysng-form-id', formKey);
      }
    }
    this.groupKey = `${this.name}@${formKey}`;

    // ensure subject exists
    let subject = IRadioButton.groupSubjects.get(this.groupKey);
    if (!subject) {
      subject = new Subject<any>();
      IRadioButton.groupSubjects.set(this.groupKey, subject);
    }

    // subscribe to group changes
    this.subscription = subject.subscribe((value: any) => {
      // update model and view
      this._modelValue = value;
      // run change detection to update CSS classes
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Cleanup: if there are no more observers for this group, remove the subject and value
    if (this.groupKey) {
      const subject = IRadioButton.groupSubjects.get(this.groupKey);
      if (subject && subject.observers && subject.observers.length === 0) {
        IRadioButton.groupSubjects.delete(this.groupKey);
        IRadioButton.groupValues.delete(this.groupKey);
      }
    }
  }

  /**
   * Registers the onChange callback (ControlValueAccessor)
   * @internal
   */
  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  /**
   * Registers the onTouched callback (ControlValueAccessor)
   * @internal
   */
  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  /**
   * Sets the disabled state (ControlValueAccessor)
   * @internal
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
