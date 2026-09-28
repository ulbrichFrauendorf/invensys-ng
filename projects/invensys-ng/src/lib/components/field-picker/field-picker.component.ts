import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ICheckbox } from '../checkbox/checkbox.component';
import { IInputText } from '../input-text/input-text.component';
import { NoContentComponent } from '../no-content/no-content.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/** A selectable item in a grouped field catalog. Keys must be unique. */
export interface FieldPickerOption {
  key: string;
  label: string;
  group?: string;
  description?: string;
  disabled?: boolean;
}

/**
 * Searchable, grouped selection of fields. The form value is an array of keys.
 * Composes the shared input and checkbox controls; contains no report semantics.
 * @example
 * ```html
 * <i-field-picker [options]="fields" [(ngModel)]="selectedKeys" />
 * ```
 */
@Component({
  selector: 'i-field-picker',
  standalone: true,
  imports: [FormsModule, ICheckbox, IInputText, NoContentComponent],
  templateUrl: './field-picker.component.html',
  styleUrl: './field-picker.component.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IFieldPicker), multi: true }],
  host: { '(focusout)': 'markTouched()' },
})
export class IFieldPicker implements ControlValueAccessor {
  /** Available fields. Selection is retained when options are filtered or reloaded. */
  @Input() options: FieldPickerOption[] = [];
  /** Accessible name of the grouped selection. */
  @Input() ariaLabel = 'Fields';
  /** Label on the search input. */
  @Input() searchLabel = 'Search fields';
  /** Heading for options without a group. */
  @Input() ungroupedLabel = 'Other';
  /** Message shown when the search has no matches. */
  @Input() emptyMessage = 'No matching fields.';
  /** Prevents selection changes but allows searching. */
  @Input() readonly = false;
  /** Disables the control, including search. Angular Forms can set this state. */
  @Input() disabled = false;
  /** Emits a new array after a user changes the selection. */
  @Output() onChange = new EventEmitter<string[]>();

  readonly componentId = UniqueComponentId('i-field-picker-');
  search = '';
  value: string[] = [];
  private change: (value: string[]) => void = () => {};
  private touched: () => void = () => {};

  get groups(): { name: string; options: FieldPickerOption[] }[] {
    const term = this.search.trim().toLocaleLowerCase();
    const groups = new Map<string, FieldPickerOption[]>();
    for (const option of this.options) {
      const name = option.group || this.ungroupedLabel;
      if (term && !`${option.label} ${name} ${option.description ?? ''}`.toLocaleLowerCase().includes(term)) continue;
      groups.set(name, [...(groups.get(name) ?? []), option]);
    }
    return Array.from(groups, ([name, options]) => ({ name, options }));
  }

  select(option: FieldPickerOption, checked: boolean): void {
    if (this.disabled || this.readonly || option.disabled || this.value.includes(option.key) === checked) return;
    const remaining = this.value.filter(key => key !== option.key);
    this.value = checked ? [...remaining, option.key] : remaining;
    this.change([...this.value]);
    this.onChange.emit([...this.value]);
    this.markTouched();
  }

  writeValue(value: string[] | null): void { this.value = [...(value ?? [])]; }
  registerOnChange(fn: (value: string[]) => void): void { this.change = fn; }
  registerOnTouched(fn: () => void): void { this.touched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }
  markTouched(): void { this.touched(); }
}
