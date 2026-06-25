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
  WritableSignal,
} from '@angular/core';

import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  AbstractControl,
} from '@angular/forms';
import { IChipsComponent, ChipItem } from '../chips/chips.component';
import { ICheckbox } from '../checkbox/checkbox.component';
import { IInputText } from '../input-text/input-text.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Option data structure for the multi-select component
 */
export interface MultiSelectOption {
  [key: string]: any;
}

/**
 * Multi-Select Component
 *
 * A multi-selection dropdown component with filtering, chips display, and form control support.
 * Uses Angular signals for reactive state management and is fully compatible with Angular Forms.
 *
 * @example
 * ```html
 * <!-- Basic multi-select -->
 * <i-multi-select
 *   label="Skills"
 *   [options]="skills"
 *   optionLabel="name"
 *   formControlName="selectedSkills">
 * </i-multi-select>
 *
 * <!-- Multi-select with filtering -->
 * <i-multi-select
 *   label="Countries"
 *   [options]="countries"
 *   optionLabel="name"
 *   [filter]="true"
 *   filterBy="name"
 *   formControlName="countries">
 * </i-multi-select>
 *
 * <!-- Multi-select with clear button -->
 * <i-multi-select
 *   label="Tags"
 *   [options]="tags"
 *   optionLabel="label"
 *   [showClear]="true"
 *   [maxSelectedLabels]="5"
 *   (onClear)="handleClear()"
 *   formControlName="tags">
 * </i-multi-select>
 *
 * <!-- Full width multi-select -->
 * <i-multi-select
 *   label="Permissions"
 *   [options]="permissions"
 *   optionLabel="name"
 *   [fluid]="true"
 *   formControlName="permissions">
 * </i-multi-select>
 * ```
 *
 * @remarks
 * This component implements ControlValueAccessor for seamless integration with Angular Forms.
 * Uses signals for efficient filtering and option management.
 * Selected items are displayed as chips when count is within maxSelectedLabels.
 */
@Component({
  selector: 'i-multi-select',
  standalone: true,
  imports: [FormsModule, IChipsComponent, ICheckbox, IInputText],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IMultiSelect),
      multi: true,
    },
  ],
})
export class IMultiSelect implements ControlValueAccessor {
  /**
   * Label text displayed for the multi-select
   * @default 'Multi Select'
   */
  @Input() label = 'Multi Select';

  /**
   * Array of options to display in the dropdown
   */
  options: InputSignal<MultiSelectOption[] | null | undefined> = input<
    MultiSelectOption[] | null | undefined
  >([]);

  /**
   * Property name to use as the display label for options
   */
  @Input({ required: true }) optionLabel!: string;

  /**
   * Placeholder text when no options are selected
   * @default 'Select options'
   */
  @Input() placeholder = 'Select options';

  /**
   * HTML id attribute for the multi-select element
   */
  @Input() id?: string;

  /**
   * Whether the multi-select should take full width of its container
   * @default false
   */
  @Input() fluid = false;

  /**
   * Whether to show a clear button to reset all selections
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
   * Maximum number of selected items to display as labels before showing count
   * @default 3
   */
  @Input() maxSelectedLabels = 3;

  /**
   * Template string for selected items count label (use {0} for count placeholder)
   * @default '{0} items selected'
   */
  @Input() selectedItemsLabel = '{0} items selected';

  /**
   * Custom error messages for validation rules
   * @default {}
   */
  @Input() errorMessages: { [key: string]: string } = {};

  /**
   * Whether the multi-select is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Whether the multi-select input is readonly
   * @default true
   */
  @Input() readonly = true;

  /**
   * Event emitted when selection changes
   */
  @Output() onChange = new EventEmitter<any[]>();

  /**
   * Event emitted when all selections are cleared
   */
  @Output() onClear = new EventEmitter<void>();

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
   * Computed chip items from selected values
   * @internal
   */
  selectedChips = computed<ChipItem[]>(() => {
    const currentValue = this._value();

    return currentValue.map((val) => {
      const label = this.getOptionLabel(val);

      return {
        label,
        value: val,
        removable: !this.disabled,
      };
    });
  });

  /**
   * Internal selected values storage as a signal
   * @internal
   */
  private _value: WritableSignal<any[]> = signal([]);

