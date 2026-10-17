import { firstValueFrom } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IToggle } from './toggle.component';

describe('IToggle', () => {
  let component: IToggle;
  let fixture: ComponentFixture<IToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IToggle, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IToggle);
    component = fixture.componentInstance;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.disabled).toBe(false);
      expect(component.readonly).toBe(false);
      expect(component.size).toBe('medium');
      expect(component.checked).toBe(false);
    });

    it('should accept label input', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.label).toBe('Test Label');
    });

    it('should accept size input', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.size).toBe('large');
    });

    it('should accept checked input', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.checked).toBe(true);
    });

    it('should convert truthy values to boolean for checked', () => {
      fixture.componentRef.setInput('checked', 'true' as any);
      expect(component.checked).toBe(true);
    });
  });

  describe('Toggle functionality', () => {
    it('should toggle checked state', () => {
      expect(component.checked).toBe(false);
      component.toggle();
      expect(component.checked).toBe(true);
      component.toggle();
      expect(component.checked).toBe(false);
    });

    it('should not toggle when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('checked', false);
      component.toggle();
      expect(component.checked).toBe(false);
    });

    it('should not toggle when readonly', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.componentRef.setInput('checked', false);
      component.toggle();
      expect(component.checked).toBe(false);
    });

    it('should emit onChange event', async () => {
      const emittedValue = firstValueFrom(component.onChange);
      component.toggle();

      const value = await emittedValue;

      expect(value).toBe(true);
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value', () => {
      component.writeValue(true);
      expect(component.checked).toBe(true);
    });

    it('should register onChange callback', () => {
      const fn = vi.fn().mockName('onChange');
      component.registerOnChange(fn);
      component.toggle();
      expect(fn).toHaveBeenCalledWith(true);
    });

    it('should register onTouched callback', () => {
      const fn = vi.fn().mockName('onTouched');
      component.registerOnTouched(fn);
      component.toggle();
      expect(fn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-toggle');
    });

    it('should use custom id when provided', () => {
      fixture.componentRef.setInput('id', 'custom-toggle');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.id).toBe('custom-toggle');
    });
  });
});
