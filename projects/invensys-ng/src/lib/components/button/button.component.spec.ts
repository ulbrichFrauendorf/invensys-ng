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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      component.severity = 'danger';
      fixture.detectChanges();
      expect(component.severity).toBe('danger');
    });

    it('should accept size input', () => {
      component.size = 'large';
      fixture.detectChanges();
      expect(component.size).toBe('large');
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(buttonElement.nativeElement.disabled).toBe(true);
    });

    it('should accept icon input', () => {
      component.icon = 'pi pi-check';
      fixture.detectChanges();
      expect(component.icon).toBe('pi pi-check');
    });

    it('should accept fluid input', () => {
      component.fluid = true;
      fixture.detectChanges();
      expect(component.fluid).toBe(true);
    });
  });

  describe('Button Types', () => {
    it('should set button type to submit', () => {
      component.type = 'submit';
      fixture.detectChanges();
      expect(buttonElement.nativeElement.type).toBe('submit');
    });

    it('should set button type to reset', () => {
      component.type = 'reset';
      fixture.detectChanges();
      expect(buttonElement.nativeElement.type).toBe('reset');
    });
  });

  describe('Button Styles', () => {
    it('should apply outlined style', () => {
      component.outlined = true;
      fixture.detectChanges();
      expect(component.outlined).toBe(true);
    });

    it('should apply raised style', () => {
      component.raised = true;
      fixture.detectChanges();
      expect(component.raised).toBe(true);
    });

    it('should apply text style', () => {
      component.text = true;
      fixture.detectChanges();
      expect(component.text).toBe(true);
    });
  });

  describe('Icon Only Detection', () => {
    it('should not be icon-only with text content', (done) => {
      component.icon = 'pi pi-check';
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.iconOnly).toBe(false);
        done();
      }, 100);
    });
  });

  describe('Event Emissions', () => {
    it('should emit clicked event when button is clicked', () => {
      spyOn(component.clicked, 'emit');
      buttonElement.nativeElement.click();
      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should not emit clicked event when button is disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      spyOn(component.clicked, 'emit');

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
