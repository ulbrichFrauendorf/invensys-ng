import { Component, Input, Optional, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NgControl,
  AbstractControl,
} from '@angular/forms';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { TooltipDirective } from '../../directives/tooltip/tooltip.directive';

/**
 * Supported background style options for the input
 */
export type IInputBackgroundStyle = 'surface' | 'component';

/**
 * Input Text Component
 *
 * A form control text input component with floating labels, icons, and validation support.
 * Fully compatible with Angular Reactive Forms and Template-driven Forms.
 *
 * @example
 * ```html
 * <!-- Basic input -->
 * <i-input-text label="Username"></i-input-text>
 *
 * <!-- Input with reactive form -->
 * <i-input-text
 *   label="Email"
 *   type="email"
 *   formControlName="email">
 * </i-input-text>
 *
 * <!-- Input with icon -->
 * <i-input-text
 *   label="Search"
 *   icon="pi pi-search"
 *   [(ngModel)]="searchTerm">
 * </i-input-text>
 *
 * <!-- Password input -->
 * <i-input-text
 *   label="Password"
 *   type="password"
 *   formControlName="password">
 * </i-input-text>
 *
 * <!-- Full width input -->
 * <i-input-text
 *   label="Address"
 *   [fluid]="true"
 *   formControlName="address">
 * </i-input-text>
 *
 * <!-- Input with custom error messages -->
 * <i-input-text
 *   label="Phone"
 *   formControlName="phone"
 *   [errorMessages]="{pattern: 'Please enter a valid phone number'}">
 * </i-input-text>
 * ```
 *
 * @remarks
 * This component implements ControlValueAccessor for seamless integration with Angular Forms.
 * Supports floating labels, custom validation messages, and external validation state.
 */
@Component({
  selector: 'i-input-text',
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
})
export class IInputText implements ControlValueAccessor {
  /**
   * Label text displayed for the input
   * @default 'Label'
   */
  @Input() label = 'Label';

  /**
   * HTML input type attribute
   * @default 'text'
   */
  @Input() type: string = 'text';

  /**
   * HTML id attribute for the input element
   */
  @Input() id?: string;

  /**
   * Whether the input should take full width of its container
   * @default false
   */
  @Input() fluid = false;

  /**
   * Forces the label to stay in floated position
   * @default false
   */
  @Input() forceFloated = false;

  /**
   * Hides the input text (useful for password fields with toggle)
   * @default false
   */
  @Input() hideText = false;

  /**
   * Enables floating label animation
   * @default true
   */
  @Input() useFloatLabel = true;

  /**
   * Placeholder text for the input
   */
  @Input() placeholder?: string;

  /**
   * Allows external control to override validation state
   * @default false
   */
  @Input() externalInvalid = false;

  /**
   * External error message to display (overrides internal validation)
   */
  @Input() externalErrorMessage?: string;

  /**
   * Background style of the input
   * @default 'surface'
   */
  @Input() backgroundStyle: IInputBackgroundStyle = 'surface';

  /**
   * Icon class name to display (e.g., 'pi pi-search')
   */
  @Input() icon?: string;

  /**
   * Whether the input is readonly
   * @default false
   */
  @Input() readonly = false;

  /**
   * Whether the input is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Custom error messages for validation rules
   * @default {}
   */
  @Input() errorMessages: { [key: string]: string } = {};

  /**
   * Current input value
   * @internal
   */
  value: string | null = null;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-input-text-');

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onChange: (v: string | null) => void = () => {};

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * Writes a value to the input (ControlValueAccessor)
   * @internal
   */
  writeValue(obj: string | null): void {
    this.value = obj == null ? null : obj;
  }

  /**
   * Registers the onChange callback (ControlValueAccessor)
   * @internal
   */
  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers the onTouched callback (ControlValueAccessor)
   * @internal
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state (ControlValueAccessor)
   * @internal
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Handles input event and updates value
   * @internal
   */
  handleInput(event: Event) {
    const v = (event.target as HTMLInputElement).value;
    this.value = v;
    this.onChange(v);
  }

  /**
   * Marks the input as touched
   * @internal
   */
  touch() {
    this.onTouched();
  }

  /**
   * Gets the form control instance
   * @internal
   */
  get control(): AbstractControl | null {
    return this.ngControl ? this.ngControl.control : null;
  }

  /**
   * Determines if validation errors should be shown
   * @internal
   */
  get showErrors(): boolean {
    if (this.externalInvalid) return true;
    const c = this.control;
    return !!(c && c.invalid && c.dirty);
  }

  /**
   * Gets the first validation error key
   * @internal
   */
  get firstErrorKey(): string | null {
    const c = this.control;
    if (!c || !c.errors) return null;
    return Object.keys(c.errors)[0] || null;
  }

  /**
   * Gets the error message to display
   * @internal
   */
  getErrorMessage(): string | null {
    if (this.externalInvalid && this.externalErrorMessage) {
      return this.externalErrorMessage;
    }

    const key = this.firstErrorKey;
    if (!key) return null;
    const c = this.control;
    if (this.errorMessages && this.errorMessages[key])
      return this.errorMessages[key];
    const err = c?.errors || {};
    switch (key) {
      case 'required':
        return `${this.label} is required`;
      case 'minlength':
        return `Minimum ${err['minlength']?.requiredLength} characters required`;
      case 'maxlength':
        return `Maximum ${err['maxlength']?.requiredLength} characters allowed`;
      case 'pattern':
        return `${this.label} is not valid`;
      default:
        return err[key] && typeof err[key] === 'string'
          ? err[key]
          : 'Invalid value';
    }
  }

  /**
   * Checks if the input has a value (works for all input types including number)
   * @internal
   */
  get hasValue(): boolean {
    if (this.value === null || this.value === undefined) return false;
    if (typeof this.value === 'string') return this.value.length > 0;
    return true; // For numbers including 0
  }

  /**
   * Increment number input value
   * @internal
   */
  incrementNumber(inputElement: HTMLInputElement) {
    const step = parseFloat(inputElement.step) || 1;
    const currentValue = parseFloat(this.value || '0');
    const newValue = currentValue + step;

    // Check max constraint if exists
    if (inputElement.max && newValue > parseFloat(inputElement.max)) {
      return;
    }

    this.value = newValue.toString();
    this.onChange(this.value);
    inputElement.value = this.value;
  }

  /**
   * Decrement number input value
   * @internal
   */
  decrementNumber(inputElement: HTMLInputElement) {
    const step = parseFloat(inputElement.step) || 1;
    const currentValue = parseFloat(this.value || '0');
    const newValue = currentValue - step;

    // Check min constraint if exists
    if (inputElement.min && newValue < parseFloat(inputElement.min)) {
      return;
    }

    this.value = newValue.toString();
    this.onChange(this.value);
    inputElement.value = this.value;
  }
}
