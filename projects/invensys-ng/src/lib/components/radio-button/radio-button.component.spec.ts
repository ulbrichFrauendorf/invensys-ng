import { firstValueFrom } from 'rxjs';
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
    fixture.componentRef.setInput('value', 'initial-option');
    fixture.changeDetectorRef.markForCheck();
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
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.label).toBe('Test Label');
    });

    it('should accept value input', () => {
      fixture.componentRef.setInput('value', 'option1');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.value).toBe('option1');
    });

    it('should accept name input', () => {
      fixture.componentRef.setInput('name', 'testGroup');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.name).toBe('testGroup');
    });

    it('should accept disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });

    it('should accept fluid input', () => {
      fixture.componentRef.setInput('fluid', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.fluid).toBe(true);
    });
  });

  describe('Selection functionality', () => {
    it('should select when clicked and not disabled', () => {
      fixture.componentRef.setInput('value', 'test');
      component.select();
      expect(component.checked).toBe(true);
    });

    it('should not select when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('value', 'test');
      component.select();
      expect(component.checked).toBe(false);
    });

    it('should emit onChange event', async () => {
      fixture.componentRef.setInput('value', 'test');
      const emittedValue = firstValueFrom(component.onChange);
      component.select();

      const value = await emittedValue;

      expect(value).toBe('test');
    });

    it('should not emit onChange when already selected', () => {
      fixture.componentRef.setInput('value', 'test');
      component.writeValue('test');
      const spy = vi.fn().mockName('onChange');
      component.onChange.subscribe(spy);
      component.select();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value and update checked state', () => {
      fixture.componentRef.setInput('value', 'option1');
      component.writeValue('option1');
      expect(component.checked).toBe(true);
    });

    it('should not be checked when writeValue does not match', () => {
      fixture.componentRef.setInput('value', 'option1');
      component.writeValue('option2');
      expect(component.checked).toBe(false);
    });

    it('should register onChange callback', () => {
      const fn = vi.fn().mockName('onChange');
      component.registerOnChange(fn);
      fixture.componentRef.setInput('value', 'test');
      component.select();
      expect(fn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const fn = vi.fn().mockName('onTouched');
      component.registerOnTouched(fn);
      fixture.componentRef.setInput('value', 'test');
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
      fixture.componentRef.setInput('inputId', 'custom-radio');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.effectiveInputId).toBe('custom-radio');
    });

    it('should use componentId when inputId is not provided', () => {
      fixture.componentRef.setInput('inputId', undefined);
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
      hostFixture = TestBed.createComponent(GroupTestHost);
      hostFixture.changeDetectorRef.markForCheck();
      hostFixture.detectChanges();

      const debugEls = hostFixture.debugElement.queryAll(By.directive(IRadioButton));
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
          <i-radio-button name="group2" value="one" [formControl]="control"></i-radio-button>
          <i-radio-button name="group2" value="two" [formControl]="control"></i-radio-button>
        `,
        standalone: true,
        imports: [IRadioButton, ReactiveFormsModule],
      })
      class SharedControlHost {
        control = sharedControl;
      }
      const sharedFixture = TestBed.createComponent(SharedControlHost);
      sharedFixture.changeDetectorRef.markForCheck();
      sharedFixture.detectChanges();

      const debugEls = sharedFixture.debugElement.queryAll(By.directive(IRadioButton));
      const radios = debugEls.map((de) => de.componentInstance as IRadioButton);

      // Initially should reflect control value
      expect(radios[0].checked).toBe(true);
      expect(radios[1].checked).toBe(false);

      // Change control value to 'two'
      sharedFixture.componentInstance.control.setValue('two');
      sharedFixture.changeDetectorRef.markForCheck();
      sharedFixture.detectChanges();
      expect(radios[0].checked).toBe(false);
      expect(radios[1].checked).toBe(true);
    });

    it('should work with FormGroup and formControlName', () => {
      @Component({
        template: `
          <form [formGroup]="form">
            <i-radio-button name="group3" value="first" formControlName="choice"></i-radio-button>
            <i-radio-button name="group3" value="second" formControlName="choice"></i-radio-button>
          </form>
        `,
        standalone: true,
        imports: [IRadioButton, ReactiveFormsModule],
      })
      class FormGroupHost {
        form = new FormGroup({ choice: new FormControl('first') });
      }
      const fgFixture = TestBed.createComponent(FormGroupHost);
      fgFixture.changeDetectorRef.markForCheck();
      fgFixture.detectChanges();

      const debugEls = fgFixture.debugElement.queryAll(By.directive(IRadioButton));
      const radios = debugEls.map((de) => de.componentInstance as IRadioButton);

      expect(radios[0].checked).toBe(true);
      expect(radios[1].checked).toBe(false);

      // change form value
      fgFixture.componentInstance.form.controls['choice'].setValue('second');
      fgFixture.changeDetectorRef.markForCheck();
      fgFixture.detectChanges();
      expect(radios[0].checked).toBe(false);
      expect(radios[1].checked).toBe(true);
    });
  });
});
