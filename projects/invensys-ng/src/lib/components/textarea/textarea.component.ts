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
 * Supported background style options for the textarea
 */
export type ITextareaBackgroundStyle = 'surface' | 'component';

/**
 * Textarea Component
 *
 * A form control multi-line text input component with floating labels and validation support.
 * Fully compatible with Angular Reactive Forms and Template-driven Forms.
 * Supports character counting, auto-resize, and custom error messages.
 *
 * @example
 * ```html
 * <!-- Basic textarea -->
 * <i-textarea label="Description"></i-textarea>
 *
 * <!-- Textarea with reactive form -->
 * <i-textarea
 *   label="Bio"
 *   formControlName="bio"
 *   [rows]="5">
 * </i-textarea>
 *
 * <!-- Textarea with character limit -->
 * <i-textarea
 *   label="Comment"
 *   [(ngModel)]="comment"
 *   [maxLength]="200">
 * </i-textarea>
 *
 * <!-- Full width textarea -->
 * <i-textarea
 *   label="Notes"
 *   [fluid]="true"
 *   [rows]="6"
 *   formControlName="notes">
 * </i-textarea>
 * ```
 *
 * @remarks
 * This component implements ControlValueAccessor for seamless integration with Angular Forms.
 * Supports floating labels, character counting, and custom validation messages.
 */
@Component({
  selector: 'i-textarea',
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class ITextarea implements ControlValueAccessor {
  /**
   * Label text displayed for the textarea
   * @default 'Label'
   */
  @Input() label = 'Label';

  /**
   * HTML id attribute for the textarea element
   */
  @Input() id?: string;

  /**
   * Whether the textarea should take full width of its container
   * @default false
   */
  @Input() fluid = false;

  /**
   * Forces the label to stay in floated position
   * @default false
   */
  @Input() forceFloated = false;

  /**
   * Enables floating label animation
   * @default true
   */
  @Input() useFloatLabel = true;

  /**
   * Placeholder text for the textarea
   */
  @Input() placeholder?: string;

  /**
   * Number of visible text rows
   * @default 4
   */
  @Input() rows = 4;

  /**
   * Maximum number of characters allowed (also shows character counter)
   */
  @Input() maxLength?: number;

  /**
   * Whether the textarea can be resized by the user
   * @default true
   */
  @Input() resizable = true;

  /**
   * Whether the textarea is readonly
   * @default false
   */
  @Input() readonly = false;

  /**
   * Whether the textarea is disabled
   * @default false
   */
  @Input() disabled = false;

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
   * Background style of the textarea
   * @default 'surface'
   */
  @Input() backgroundStyle: ITextareaBackgroundStyle = 'surface';

  /**
   * Custom error messages for validation rules
   * @default {}
   */
  @Input() errorMessages: { [key: string]: string } = {};

  /**
   * Percentage threshold (0–100) at which to show the character count warning colour
   * @default 80
   */
  @Input() charCountWarnAt = 80;

  /**
   * Current textarea value
   * @internal
   */
  value: string | null = null;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-textarea-');

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
   * Writes a value to the textarea (ControlValueAccessor)
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
    const v = (event.target as HTMLTextAreaElement).value;
    this.value = v;
    this.onChange(v);
  }

  /**
   * Marks the textarea as touched
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
   * Whether the textarea has a non-empty value
   * @internal
   */
  get hasValue(): boolean {
    if (this.value === null || this.value === undefined) return false;
    return this.value.length > 0;
  }

  /**
   * Current character count
   * @internal
   */
  get currentLength(): number {
    return this.value?.length ?? 0;
  }

  /**
   * Whether the character count is in the warning range
   * @internal
   */
  get charCountWarning(): boolean {
    if (!this.maxLength) return false;
    const pct = (this.currentLength / this.maxLength) * 100;
    return pct >= this.charCountWarnAt && pct < 100;
  }

  /**
   * Whether the character count has exceeded the limit
   * @internal
   */
  get charCountOver(): boolean {
    if (!this.maxLength) return false;
    return this.currentLength >= this.maxLength;
  }
}
