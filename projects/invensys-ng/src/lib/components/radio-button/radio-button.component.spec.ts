import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IRadioButton } from './radio-button.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormGroup, FormControlName, FormGroupDirective } from '@angular/forms';

describe('IRadioButton', () => {
  let component: IRadioButton;
  let fixture: ComponentFixture<IRadioButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IRadioButton, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IRadioButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.disabled).toBe(false);
      expect(component.fluid).toBe(false);
      expect(component.checked).toBe(false);
    });

    it('should accept label input', () => {
      component.label = 'Test Label';
      fixture.detectChanges();
      expect(component.label).toBe('Test Label');
    });

    it('should accept value input', () => {
      component.value = 'option1';
      fixture.detectChanges();
      expect(component.value).toBe('option1');
    });

    it('should accept name input', () => {
      component.name = 'testGroup';
      fixture.detectChanges();
      expect(component.name).toBe('testGroup');
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });

    it('should accept fluid input', () => {
      component.fluid = true;
      fixture.detectChanges();
      expect(component.fluid).toBe(true);
    });
  });

  describe('Selection functionality', () => {
    it('should select when clicked and not disabled', () => {
      component.value = 'test';
      component.select();
      expect(component.checked).toBe(true);
    });

    it('should not select when disabled', () => {
      component.disabled = true;
      component.value = 'test';
      component.select();
      expect(component.checked).toBe(false);
    });

    it('should emit onChange event', (done) => {
      component.value = 'test';
      component.onChange.subscribe((value: any) => {
        expect(value).toBe('test');
        done();
      });
      component.select();
    });

    it('should not emit onChange when already selected', () => {
      component.value = 'test';
      component.writeValue('test');
      const spy = jasmine.createSpy('onChange');
      component.onChange.subscribe(spy);
      component.select();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value and update checked state', () => {
      component.value = 'option1';
      component.writeValue('option1');
      expect(component.checked).toBe(true);
    });

    it('should not be checked when writeValue does not match', () => {
      component.value = 'option1';
      component.writeValue('option2');
      expect(component.checked).toBe(false);
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      component.value = 'test';
      component.select();
      expect(fn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      component.value = 'test';
      component.select();
      expect(fn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-radio-button');
    });

    it('should use custom inputId when provided', () => {
      component.inputId = 'custom-radio';
      fixture.detectChanges();
      expect(component.effectiveInputId).toBe('custom-radio');
    });

    it('should use componentId when inputId is not provided', () => {
      component.inputId = undefined;
      expect(component.effectiveInputId).toBe(component.componentId);
    });
  });

  describe('Group behavior', () => {
    @Component({
      template: `
        <i-radio-button name="group1" value="one"></i-radio-button>
        <i-radio-button name="group1" value="two"></i-radio-button>
      `,
      standalone: true,
      imports: [IRadioButton],
    })
    class GroupTestHost {}

    let hostFixture: ComponentFixture<GroupTestHost>;
    let radioButtons: IRadioButton[];

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [GroupTestHost],
        imports: [IRadioButton],
      }).compileComponents();
      hostFixture = TestBed.createComponent(GroupTestHost);
      hostFixture.detectChanges();

      const debugEls = hostFixture.debugElement.queryAll(
        By.directive(IRadioButton)
      );
      radioButtons = debugEls.map((de) => de.componentInstance as IRadioButton);
    });

    it('should only allow one selected at a time', () => {
      // Select first
      radioButtons[0].value = 'one';
      radioButtons[1].value = 'two';
      radioButtons[0].select();
      expect(radioButtons[0].checked).toBe(true);
      expect(radioButtons[1].checked).toBe(false);

      // Select second
      radioButtons[1].select();
      expect(radioButtons[0].checked).toBe(false);
      expect(radioButtons[1].checked).toBe(true);
    });

    it('should work with shared FormControl (reactive form control)', () => {
      // Setup shared control
      const sharedControl = new FormControl('one');
      // Recreate host with two radios sharing the same control
      @Component({
        template: `
          <i-radio-button
            name="group2"
            value="one"
            [formControl]="control"
          ></i-radio-button>
          <i-radio-button
            name="group2"
            value="two"
            [formControl]="control"
          ></i-radio-button>
        `,
        standalone: true,
        imports: [IRadioButton, ReactiveFormsModule],
      })
      class SharedControlHost {
        control = sharedControl;
      }

      TestBed.configureTestingModule({
        declarations: [SharedControlHost],
        imports: [IRadioButton, ReactiveFormsModule],
      });
      const sharedFixture = TestBed.createComponent(SharedControlHost);
      sharedFixture.detectChanges();

      const debugEls = sharedFixture.debugElement.queryAll(
        By.directive(IRadioButton)
      );
      const radios = debugEls.map((de) => de.componentInstance as IRadioButton);

      // Initially should reflect control value
      expect(radios[0].checked).toBe(true);
      expect(radios[1].checked).toBe(false);

      // Change control value to 'two'
      sharedFixture.componentInstance.control.setValue('two');
      sharedFixture.detectChanges();
      expect(radios[0].checked).toBe(false);
      expect(radios[1].checked).toBe(true);
    });

    it('should work with FormGroup and formControlName', () => {
      @Component({
        template: `
          <form [formGroup]="form">
            <i-radio-button
              name="group3"
              value="first"
              formControlName="choice"
            ></i-radio-button>
            <i-radio-button
              name="group3"
              value="second"
              formControlName="choice"
            ></i-radio-button>
          </form>
        `,
        standalone: true,
        imports: [IRadioButton, ReactiveFormsModule],
      })
      class FormGroupHost {
        form = new FormGroup({ choice: new FormControl('first') });
      }

      TestBed.configureTestingModule({
        declarations: [FormGroupHost],
        imports: [IRadioButton, ReactiveFormsModule],
      });
      const fgFixture = TestBed.createComponent(FormGroupHost);
      fgFixture.detectChanges();

      const debugEls = fgFixture.debugElement.queryAll(
        By.directive(IRadioButton)
      );
      const radios = debugEls.map((de) => de.componentInstance as IRadioButton);

      expect(radios[0].checked).toBe(true);
      expect(radios[1].checked).toBe(false);

      // change form value
      fgFixture.componentInstance.form.controls['choice'].setValue('second');
      fgFixture.detectChanges();
      expect(radios[0].checked).toBe(false);
      expect(radios[1].checked).toBe(true);
    });
  });
});
