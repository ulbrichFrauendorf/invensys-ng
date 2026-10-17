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
    fixture.changeDetectorRef.markForCheck();
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
      vi.spyOn(component.cancelEvent, 'emit').mockReturnValue(undefined);
      component.onCancel();
      expect(component.cancelEvent.emit).toHaveBeenCalled();
    });

    it('should emit submitEvent when onSubmit is called', () => {
      vi.spyOn(component.submitEvent, 'emit').mockReturnValue(undefined);
      component.onSubmit();
      expect(component.submitEvent.emit).toHaveBeenCalled();
    });
  });

  it('does not submit while disabled or loading, then submits once ready', () => {
    const emit = vi
      .spyOn(component.submitEvent, 'emit')
      .mockReturnValue(undefined);
    fixture.componentRef.setInput('submitDisabled', true);
    component.onSubmit();
    fixture.componentRef.setInput('submitDisabled', false);
    fixture.componentRef.setInput('submitLoading', true);
    component.onSubmit();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('button[type="submit"]').disabled,
    ).toBe(true);
    expect(emit).not.toHaveBeenCalled();
    fixture.componentRef.setInput('submitLoading', false);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button[type="submit"]').click();
    expect(emit).toHaveBeenCalledTimes(1);
  });

  describe('Visibility', () => {
    it('should show cancel button by default', () => {
      const cancelButton = fixture.nativeElement.querySelectorAll('button');
      expect(cancelButton.length).toBeGreaterThanOrEqual(2);
    });

    it('should hide cancel button when showCancel is false', () => {
      fixture.componentRef.setInput('showCancel', false);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const buttons: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(1);
    });

    it('should hide submit button when showSubmit is false', () => {
      fixture.componentRef.setInput('showSubmit', false);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const buttons: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(1);
    });
  });
});
