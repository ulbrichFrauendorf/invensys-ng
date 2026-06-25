import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  HostListener,
  Output,
  EventEmitter,
  forwardRef,
  Injector,
  signal,
  computed,
  InputSignal,
  input,
} from '@angular/core';

import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  AbstractControl,
} from '@angular/forms';
import { IInputText } from '../input-text/input-text.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Option data structure for the select component
 */
export interface SelectOption {
  [key: string]: any;
}

/**
 * Select Component
 *
 * A dropdown select component with filtering, searching, and form control support.
 * Uses Angular signals for reactive state management and is fully compatible with Angular Forms.
 *
 * @example
 * ```html
 * <!-- Basic select -->
 * <i-select
 *   label="Country"
 *   [options]="countries"
 *   optionLabel="name"
 *   formControlName="country">
 * </i-select>
 *
 * <!-- Select with filtering -->
 * <i-select
 *   label="City"
 *   [options]="cities"
 *   optionLabel="name"
 *   [filter]="true"
 *   filterBy="name"
 *   formControlName="city">
 * </i-select>
 *
 * <!-- Select with clear button -->
 * <i-select
 *   label="Category"
 *   [options]="categories"
 *   optionLabel="label"
 *   [showClear]="true"
 *   (onClear)="handleClear()"
 *   formControlName="category">
 * </i-select>
 *
 * <!-- Full width select -->
 * <i-select
 *   label="Status"
 *   [options]="statuses"
 *   optionLabel="name"
 *   [fluid]="true"
 *   formControlName="status">
 * </i-select>
 * ```
 *
 * @remarks
 * This component implements ControlValueAccessor for seamless integration with Angular Forms.
 * Uses signals for efficient filtering and option management.
 */
@Component({
  selector: 'i-select',
  standalone: true,
  imports: [FormsModule, IInputText],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ISelect),
      multi: true,
    },
  ],
})
export class ISelect implements ControlValueAccessor {
  /**
   * Label text displayed for the select
   * @default 'Select'
   */
  @Input() label = 'Select';

  /**
   * Array of options to display in the dropdown
   */
  options: InputSignal<SelectOption[] | null | undefined> = input<
    SelectOption[] | null | undefined
  >([]);

  /**
   * Property name to use as the display label for options
   */
  @Input({ required: true }) optionLabel!: string;

  /**
   * Placeholder text when no option is selected
   * @default 'Select an option'
   */
  @Input() placeholder = 'Select an option';

  /**
   * Whether the internal input should use float label style
   * @default true
   */
  @Input() useFloatLabel = true;

  /**
   * HTML id attribute for the select element
   */
  @Input() id?: string;

  /**
   * Whether the select should take full width of its container
   * @default false
   */
  @Input() fluid = false;

  /**
   * Whether to show a clear button to reset selection
   * @default false
   */
  @Input() showClear = false;

  /**
   * Enables filtering/searching of options
   * @default true
   */
  @Input() filter = true;

  /**
   * Property name to use for filtering
   * @default 'label'
   */
  @Input() filterBy = 'label';

  /**
   * Custom error messages for validation rules
   * @default {}
   */
  @Input() errorMessages: { [key: string]: string } = {};

  /**
   * Whether the select input is readonly
   * @default true
   */
  @Input() readonly = true;

  /**
   * Event emitted when selection changes
   */
  @Output() onChange = new EventEmitter<any>();

  /**
   * Event emitted when selection is cleared
   */
  @Output() onClear = new EventEmitter<void>();

  /**
   * Reference to the input text component
   * @internal
   */
  @ViewChild('inputText') inputTextRef!: IInputText;

  /**
   * Reference to the dropdown element
   * @internal
   */
  @ViewChild('dropdown', { static: false }) dropdownRef!: ElementRef;

  /**
   * Reference to the search input element
   * @internal
   */
  @ViewChild('searchInput', { static: false }) searchInputRef!: ElementRef;

  /**
   * Whether the dropdown is currently open
   * @internal
   */
  isOpen = false;

  /**
   * Current filter/search value
   * @internal
   */
  filterValue = signal('');

  /**
   * Computed filtered options based on search value
   * @internal
   */
  filteredOptions = computed(() => {
    const currentOptions = this.options() || [];
    const currentFilterValue = this.filterValue();

    if (!Array.isArray(currentOptions)) {
      return [];
    }

    if (!this.filter || !currentFilterValue.trim()) {
      return [...currentOptions];
    } else {
      const filterText = currentFilterValue.toLowerCase();
      return currentOptions.filter((option) => {
        const searchValue = this.getOptionSearchValue(option).toLowerCase();
        return searchValue.includes(filterText);
      });
    }
  });

