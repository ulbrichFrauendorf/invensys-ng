import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Supported checkbox sizes
 */
export type ICheckboxSize = 'small' | 'medium' | 'large';

/**
 * Checkbox Component
 *
 * A form control checkbox component with multiple sizes and states.
 * Supports indeterminate state and is fully compatible with Angular Reactive Forms.
 *
 * @example
 * ```html
 * <!-- Basic checkbox -->
 * <i-checkbox label="Accept terms"></i-checkbox>
 *
 * <!-- Checkbox with ngModel -->
 * <i-checkbox
 *   label="Subscribe to newsletter"
 *   [(ngModel)]="subscribed">
 * </i-checkbox>
 *
 * <!-- Checkbox in reactive form -->
 * <i-checkbox
 *   label="Agree to privacy policy"
 *   formControlName="agreedToPolicy">
 * </i-checkbox>
 *
 * <!-- Disabled checkbox -->
 * <i-checkbox
 *   label="Disabled option"
 *   [disabled]="true">
 * </i-checkbox>
 *
 * <!-- Indeterminate checkbox (e.g., for "select all") -->
 * <i-checkbox
 *   label="Select All"
 *   [indeterminate]="someSelected">
 * </i-checkbox>
 *
 * <!-- Different sizes -->
 * <i-checkbox label="Small" size="small"></i-checkbox>
 * <i-checkbox label="Medium" size="medium"></i-checkbox>
 * <i-checkbox label="Large" size="large"></i-checkbox>
 * ```
 *
 * @remarks
 * This component implements ControlValueAccessor for seamless integration with Angular Forms.
 * The indeterminate state is useful for parent checkboxes in hierarchical selections.
 */
@Component({
  selector: 'i-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ICheckbox),
      multi: true,
    },
  ],
})
export class ICheckbox implements ControlValueAccessor {
  /**
   * Label text displayed next to the checkbox
   */
  @Input() label?: string;

  /**
   * HTML id attribute for the checkbox input element
   */
  @Input() id?: string;

  /**
   * Whether the checkbox is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Whether the checkbox is readonly (cannot be changed by user)
   * @default false
   */
  @Input() readonly = false;

  /**
   * Size of the checkbox
   * @default 'medium'
   */
  @Input() size: ICheckboxSize = 'medium';

  /**
   * Whether the checkbox is in indeterminate state
   * @default false
   */
  @Input() indeterminate = false;

  /**
   * Checked state of the checkbox
   */
  @Input()
  set checked(value: boolean) {
    this._checked = !!value;
  }
  get checked(): boolean {
    return this._checked;
  }

  /**
   * Event emitted when checkbox state changes
   */
  @Output() onChange = new EventEmitter<boolean>();

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-checkbox-');

  /**
   * Internal checked state
   * @internal
   */
  private _checked = false;

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onChangeCallback: (value: boolean) => void = () => {};

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onTouchedCallback: () => void = () => {};

  /**
   * Toggles the checkbox state
   * @internal
   */
  toggle(): void {
    if (this.disabled || this.readonly) return;

    if (this.indeterminate) {
      this.indeterminate = false;
      this._checked = false;
    } else {
      this._checked = !this._checked;
    }

    this.onChangeCallback(this._checked);
    this.onTouchedCallback();

    setTimeout(() => {
      this.onChange.emit(this._checked);
    }, 0);
  }

  /**
   * Writes a value to the checkbox (ControlValueAccessor)
   * @internal
   */
  writeValue(value: boolean): void {
    this._checked = !!value;
  }

  /**
   * Registers the onChange callback (ControlValueAccessor)
   * @internal
   */
  registerOnChange(fn: (value: boolean) => void): void {
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
