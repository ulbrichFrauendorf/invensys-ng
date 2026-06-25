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
 * Supported toggle sizes
 */
export type IToggleSize = 'small' | 'medium' | 'large';

/**
 * Toggle Component
 *
 * A form control toggle switch component that switches between true and false.
 * Supports multiple sizes and states, and is fully compatible with Angular Reactive Forms.
 *
 * @example
 * ```html
 * <!-- Basic toggle -->
 * <i-toggle label="Enable notifications"></i-toggle>
 *
 * <!-- Toggle with ngModel -->
 * <i-toggle
 *   label="Dark mode"
 *   [(ngModel)]="darkMode">
 * </i-toggle>
 *
 * <!-- Toggle in reactive form -->
 * <i-toggle
 *   label="Accept terms"
 *   formControlName="acceptTerms">
 * </i-toggle>
 *
 * <!-- Disabled toggle -->
 * <i-toggle
 *   label="Disabled option"
 *   [disabled]="true">
 * </i-toggle>
 *
 * <!-- Different sizes -->
 * <i-toggle label="Small" size="small"></i-toggle>
 * <i-toggle label="Medium" size="medium"></i-toggle>
 * <i-toggle label="Large" size="large"></i-toggle>
 * ```
 *
 * @remarks
 * This component implements ControlValueAccessor for seamless integration with Angular Forms.
 */
@Component({
  selector: 'i-toggle',
  standalone: true,
  imports: [],
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IToggle),
      multi: true,
    },
  ],
})
export class IToggle implements ControlValueAccessor {
  /**
   * Label text displayed next to the toggle
   */
  @Input() label?: string;

  /**
   * HTML id attribute for the toggle element
   */
  @Input() id?: string;

  /**
   * Whether the toggle is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Whether the toggle is readonly (cannot be changed by user)
   * @default false
   */
  @Input() readonly = false;

  /**
   * Size of the toggle
   * @default 'medium'
   */
  @Input() size: IToggleSize = 'medium';

  /**
   * Checked (on) state of the toggle
   */
  @Input()
  set checked(value: boolean) {
    this._checked = !!value;
  }
  get checked(): boolean {
    return this._checked;
  }

  /**
   * Event emitted when toggle state changes
   */
  @Output() onChange = new EventEmitter<boolean>();

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-toggle-');

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
   * Toggles the switch state
   * @internal
   */
  toggle(): void {
    if (this.disabled || this.readonly) return;

    this._checked = !this._checked;

    this.onChangeCallback(this._checked);
    this.onTouchedCallback();

    // Deferred to allow Angular's change detection cycle to process the new
    // value before external listeners receive the event (mirrors checkbox pattern)
    setTimeout(() => {
      this.onChange.emit(this._checked);
    }, 0);
  }

  /**
   * Handles keyboard events (Space/Enter) — only prevents default when interactive
   * @internal
   */
  handleKeydown(event: Event): void {
    if (this.disabled || this.readonly) return;
    event.preventDefault();
    this.toggle();
  }

  /**
   * Writes a value to the toggle (ControlValueAccessor)
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
