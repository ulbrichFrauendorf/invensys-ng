import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IListbox, ListboxOption } from './listbox.component';

describe('IListbox', () => {
  let component: IListbox;
  let fixture: ComponentFixture<IListbox>;

  const mockOptions: ListboxOption[] = [
    { id: 1, name: 'Option 1', label: 'First Option' },
    { id: 2, name: 'Option 2', label: 'Second Option' },
    { id: 3, name: 'Option 3', label: 'Third Option' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IListbox, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IListbox);
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
      expect(component.label).toBe('List Box');
      expect(component.fluid).toBe(false);
      expect(component.showClear).toBe(false);
      expect(component.filter).toBe(true);
      expect(component.maxSelectedLabels).toBe(3);
      expect(component.disabled).toBe(false);
      expect(component.multiple).toBe(true);
      expect(component.readonly).toBe(true);
    });

    it('should accept multiple input', () => {
      component.multiple = false;
      fixture.detectChanges();
      expect(component.multiple).toBe(false);
    });
  });

  describe('Multiple selection mode', () => {
    beforeEach(() => {
      component.multiple = true;
    });

    it('should select multiple options', () => {
      component.toggleOption(mockOptions[0]);
      component.toggleOption(mockOptions[1]);
      expect(Array.isArray(component.value)).toBe(true);
      expect(component.value.length).toBe(2);
    });

    it('should deselect an option', () => {
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      component.toggleOption(mockOptions[0]);
      expect(component.value.length).toBe(1);
      expect(component.value).not.toContain(mockOptions[0]['id']);
    });

    it('should clear all selections', () => {
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      component.clearSelection();
      expect(component.value).toEqual([]);
    });
  });

  describe('Single selection mode', () => {
    beforeEach(() => {
      component.multiple = false;
    });

    it('should select single option', () => {
      component.toggleOption(mockOptions[0]);
      expect(component.value).toBe(mockOptions[0]['id']);
    });

    it('should deselect option on second click', () => {
      component.value = mockOptions[0]['id'];
      component.toggleOption(mockOptions[0]);
      expect(component.value).toBeNull();
    });

    it('should clear selection', () => {
      component.value = mockOptions[0]['id'];
      component.clearSelection();
      expect(component.value).toBeNull();
    });
  });

  describe('Display functionality', () => {
    it('should show comma-separated labels in multiple mode', () => {
      component.multiple = true;
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      const display = component.getDisplayLabel();
      expect(display).toContain('First Option');
      expect(display).toContain('Second Option');
    });

    it('should show item count when exceeding maxSelectedLabels', () => {
      component.multiple = true;
      component.maxSelectedLabels = 2;
      component.value = [
        mockOptions[0]['id'],
        mockOptions[1]['id'],
        mockOptions[2]['id'],
      ];
      const display = component.getDisplayLabel();
      expect(display).toBe('3 items selected');
    });

    it('should show single label in single mode', () => {
      component.multiple = false;
      component.value = mockOptions[0]['id'];
      const display = component.getDisplayLabel();
      expect(display).toBe('First Option');
    });

    it('should return empty string when no selection', () => {
      component.multiple = true;
      component.value = [];
      expect(component.getDisplayLabel()).toBe('');
    });
  });

  describe('Remove selected item', () => {
    it('should remove item in multiple mode', () => {
      component.multiple = true;
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'stopPropagation');

      component.removeSelectedItem(mockOptions[0]['id'], mockEvent);

      expect(component.value.length).toBe(1);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should clear value in single mode', () => {
      component.multiple = false;
      component.value = mockOptions[0]['id'];
      const mockEvent = new Event('click');

      component.removeSelectedItem(mockOptions[0]['id'], mockEvent);
      expect(component.value).toBeNull();
    });
  });

  describe('Option state', () => {
    it('should identify selected options in multiple mode', () => {
      component.multiple = true;
      component.value = [mockOptions[0]['id']];
      expect(component.isOptionSelected(mockOptions[0])).toBe(true);
      expect(component.isOptionSelected(mockOptions[1])).toBe(false);
    });

    it('should identify selected option in single mode', () => {
      component.multiple = false;
      component.value = mockOptions[0]['id'];
      expect(component.isOptionSelected(mockOptions[0])).toBe(true);
      expect(component.isOptionSelected(mockOptions[1])).toBe(false);
    });
  });

  describe('Helper methods', () => {
    it('should detect if has value in multiple mode', () => {
      component.multiple = true;
      component.value = [];
      expect(component.hasValue()).toBe(false);
      component.value = [mockOptions[0]['id']];
      expect(component.hasValue()).toBe(true);
    });

    it('should detect if has value in single mode', () => {
      component.multiple = false;
      component.value = null;
      expect(component.hasValue()).toBe(false);
      component.value = mockOptions[0]['id'];
      expect(component.hasValue()).toBe(true);
    });

    it('should get correct placeholder', () => {
      component.multiple = true;
      expect(component.getPlaceholder()).toBe('Select options');
      component.multiple = false;
      expect(component.getPlaceholder()).toBe('Select an option');
    });
  });

  describe('Filtering', () => {
    it('should filter options by search text', () => {
      component.filterValue.set('first');
      fixture.detectChanges();
      const filtered = component.filteredOptions();
      expect(filtered.length).toBe(1);
    });

    it('should show all options when filter is empty', () => {
      component.filterValue.set('');
      fixture.detectChanges();
      expect(component.filteredOptions().length).toBe(mockOptions.length);
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value in multiple mode', () => {
      component.multiple = true;
      const values = [mockOptions[0]['id'], mockOptions[1]['id']];
      component.writeValue(values);
      expect(component.value).toEqual(values);
    });

    it('should write value in single mode', () => {
      component.multiple = false;
      component.writeValue(mockOptions[0]['id']);
      expect(component.value).toBe(mockOptions[0]['id']);
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
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
      expect(component.componentId).toContain('i-listbox-');
    });

    it('should use custom id when provided', () => {
      component.id = 'custom-listbox';
      fixture.detectChanges();
      expect(component.id).toBe('custom-listbox');
    });
  });

  describe('Custom error messages', () => {
    it('should use custom error messages', () => {
      component.errorMessages = { required: 'Please select an option' };
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;
      expect(component.getErrorMessage()).toBe('Please select an option');
    });

    it('should handle minlength error', () => {
      component.label = 'Items';
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

  describe('Event emissions', () => {
    it('should emit onChange event on toggle', () => {
      spyOn(component.onChange, 'emit');
      component.toggleOption(mockOptions[0]);
      expect(component.onChange.emit).toHaveBeenCalled();
    });

    it('should emit onClear event', () => {
      spyOn(component.onClear, 'emit');
      component.clearSelection();
      expect(component.onClear.emit).toHaveBeenCalled();
    });
  });

  describe('Selected labels', () => {
    it('should get labels for selected items in multiple mode', () => {
      component.multiple = true;
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      const labels = component.getSelectedLabels();
      expect(labels).toEqual(['First Option', 'Second Option']);
    });

    it('should get label for selected item in single mode', () => {
      component.multiple = false;
      component.value = mockOptions[0]['id'];
      const labels = component.getSelectedLabels();
      expect(labels).toEqual(['First Option']);
    });

    it('should handle empty selection', () => {
      component.multiple = true;
      component.value = [];
      const labels = component.getSelectedLabels();
      expect(labels).toEqual([]);
    });
  });

  describe('TrackBy functionality', () => {
    it('should track by value', () => {
      const value = mockOptions[0]['id'];
      expect(component.trackByValue(0, value)).toBe(value);
    });
  });

  describe('Helper methods for UI', () => {
    it('should determine if text should be hidden', () => {
      component.multiple = true;
      component.maxSelectedLabels = 3;
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      expect(component.shouldHideText()).toBe(true);
    });

    it('should get value array in multiple mode', () => {
      component.multiple = true;
      component.value = [mockOptions[0]['id'], mockOptions[1]['id']];
      expect(component.getValueArray()).toEqual([
        mockOptions[0]['id'],
        mockOptions[1]['id'],
      ]);
    });

    it('should get value array in single mode', () => {
      component.multiple = false;
      component.value = mockOptions[0]['id'];
      expect(component.getValueArray()).toEqual([mockOptions[0]['id']]);
    });

    it('should return empty array when no value', () => {
      component.multiple = false;
      component.value = null;
      expect(component.getValueArray()).toEqual([]);
    });
  });

  describe('Option value extraction', () => {
    it('should get option label', () => {
      expect(component.getOptionLabel(mockOptions[0])).toBe('First Option');
    });

    it('should get option value', () => {
      expect(component.getOptionValue(mockOptions[0])).toBe(1);
    });

    it('should get option search value', () => {
      component.filterBy = 'name';
      expect(component.getOptionSearchValue(mockOptions[0])).toBe('Option 1');
    });

    it('should fallback to label for search value', () => {
      component.filterBy = 'nonexistent';
      expect(component.getOptionSearchValue(mockOptions[0])).toBe(
        'First Option'
      );
    });
  });
});
