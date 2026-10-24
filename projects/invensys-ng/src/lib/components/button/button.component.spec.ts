import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IButton } from './button.component';

describe('IButton', () => {
  let component: IButton;
  let fixture: ComponentFixture<IButton>;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IButton],
    }).compileComponents();

    fixture = TestBed.createComponent(IButton);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(By.css('button'));
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('puts the accessible action name and expansion state on the native button', () => {
    fixture.componentRef.setInput('ariaLabel', 'Expand details');
    fixture.componentRef.setInput('ariaExpanded', false);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(buttonElement.nativeElement.getAttribute('aria-label')).toBe('Expand details');
    expect(buttonElement.nativeElement.getAttribute('aria-expanded')).toBe('false');
    fixture.componentRef.setInput('ariaExpanded', true);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(buttonElement.nativeElement.getAttribute('aria-expanded')).toBe('true');
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.severity).toBe('primary');
      expect(component.size).toBe('medium');
      expect(component.type).toBe('button');
      expect(component.disabled).toBe(false);
      expect(component.outlined).toBe(false);
      expect(component.raised).toBe(false);
      expect(component.text).toBe(false);
      expect(component.fluid).toBe(false);
    });

    it('should accept severity input', () => {
      fixture.componentRef.setInput('severity', 'danger');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.severity).toBe('danger');
    });

    it('should accept size input', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.size).toBe('large');
    });

    it('should accept disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(buttonElement.nativeElement.disabled).toBe(true);
    });

    it('should accept icon input', () => {
      fixture.componentRef.setInput('icon', 'pi pi-check');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.icon).toBe('pi pi-check');
    });

    it('should accept fluid input', () => {
      fixture.componentRef.setInput('fluid', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.fluid).toBe(true);
    });
  });

  describe('Button Types', () => {
    it('should set button type to submit', () => {
      fixture.componentRef.setInput('type', 'submit');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(buttonElement.nativeElement.type).toBe('submit');
    });

    it('should set button type to reset', () => {
      fixture.componentRef.setInput('type', 'reset');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(buttonElement.nativeElement.type).toBe('reset');
    });
  });

  describe('Button Styles', () => {
    it('should apply outlined style', () => {
      fixture.componentRef.setInput('outlined', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.outlined).toBe(true);
    });

    it('should apply raised style', () => {
      fixture.componentRef.setInput('raised', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.raised).toBe(true);
    });

    it('should apply text style', () => {
      fixture.componentRef.setInput('text', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.text).toBe(true);
    });
  });

  describe('Icon Only Detection', () => {
    it('should not be icon-only with text content', async () => {
      vi.useFakeTimers();
      fixture.componentRef.setInput('icon', 'pi pi-check');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      await vi.advanceTimersByTimeAsync(100);

      expect(component.iconOnly).toBe(false);
    });
  });

  describe('Event Emissions', () => {
    it('should emit clicked event when button is clicked', () => {
      vi.spyOn(component.clicked, 'emit').mockReturnValue(undefined);
      buttonElement.nativeElement.click();
      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should not emit clicked event when button is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      vi.spyOn(component.clicked, 'emit').mockReturnValue(undefined);

      buttonElement.nativeElement.click();
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-button-');
    });

    it('should be focusable when not disabled', () => {
      expect(buttonElement.nativeElement.tabIndex).toBeGreaterThanOrEqual(0);
    });
  });
});

afterEach(() => vi.useRealTimers());
