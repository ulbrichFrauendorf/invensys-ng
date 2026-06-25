import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ISelect, SelectOption } from './select.component';

describe('ISelect', () => {
  let component: ISelect;
  let fixture: ComponentFixture<ISelect>;

  const mockOptions: SelectOption[] = [
    { id: 1, name: 'Option 1', label: 'First Option' },
    { id: 2, name: 'Option 2', label: 'Second Option' },
    { id: 3, name: 'Option 3', label: 'Third Option' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ISelect, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ISelect);
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
      expect(component.label).toBe('Select');
      expect(component.placeholder).toBe('Select an option');
      expect(component.fluid).toBe(false);
      expect(component.showClear).toBe(false);
      expect(component.filter).toBe(true);
      expect(component.filterBy).toBe('label');
      expect(component.readonly).toBe(true);
    });

    it('should accept label input', () => {
      component.label = 'Choose Item';
      fixture.detectChanges();
      expect(component.label).toBe('Choose Item');
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

    it('should reset filter value when opening dropdown', () => {
      component.filterValue.set('test');
      component.toggleDropdown();
      expect(component.filterValue()).toBe('');
    });
  });

  describe('Option selection', () => {
    it('should select an option', () => {
      const option = mockOptions[0];
      component.selectOption(option);
      expect(component.value).toBe(option['id']);
      expect(component.isOpen).toBe(false);
    });

    it('should emit onChange event on selection', () => {
      spyOn(component.onChange, 'emit');
      const option = mockOptions[0];
      component.selectOption(option);
      expect(component.onChange.emit).toHaveBeenCalledWith(option['id']);
    });

    it('should store full object when optionValue is not provided', () => {
      component.optionValue = undefined;
      const option = mockOptions[0];
      component.selectOption(option);
      expect(component.value).toEqual(option);
    });
  });

  describe('Clear functionality', () => {
    it('should clear selection', () => {
      component.value = mockOptions[0]['id'];
      component.clearSelection();
      expect(component.value).toBeNull();
    });

    it('should emit onClear event', () => {
      spyOn(component.onClear, 'emit');
      component.clearSelection();
      expect(component.onClear.emit).toHaveBeenCalled();
    });
  });

  describe('Option display', () => {
    it('should get option label', () => {
      const option = mockOptions[0];
      expect(component.getOptionLabel(option)).toBe('First Option');
    });

    it('should get option value', () => {
      const option = mockOptions[0];
      expect(component.getOptionValue(option)).toBe(1);
    });

    it('should get selected label', () => {
      component.value = mockOptions[0]['id'];
      expect(component.getSelectedLabel()).toBe('First Option');
    });

    it('should return empty string for no selection', () => {
      component.value = null;
      expect(component.getSelectedLabel()).toBe('');
    });
  });

  describe('Option selection state', () => {
    it('should identify selected option with value', () => {
      component.value = mockOptions[0]['id'];
      expect(component.isOptionSelected(mockOptions[0])).toBe(true);
      expect(component.isOptionSelected(mockOptions[1])).toBe(false);
    });

    it('should identify selected option with full object', () => {
      component.optionValue = undefined;
      component.value = mockOptions[0];
      expect(component.isOptionSelected(mockOptions[0])).toBe(true);
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

    it('should use custom filterBy property', () => {
      component.filterBy = 'name';
      component.filterValue.set('Option 2');
      fixture.detectChanges();
      const filtered = component.filteredOptions();
      expect(filtered.length).toBe(1);
      expect(filtered[0]['name']).toBe('Option 2');
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value', () => {
      component.writeValue(mockOptions[0]['id']);
      expect(component.value).toBe(mockOptions[0]['id']);
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      component.selectOption(mockOptions[0]);
      expect(fn).toHaveBeenCalled();
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      component.selectOption(mockOptions[0]);
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
      component.label = 'Country';
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;
      expect(component.getErrorMessage()).toBe('Country is required');
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
      expect(component.componentId).toContain('i-select-');
    });

    it('should use custom id when provided', () => {
      component.id = 'custom-select';
      fixture.detectChanges();
      expect(component.id).toBe('custom-select');
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

  describe('Option search value', () => {
    it('should get search value from filterBy property', () => {
      component.filterBy = 'name';
      const option = mockOptions[0];
      expect(component.getOptionSearchValue(option)).toBe(option['name']);
    });

    it('should fallback to label when filterBy property not found', () => {
      component.filterBy = 'nonexistent';
      const option = mockOptions[0];
      expect(component.getOptionSearchValue(option)).toBe(option['label']);
    });
  });
});
