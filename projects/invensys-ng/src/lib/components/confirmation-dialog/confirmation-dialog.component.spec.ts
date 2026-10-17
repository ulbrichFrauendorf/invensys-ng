import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import {
  IDynamicDialogConfig,
  IDynamicDialogRef,
} from '../dialog/services/dialog.interfaces';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let mockDialogRef: MockedObject<IDynamicDialogRef>;

  beforeEach(async () => {
    mockDialogRef = {
      close: vi.fn().mockName('IDynamicDialogRef.close'),
      onClose: EMPTY,
      instance: undefined,
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    component.dialogRef = mockDialogRef;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should have default values', () => {
      expect(component.header()).toBe('Are you sure?');
      expect(component.severity()).toBe('primary');
      expect(component.acceptLabel).toBe('Confirm');
      expect(component.rejectLabel).toBe('Cancel');
    });

    it('should set values from config data on init', () => {
      component.config = {
        data: {
          message: 'Delete this item?',
          header: 'Confirm Delete',
          severity: 'danger',
        },
      };

      component.ngOnInit();

      expect(component.message()).toBe('Delete this item?');
      expect(component.header()).toBe('Confirm Delete');
      expect(component.severity()).toBe('danger');
    });

    it('should use default values when config data is missing', () => {
      component.config = {};
      component.ngOnInit();

      expect(component.header()).toBe('Are you sure?');
      expect(component.severity()).toBe('primary');
    });

    it('should render custom action labels from the dialog configuration', () => {
      component.config = {
        data: { acceptLabel: 'Delete item', rejectLabel: 'Keep item' },
      };
      component.ngOnInit();
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const buttons = Array.from(
        fixture.nativeElement.querySelectorAll(
          'button',
        ) as NodeListOf<HTMLButtonElement>,
      ).map((button) => button.textContent?.trim());
      expect(buttons).toContain('Delete item');
      expect(buttons).toContain('Keep item');
    });
  });

  describe('User actions', () => {
    it('should close with true on confirm', () => {
      component.onConfirm();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should close with false on cancel', () => {
      component.onCancel();
      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('Signals', () => {
    it('should use signals for reactive properties', () => {
      expect(typeof component.severity).toBe('function');
      expect(typeof component.message).toBe('function');
      expect(typeof component.header).toBe('function');
    });

    it('should update signals', () => {
      component.severity.set('warning');
      expect(component.severity()).toBe('warning');

      component.message.set('New message');
      expect(component.message()).toBe('New message');
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-confirmation-dialog-');
    });
  });
});
