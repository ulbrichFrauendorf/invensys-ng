import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ITextarea } from './textarea.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ITextarea', () => {
  let component: ITextarea;
  let fixture: ComponentFixture<ITextarea>;
  let textareaElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITextarea, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ITextarea);
    component = fixture.componentInstance;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    textareaElement = fixture.debugElement.query(By.css('textarea'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.label).toBe('Label');
      expect(component.rows).toBe(4);
      expect(component.disabled).toBe(false);
      expect(component.readonly).toBe(false);
      expect(component.fluid).toBe(false);
      expect(component.useFloatLabel).toBe(true);
      expect(component.resizable).toBe(true);
    });

    it('should apply disabled attribute', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(textareaElement.nativeElement.disabled).toBe(true);
    });

    it('should apply readonly attribute', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(textareaElement.nativeElement.readOnly).toBe(true);
    });

    it('should apply rows attribute', () => {
      fixture.componentRef.setInput('rows', 6);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(textareaElement.nativeElement.rows).toBe(6);
    });

    it('should apply maxlength attribute when provided', () => {
      fixture.componentRef.setInput('maxLength', 100);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(textareaElement.nativeElement.getAttribute('maxlength')).toBe('100');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should update value on input', () => {
      const nativeEl = textareaElement.nativeElement as HTMLTextAreaElement;
      nativeEl.value = 'Hello world';
      nativeEl.dispatchEvent(new Event('input'));
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.value).toBe('Hello world');
    });

    it('should write value via writeValue', () => {
      component.writeValue('Test value');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.value).toBe('Test value');
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });
  });

  describe('Character Count', () => {
    it('should track current length', () => {
      component.writeValue('Hello');
      expect(component.currentLength).toBe(5);
    });

    it('should detect warning state at threshold', () => {
      fixture.componentRef.setInput('maxLength', 100);
      fixture.componentRef.setInput('charCountWarnAt', 80);
      component.writeValue('a'.repeat(85));
      expect(component.charCountWarning).toBe(true);
      expect(component.charCountOver).toBe(false);
    });

    it('should detect over state at limit', () => {
      fixture.componentRef.setInput('maxLength', 10);
      component.writeValue('a'.repeat(10));
      expect(component.charCountOver).toBe(true);
    });
  });

  describe('hasValue', () => {
    it('should return false for null value', () => {
      component.value = null;
      expect(component.hasValue).toBe(false);
    });

    it('should return false for empty string', () => {
      component.value = '';
      expect(component.hasValue).toBe(false);
    });

    it('should return true for non-empty string', () => {
      component.value = 'text';
      expect(component.hasValue).toBe(true);
    });
  });
});
