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
      expect(component.disabled).toBeFalse();
      expect(component.readonly).toBeFalse();
      expect(component.fluid).toBeFalse();
      expect(component.useFloatLabel).toBeTrue();
      expect(component.resizable).toBeTrue();
    });

    it('should apply disabled attribute', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(textareaElement.nativeElement.disabled).toBeTrue();
    });

    it('should apply readonly attribute', () => {
      component.readonly = true;
      fixture.detectChanges();
      expect(textareaElement.nativeElement.readOnly).toBeTrue();
    });

    it('should apply rows attribute', () => {
      component.rows = 6;
      fixture.detectChanges();
      expect(textareaElement.nativeElement.rows).toBe(6);
    });

    it('should apply maxlength attribute when provided', () => {
      component.maxLength = 100;
      fixture.detectChanges();
      expect(textareaElement.nativeElement.getAttribute('maxlength')).toBe('100');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should update value on input', () => {
      const nativeEl = textareaElement.nativeElement as HTMLTextAreaElement;
      nativeEl.value = 'Hello world';
      nativeEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.value).toBe('Hello world');
    });

    it('should write value via writeValue', () => {
      component.writeValue('Test value');
      fixture.detectChanges();
      expect(component.value).toBe('Test value');
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(component.disabled).toBeTrue();
    });
  });

  describe('Character Count', () => {
    it('should track current length', () => {
      component.writeValue('Hello');
      expect(component.currentLength).toBe(5);
    });

    it('should detect warning state at threshold', () => {
      component.maxLength = 100;
      component.charCountWarnAt = 80;
      component.writeValue('a'.repeat(85));
      expect(component.charCountWarning).toBeTrue();
      expect(component.charCountOver).toBeFalse();
    });

    it('should detect over state at limit', () => {
      component.maxLength = 10;
      component.writeValue('a'.repeat(10));
      expect(component.charCountOver).toBeTrue();
    });
  });

  describe('hasValue', () => {
    it('should return false for null value', () => {
      component.value = null;
      expect(component.hasValue).toBeFalse();
    });

    it('should return false for empty string', () => {
      component.value = '';
      expect(component.hasValue).toBeFalse();
    });

    it('should return true for non-empty string', () => {
      component.value = 'text';
      expect(component.hasValue).toBeTrue();
    });
  });
});
