import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IDialogActions } from './dialog-actions.component';

describe('IDialogActions', () => {
  let component: IDialogActions;
  let fixture: ComponentFixture<IDialogActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IDialogActions],
    }).compileComponents();

    fixture = TestBed.createComponent(IDialogActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default values', () => {
    it('should have default input values', () => {
      expect(component.submitLabel).toBe('Submit');
      expect(component.cancelLabel).toBe('Cancel');
      expect(component.severity).toBe('primary');
      expect(component.showCancel).toBe(true);
      expect(component.showSubmit).toBe(true);
      expect(component.submitDisabled).toBe(false);
    });
  });

  describe('Submit button type', () => {
    it('should render submit button with type="submit"', () => {
      const submitButton: HTMLButtonElement =
        fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });
  });

  describe('Events', () => {
    it('should emit cancelEvent when onCancel is called', () => {
      spyOn(component.cancelEvent, 'emit');
      component.onCancel();
      expect(component.cancelEvent.emit).toHaveBeenCalled();
    });

    it('should emit submitEvent when onSubmit is called', () => {
      spyOn(component.submitEvent, 'emit');
      component.onSubmit();
      expect(component.submitEvent.emit).toHaveBeenCalled();
    });
  });

  describe('Visibility', () => {
    it('should show cancel button by default', () => {
      const cancelButton = fixture.nativeElement.querySelectorAll('button');
      expect(cancelButton.length).toBeGreaterThanOrEqual(2);
    });

    it('should hide cancel button when showCancel is false', () => {
      component.showCancel = false;
      fixture.detectChanges();
      const buttons: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(1);
    });

    it('should hide submit button when showSubmit is false', () => {
      component.showSubmit = false;
      fixture.detectChanges();
      const buttons: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(1);
    });
  });
});