  /**
   * Display value for the input text component
   * @internal
   */
  get inputValue(): string {
    return this.getSelectedLabel() || '';
  }

  set inputValue(value: string) {
    // Setter required for binding, but value is managed internally
  }

  /**
   * Internal selected value storage
   * @internal
   */
  private _value: any = null;

  /**
   * Gets the current selected value
   * @internal
   */
  get value(): any {
    return this._value;
  }

  /**
   * Sets the selected value and updates the display
   * @internal
   */
  set value(val: any) {
    this._value = val;
    if (this.inputTextRef) {
      this.inputTextRef.value = this.getSelectedLabel() || null;
    }
  }

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

  /**
   * NgControl reference for form validation
   * @internal
   */
  public ngControl: NgControl | null = null;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-select-');

  constructor(private injector: Injector) {
    setTimeout(() => {
      this.ngControl = this.injector.get(NgControl, null);
    });
  }

  /**
   * Toggles the dropdown open/closed state
   * @internal
   */
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterValue.set('');
      setTimeout(() => {
        if (
          this.filter &&
          this.searchInputRef &&
          this.searchInputRef.nativeElement
        ) {
          this.searchInputRef.nativeElement.focus();
        }
      });
    }
  }

  /**
   * Selects an option from the dropdown
   * @internal
   */
  selectOption(option: SelectOption) {
    const newValue = this.getOptionValue(option);
    this.value = newValue;
    this.onChange.emit(newValue);
    this.onChangeCallback(newValue);
    this.onTouchedCallback();
    this.isOpen = false;
    this.filterValue.set('');
  }

  /**
   * Clears the current selection
   * @internal
   */
  clearSelection() {
    this.value = null;
    this.onClear.emit();
    this.onChangeCallback(null);
    this.onTouchedCallback();
  }

  /**
   * Gets the display label for an option
   * @internal
   */
  getOptionLabel(option: SelectOption): string {
    return option[this.optionLabel] || option['label'] || String(option);
  }

  /**
   * Gets the value for an option
   * @internal
   */
  getOptionValue(option: SelectOption): any {
    return option;
  }

  /**
   * Checks if an option is currently selected
   * @internal
   */
  isOptionSelected(option: SelectOption): boolean {
    if (this.value === null || this.value === undefined) {
      return false;
    }

    return JSON.stringify(option) === JSON.stringify(this.value);
  }

  /**
   * Gets the searchable value for filtering
   * @internal
   */
  getOptionSearchValue(option: SelectOption): string {
    if (this.filterBy && option[this.filterBy]) {
      return String(option[this.filterBy]);
    }
    return this.getOptionLabel(option);
  }

  /**
   * Gets the label of the currently selected option
   * @internal
   */
  getSelectedLabel(): string {
    if (this.value === null || this.value === undefined) {
      return '';
    }

    const currentOptions = this.options() || [];
    if (!Array.isArray(currentOptions)) {
      return String(this.value);
    }

    const selectedOption = currentOptions.find((option: SelectOption) =>
      this.isOptionSelected(option)
    );

    return selectedOption
      ? this.getOptionLabel(selectedOption)
      : String(this.value);
  }

  /**
   * Handles clicks outside the dropdown to close it
   * @internal
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (
      this.isOpen &&
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(event.target as Node)
    ) {
      this.isOpen = false;
      this.filterValue.set('');
    }
  }

  /**
   * Writes a value to the select (ControlValueAccessor)
   * @internal
   */
  writeValue(value: any): void {
    this._value = value;
    if (this.inputTextRef) {
      this.inputTextRef.value = this.getSelectedLabel() || null;
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
  setDisabledState?(isDisabled: boolean): void {
    // Not implemented - can be added if needed
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
    const key = this.firstErrorKey;
    if (!key) return null;
    const c = this.control;
    if (this.errorMessages && this.errorMessages[key])
      return this.errorMessages[key];
    const err = c?.errors || {};
    switch (key) {
      case 'required':
        return `${this.label} is required`;
      default:
        return err[key] && typeof err[key] === 'string'
          ? err[key]
          : 'Invalid selection';
    }
  }
}
