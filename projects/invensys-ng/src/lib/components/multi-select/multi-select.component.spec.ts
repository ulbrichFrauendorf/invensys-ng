import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IMultiSelect, MultiSelectOption } from './multi-select.component';

describe('IMultiSelect', () => {
  let component: IMultiSelect;
  let fixture: ComponentFixture<IMultiSelect>;

  const mockOptions: MultiSelectOption[] = [
    { id: 1, name: 'Option 1', label: 'First Option' },
    { id: 2, name: 'Option 2', label: 'Second Option' },
    { id: 3, name: 'Option 3', label: 'Third Option' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IMultiSelect, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IMultiSelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    component.optionLabel = 'label';
    component.optionValue = 'id';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.label).toBe('Multi Select');
      expect(component.placeholder).toBe('Select options');
      expect(component.fluid).toBe(false);
      expect(component.showClear).toBe(false);
      expect(component.filter).toBe(true);
      expect(component.maxSelectedLabels).toBe(3);
      expect(component.selectedItemsLabel).toBe('{0} items selected');
      expect(component.disabled).toBe(false);
      expect(component.readonly).toBe(true);
    });

    it('should accept options signal', () => {
      const newOptions = [{ id: 4, label: 'New Option' }];
      fixture.componentRef.setInput('options', newOptions);
      fixture.detectChanges();
      expect(component.options()).toEqual(newOptions);
    });
  });

  describe('Dropdown functionality', () => {
    it('should toggle dropdown', () => {
      expect(component.isOpen).toBe(false);
      component.toggleDropdown();
      expect(component.isOpen).toBe(true);
      component.toggleDropdown();
      expect(component.isOpen).toBe(false);
    });
  });

  describe('Option selection', () => {
    it('should select multiple options', () => {
      component.toggleOption(mockOptions[0]);
      component.toggleOption(mockOptions[1]);
      expect(component.value.length).toBe(2);
      expect(component.value).toContain(mockOptions[0]['id']);
      expect(component.value).toContain(mockOptions[1]['id']);
    });

    it('should deselect an option', () => {
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      component.toggleOption(mockOptions[0]);
      expect(component.value.length).toBe(1);
      expect(component.value).not.toContain(mockOptions[0]['id']);
    });

    it('should emit onChange event on toggle', () => {
      spyOn(component.onChange, 'emit');
      component.toggleOption(mockOptions[0]);
      expect(component.onChange.emit).toHaveBeenCalledWith([mockOptions[0]['id']]);
    });

    it('should store full objects when optionValue is not provided', () => {
      component.optionValue = undefined;
      component.toggleOption(mockOptions[0]);
      expect(component.value[0]).toEqual(mockOptions[0]);
    });
  });

  describe('Selected item display', () => {
    it('should display comma-separated labels when under maxSelectedLabels', () => {
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      const display = component.getDisplayLabel();
      expect(display).toContain('First Option');
      expect(display).toContain('Second Option');
    });

    it('should display item count when exceeding maxSelectedLabels', () => {
      component.maxSelectedLabels = 2;
      component.value = [
        mockOptions[0]['id'],
        mockOptions[1]['id'],
        mockOptions[2]['id'],
      ];
      const display = component.getDisplayLabel();
      expect(display).toBe('3 items selected');
    });

    it('should return empty string when no selection', () => {
      component.value = [];
      expect(component.getDisplayLabel()).toBe('');
    });
  });

  describe('Clear functionality', () => {
    it('should clear all selections', () => {
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      component.clearSelection();
      expect(component.value).toEqual([]);
    });

    it('should emit onClear event', () => {
      spyOn(component.onClear, 'emit');
      component.clearSelection();
      expect(component.onClear.emit).toHaveBeenCalled();
    });
  });

  describe('Remove selected item', () => {
    it('should remove specific item from selection', () => {
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'stopPropagation');

      component.removeSelectedItem(mockOptions[0]['id'], mockEvent);

      expect(component.value.length).toBe(1);
      expect(component.value).not.toContain(mockOptions[0]['id']);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Option state', () => {
    it('should identify selected options', () => {
      component.value = [mockOptions[0]['id']];
      expect(component.isOptionSelected(mockOptions[0])).toBe(true);
      expect(component.isOptionSelected(mockOptions[1])).toBe(false);
    });
  });

  describe('Filtering', () => {
    it('should filter options by search text', () => {
      component.filterValue.set('first');
      fixture.detectChanges();
      const filtered = component.filteredOptions();
      expect(filtered.length).toBe(1);
      expect(filtered[0]['label']).toContain('First');
    });

    it('should show all options when filter is empty', () => {
      component.filterValue.set('');
      fixture.detectChanges();
      expect(component.filteredOptions().length).toBe(mockOptions.length);
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value', () => {
      const values = [mockOptions[0]['id'], mockOptions[1]['id']];
      component.writeValue(values);
      expect(component.value).toEqual(values);
    });

    it('should handle null write value', () => {
      component.writeValue(null as any);
      expect(component.value).toEqual([]);
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      component.toggleOption(mockOptions[0]);
      expect(fn).toHaveBeenCalled();
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      component.toggleOption(mockOptions[0]);
      expect(fn).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('should show errors when control is invalid and dirty', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;
      expect(component.showErrors).toBe(true);
    });

    it('should get error message for required field', () => {
      component.label = 'Tags';
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;
      expect(component.getErrorMessage()).toBe('Tags is required');
    });
  });

  describe('Edge cases', () => {
    it('should handle null options array', () => {
      fixture.componentRef.setInput('options', null);
      fixture.detectChanges();
      expect(component.filteredOptions()).toEqual([]);
    });

    it('should handle undefined options array', () => {
      fixture.componentRef.setInput('options', undefined);
      fixture.detectChanges();
      expect(component.filteredOptions()).toEqual([]);
    });

    it('should handle non-array options', () => {
      fixture.componentRef.setInput('options', 'not an array' as any);
      fixture.detectChanges();
      expect(component.filteredOptions()).toEqual([]);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-multi-select-');
    });

    it('should use custom id when provided', () => {
      component.id = 'custom-multi-select';
      fixture.detectChanges();
      expect(component.id).toBe('custom-multi-select');
    });
  });

  describe('Selected labels', () => {
    it('should get labels for selected items', () => {
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      const labels = component.getSelectedLabels();
      expect(labels).toEqual(['First Option', 'Second Option']);
    });

    it('should handle empty selection', () => {
      component.value = [];
      const labels = component.getSelectedLabels();
      expect(labels).toEqual([]);
    });

    it('should handle full object values', () => {
      component.optionValue = undefined;
      component.value = [mockOptions[0], mockOptions[1]];
      const labels = component.getSelectedLabels();
      expect(labels).toEqual(['First Option', 'Second Option']);
    });
  });

  describe('Custom error messages', () => {
    it('should use custom error messages', () => {
      component.errorMessages = { required: 'Please select at least one option' };
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;
      expect(component.getErrorMessage()).toBe('Please select at least one option');
    });

    it('should handle minlength error', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { minlength: { requiredLength: 2 } },
        },
      } as any;
      expect(component.getErrorMessage()).toBe('Minimum 2 items required');
    });

    it('should handle minArrayLength error', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { minArrayLength: { requiredLength: 3 } },
        },
      } as any;
      expect(component.getErrorMessage()).toBe('Minimum 3 items required');
    });

    it('should handle maxlength error', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { maxlength: { requiredLength: 5 } },
        },
      } as any;
      expect(component.getErrorMessage()).toBe('Maximum 5 items allowed');
    });

    it('should return default message for unknown error', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { customError: { some: 'data' } },
        },
      } as any;
      expect(component.getErrorMessage()).toBe('Invalid selection');
    });

    it('should handle string error values', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { customError: 'Custom error string' },
        },
      } as any;
      expect(component.getErrorMessage()).toBe('Custom error string');
    });
  });

  describe('TrackBy functionality', () => {
    it('should track by value', () => {
      const value = mockOptions[0]['id'];
      expect(component.trackByValue(0, value)).toBe(value);
    });
  });

  describe('Option value extraction', () => {
    it('should get option label', () => {
      expect(component.getOptionLabel(mockOptions[0])).toBe('First Option');
    });

    it('should get option value with optionValue set', () => {
      expect(component.getOptionValue(mockOptions[0])).toBe(1);
    });

    it('should get option value without optionValue', () => {
      component.optionValue = undefined;
      expect(component.getOptionValue(mockOptions[0])).toEqual(mockOptions[0]);
    });

    it('should get option search value', () => {
      component.filterBy = 'name';
      expect(component.getOptionSearchValue(mockOptions[0])).toBe('Option 1');
    });

    it('should fallback to label for search value', () => {
      component.filterBy = 'nonexistent';
      expect(component.getOptionSearchValue(mockOptions[0])).toBe('First Option');
    });
  });
});
