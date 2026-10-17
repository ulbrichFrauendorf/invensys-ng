import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, Validators } from '@angular/forms';
import { IInputText } from './input-text.component';
import { NgControl } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('IInputText', () => {
  let component: IInputText;
  let fixture: ComponentFixture<IInputText>;
  let inputElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IInputText, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IInputText);
    component = fixture.componentInstance;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(By.css('input'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.label).toBe('Label');
      expect(component.type).toBe('text');
      expect(component.fluid).toBe(false);
      expect(component.forceFloated).toBe(false);
      expect(component.hideText).toBe(false);
      expect(component.useFloatLabel).toBe(true);
      expect(component.externalInvalid).toBe(false);
      expect(component.backgroundStyle).toBe('surface');
      expect(component.readonly).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.errorMessages).toEqual({});
    });

    it('should accept label input', () => {
      fixture.componentRef.setInput('label', 'Username');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.label).toBe('Username');
    });

    it('should accept type input', () => {
      fixture.componentRef.setInput('type', 'password');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.type).toBe('password');
    });

    it('should accept icon input', () => {
      fixture.componentRef.setInput('icon', 'pi pi-search');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.icon).toBe('pi pi-search');
    });

    it('should accept readonly input', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.readonly).toBe(true);
    });

    it('should accept backgroundStyle input', () => {
      fixture.componentRef.setInput('backgroundStyle', 'component');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.backgroundStyle).toBe('component');
    });

    it('should accept fluid input', () => {
      fixture.componentRef.setInput('fluid', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.fluid).toBe(true);
    });

    it('should accept forceFloated input', () => {
      fixture.componentRef.setInput('forceFloated', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.forceFloated).toBe(true);
    });

    it('should accept hideText input', () => {
      fixture.componentRef.setInput('hideText', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.hideText).toBe(true);
    });

    it('should accept useFloatLabel input', () => {
      fixture.componentRef.setInput('useFloatLabel', false);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.useFloatLabel).toBe(false);
    });

    it('should accept placeholder input', () => {
      fixture.componentRef.setInput('placeholder', 'Enter text');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.placeholder).toBe('Enter text');
    });

    it('should accept disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should handle null value', () => {
      component.writeValue(null);
      expect(component.value).toBeNull();
    });

    it('should register onChange callback', () => {
      const fn = vi.fn().mockName('onChange');
      component.registerOnChange(fn);

      const mockEvent = { target: { value: 'new value' } } as any;
      component.handleInput(mockEvent);

      expect(fn).toHaveBeenCalledWith('new value');
    });

    it('should register onTouched callback', () => {
      const fn = vi.fn().mockName('onTouched');
      component.registerOnTouched(fn);
      component.touch();
      expect(fn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });
  });

  describe('Input handling', () => {
    it('should update value on input', () => {
      const mockEvent = { target: { value: 'typed value' } } as any;
      component.handleInput(mockEvent);
      expect(component.value).toBe('typed value');
    });
  });

  describe('Validation and errors', () => {
    it('should show errors when externalInvalid is true', () => {
      fixture.componentRef.setInput('externalInvalid', true);
      expect(component.showErrors).toBe(true);
    });

    it('should not show errors when control is valid', () => {
      component.ngControl = {
        control: {
          invalid: false,
          dirty: true,
          errors: null,
        },
      } as any;

      expect(component.showErrors).toBe(false);
    });

    it('should not show errors when control is invalid but not dirty', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: false,
          errors: { required: true },
        },
      } as any;

      expect(component.showErrors).toBe(false);
    });

    it('should display external error message', () => {
      fixture.componentRef.setInput('externalInvalid', true);
      fixture.componentRef.setInput('externalErrorMessage', 'Custom error');
      expect(component.getErrorMessage()).toBe('Custom error');
    });

    it('should generate default required error message', () => {
      fixture.componentRef.setInput('label', 'Email');
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;

      expect(component.getErrorMessage()).toBe('Email is required');
    });

    it('should generate minlength error message', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { minlength: { requiredLength: 5, actualLength: 3 } },
        },
      } as any;

      expect(component.getErrorMessage()).toBe('Minimum 5 characters required');
    });

    it('should generate maxlength error message', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { maxlength: { requiredLength: 10, actualLength: 15 } },
        },
      } as any;

      expect(component.getErrorMessage()).toBe('Maximum 10 characters allowed');
    });

    it('should generate pattern error message', () => {
      fixture.componentRef.setInput('label', 'Phone');
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: {
            pattern: { requiredPattern: '^[0-9]+$', actualValue: 'abc' },
          },
        },
      } as any;

      expect(component.getErrorMessage()).toBe('Phone is not valid');
    });

    it('should handle custom error messages', () => {
      fixture.componentRef.setInput('errorMessages', {
        required: 'This field cannot be empty',
      });
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;

      expect(component.getErrorMessage()).toBe('This field cannot be empty');
    });

    it('should return null when no errors', () => {
      component.ngControl = {
        control: {
          invalid: false,
          dirty: true,
          errors: null,
        },
      } as any;

      expect(component.getErrorMessage()).toBeNull();
    });

    it('should get first error key', () => {
      component.ngControl = {
        control: {
          errors: { required: true, minlength: { requiredLength: 5 } },
        },
      } as any;

      expect(component.firstErrorKey).toBe('required');
    });

    it('should return null for firstErrorKey when no errors', () => {
      component.ngControl = {
        control: {
          errors: null,
        },
      } as any;

      expect(component.firstErrorKey).toBeNull();
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

    it('should return default message for unknown error', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { unknownError: { some: 'data' } },
        },
      } as any;

      expect(component.getErrorMessage()).toBe('Invalid value');
    });
  });

  describe('Input Types', () => {
    it('should render text input by default', () => {
      expect(inputElement.nativeElement.type).toBe('text');
    });

    it('should render password input', () => {
      fixture.componentRef.setInput('type', 'password');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(inputElement.nativeElement.type).toBe('password');
    });

    it('should render email input', () => {
      fixture.componentRef.setInput('type', 'email');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(inputElement.nativeElement.type).toBe('email');
    });

    it('should render number input', () => {
      fixture.componentRef.setInput('type', 'number');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(inputElement.nativeElement.type).toBe('number');
    });
  });

  describe('Form Control Integration', () => {
    it('should access form control', () => {
      const mockControl = {
        invalid: false,
        dirty: false,
        errors: null,
      } as any;
      component.ngControl = { control: mockControl } as any;

      expect(component.control).toEqual(mockControl);
    });

    it('should return null when no ngControl', () => {
      component.ngControl = null;
      expect(component.control).toBeNull();
    });
  });

  describe('State Management', () => {
    it('should handle disabled state in DOM', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(inputElement.nativeElement.disabled).toBe(true);
    });

    it('should handle readonly state in DOM', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(inputElement.nativeElement.readOnly).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-input-text');
    });

    it('should use custom id when provided', () => {
      fixture.componentRef.setInput('id', 'custom-input');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.id).toBe('custom-input');
    });
  });
});