  /**
   * Gets the current selected values array
   * @internal
   */
  get value(): any[] {
    return this._value();
  }

  /**
   * Sets the selected values and updates the display
   * @internal
   */
  set value(val: any[]) {
    this._value.set(val || []);
  }

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onChangeCallback: (value: any[]) => void = () => {};

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
  componentId = UniqueComponentId('i-multi-select-');

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
   * Toggles selection state of an option
   * @internal
   */
  toggleOption(option: MultiSelectOption) {
    const currentValues = [...this.value];
    const optionValue = this.getOptionValue(option);

    const index = currentValues.findIndex(
      (val) => JSON.stringify(val) === JSON.stringify(optionValue)
    );

    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(optionValue);
    }

    this.value = currentValues;
    this.onChange.emit(currentValues);
    this.onChangeCallback(currentValues);
    this.onTouchedCallback();
  }

  /**
   * Checks if an option is currently selected
   * @internal
   */
  isOptionSelected(option: MultiSelectOption): boolean {
    const optionValue = this.getOptionValue(option);
    return this.value.some(
      (val) => JSON.stringify(val) === JSON.stringify(optionValue)
    );
  }

  /**
   * Clears all selections
   * @internal
   */
  clearSelection() {
    this.value = [];
    this.onClear.emit();
    this.onChangeCallback([]);
    this.onTouchedCallback();
  }

  /**
   * Removes a specific selected item from chips
   * @internal
   */
  onChipRemove(event: { chip: ChipItem; originalEvent: Event }) {
    event.originalEvent.stopPropagation();
    const currentValues = [...this.value];

    const index = currentValues.findIndex(
      (val) => JSON.stringify(val) === JSON.stringify(event.chip.value)
    );

    if (index > -1) {
      currentValues.splice(index, 1);
      this.value = currentValues;
      this.onChange.emit(currentValues);
      this.onChangeCallback(currentValues);
      this.onTouchedCallback();
    }
  }

  /**
   * Handles close all event from chips component
   * @internal
   */
  onChipsCloseAll() {
    this.clearSelection();
  }

  /**
   * Gets the display label for an option
   * @internal
   */
  getOptionLabel(option: MultiSelectOption): string {
    return option[this.optionLabel] || option['label'] || String(option);
  }

  /**
   * Gets the value for an option
   * @internal
   */
  getOptionValue(option: MultiSelectOption): any {
    return option;
  }

  /**
   * Gets the searchable value for filtering
   * @internal
   */
  getOptionSearchValue(option: MultiSelectOption): string {
    if (this.filterBy && option[this.filterBy]) {
      return String(option[this.filterBy]);
    }
    return this.getOptionLabel(option);
  }

  /**
   * Gets labels for all selected items
   * @internal
   */
  getSelectedLabels(): string[] {
    return this.value.map((val) => {
      return this.getOptionLabel(val);
    });
  }

  /**
   * Gets the display label for the input (shows labels or count)
   * @internal
   */
  getDisplayLabel(): string {
    if (!this.value || this.value.length === 0) {
      return '';
    }

    const selectedLabels = this.getSelectedLabels();

    if (selectedLabels.length <= this.maxSelectedLabels) {
      return selectedLabels.join(', ');
    } else {
      return this.selectedItemsLabel.replace(
        '{0}',
        selectedLabels.length.toString()
      );
    }
  }

  /**
   * TrackBy function for ngFor optimization
   * @internal
   */
  trackByValue(index: number, value: any): any {
    return value;
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
   * Writes a value to the multi-select (ControlValueAccessor)
   * @internal
   */
  writeValue(value: any[]): void {
    this._value.set(value || []);
  }

  /**
   * Registers the onChange callback (ControlValueAccessor)
   * @internal
   */
  registerOnChange(fn: (value: any[]) => void): void {
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
    this.disabled = isDisabled;
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
      case 'minlength':
        return `Minimum ${err['minlength']?.requiredLength} items required`;
      case 'minArrayLength':
        return `Minimum ${err['minArrayLength']?.requiredLength} items required`;
      case 'maxlength':
        return `Maximum ${err['maxlength']?.requiredLength} items allowed`;
      default:
        return err[key] && typeof err[key] === 'string'
          ? err[key]
          : 'Invalid selection';
    }
  }
}
