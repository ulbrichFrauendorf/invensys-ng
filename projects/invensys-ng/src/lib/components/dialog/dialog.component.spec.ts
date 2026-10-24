import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ISelect } from '../select/select.component';
import { By } from '@angular/platform-browser';
import { DialogService } from './services/dialog.service';
import { IDialog } from './dialog.component';

@Component({ template: '<button>Dynamic action</button>' })
class DialogTestContent {}

@Component({
  imports: [IDialog, ISelect],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<i-dialog [(visible)]="visible" header="Projected dialog">
    <span>{{ caption }}</span>
    <i-select label="Country" [options]="countries" optionLabel="label" />
  </i-dialog>`,
})
class ProjectedDialogHost {
  visible = true;
  caption = 'Initial content';
  countries = [{ label: 'South Africa' }];
}

describe('IDialog', () => {
  let component: IDialog;
  let fixture: ComponentFixture<IDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(IDialog);
    component = fixture.componentInstance;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.closable).toBe(true);
      expect(component.modal).toBe(true);
      expect(component.visible).toBe(false);
      expect(component.width).toBe('800px');
    });

    it('should accept header input', () => {
      component.header = 'Dialog Title';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.header).toBe('Dialog Title');
    });

    it('should accept width input', () => {
      component.width = '30rem';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.width).toBe('30rem');
    });

    it('should accept closable input', () => {
      component.closable = false;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.closable).toBe(false);
    });
  });

  describe('Show and Hide functionality', () => {
    it('should show dialog', () => {
      component.show();
      expect(component.visible).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should hide dialog', () => {
      component.visible = true;
      component.hide();
      expect(component.visible).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });

    it('should emit visibleChange event on show', () => {
      vi.spyOn(component.visibleChange, 'emit').mockReturnValue(undefined);
      component.show();
      expect(component.visibleChange.emit).toHaveBeenCalledWith(true);
    });

    it('should emit visibleChange event on hide', () => {
      vi.spyOn(component.visibleChange, 'emit').mockReturnValue(undefined);
      component.hide();
      expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('Lifecycle hooks', () => {
    it('should show dialog on init if visible is true', () => {
      const testFixture = TestBed.createComponent(IDialog);
      const testComponent = testFixture.componentInstance;
      testComponent.visible = true;
      testFixture.detectChanges();
      expect(document.getElementById(testComponent.componentId)).not.toBeNull();
    });

    it('should hide dialog on destroy', () => {
      component.show();
      const overlay = document.getElementById(component.componentId)!;
      fixture.destroy();
      expect(overlay.isConnected).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Keyboard interactions', () => {
    it('should close dialog on escape key if closable', () => {
      component.closable = true;
      component.visible = true;
      vi.spyOn(component, 'hide').mockReturnValue(undefined);
      component.onEscapeKey();
      expect(component.hide).toHaveBeenCalled();
    });

    it('should not close dialog on escape key if not closable', () => {
      component.closable = false;
      component.visible = true;
      vi.spyOn(component, 'hide').mockReturnValue(undefined);
      component.onEscapeKey();
      expect(component.hide).not.toHaveBeenCalled();
    });
  });

  describe('Modal overlay interactions', () => {
    it('closes on overlay click when dismissableMask is enabled', () => {
      fixture.componentRef.setInput('dismissableMask', true);
      component.modal = true;
      component.closable = true;
      component.visible = true;

      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div'),
      };
      mockEvent.target = mockEvent.currentTarget;

      vi.spyOn(component, 'hide').mockReturnValue(undefined);
      component.onOverlayClick(mockEvent as any);
      expect(component.hide).toHaveBeenCalled();
    });

    it('should not close on overlay click if not closable', () => {
      component.modal = true;
      component.closable = false;

      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div'),
      };
      mockEvent.target = mockEvent.currentTarget;

      vi.spyOn(component, 'hide').mockReturnValue(undefined);
      component.onOverlayClick(mockEvent as any);
      expect(component.hide).not.toHaveBeenCalled();
    });
  });

  describe('Close button', () => {
    it('should close dialog on close button click', () => {
      component.closable = true;
      vi.spyOn(component, 'hide').mockReturnValue(undefined);
      component.onCloseClick();
      expect(component.hide).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-dialog-');
    });
  });
  describe('Body-level overlay lifecycle', () => {
    it('escapes transformed and clipped ancestors and paints above sibling controls', () => {
      const host = fixture.nativeElement as HTMLElement;
      host.style.cssText =
        'position:fixed;left:20px;top:20px;width:100px;height:100px;transform:translateZ(0);overflow:hidden;z-index:0';
      const sibling = document.createElement('input');
      sibling.type = 'checkbox';
      sibling.style.cssText = 'position:fixed;left:40px;top:40px;z-index:10';
      document.body.appendChild(sibling);
      try {
        component.show();
        const overlay = document.getElementById(component.componentId)!;
        expect(overlay.closest('.cdk-overlay-container')?.parentElement).toBe(document.body);
        expect(overlay.getBoundingClientRect().width).toBe(window.innerWidth);
        expect(overlay.getBoundingClientRect().left).toBe(0);
        expect(overlay.contains(document.elementFromPoint(45, 45))).toBe(true);
      } finally {
        sibling.remove();
      }
    });

    it('cleans up bound visibility changes and can reopen without orphan overlays', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
      expect(
        document.getElementById(component.componentId)?.closest('.cdk-overlay-container')
          ?.parentElement,
      ).toBe(document.body);
      fixture.componentRef.setInput('visible', false);
      fixture.detectChanges();
      expect(document.getElementById(component.componentId)).toBeNull();
      expect(document.body.style.overflow).toBe('');
      component.show();
      component.hide();
      component.show();
      expect(
        document.getElementById(component.componentId)?.closest('.cdk-overlay-container')
          ?.parentElement,
      ).toBe(document.body);
    });

    it('preserves scroll lock until the last modal closes and restores the previous value', () => {
      document.body.style.overflow = 'scroll';
      const second = TestBed.createComponent(IDialog);
      second.detectChanges();
      component.show();
      second.componentInstance.show();
      const upperOverlay = document.getElementById(second.componentInstance.componentId)!;
      expect(upperOverlay.contains(document.elementFromPoint(1, 1))).toBe(true);
      component.hide();
      expect(document.body.style.overflow).toBe('hidden');
      second.destroy();
      expect(document.body.style.overflow).toBe('scroll');
    });

    it('closes only the top dialog per Escape key press', () => {
      const second = TestBed.createComponent(IDialog);
      second.detectChanges();
      component.show();
      second.componentInstance.show();
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
      expect(second.componentInstance.visible).toBe(false);
      expect(component.visible).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
      expect(component.visible).toBe(false);
    });

    it('leaves body scrolling available for a non-modal dialog', () => {
      component.modal = false;
      component.show();
      expect(document.body.style.overflow).toBe('');
    });

    it('focuses the dialog and restores its trigger when closed', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      try {
        trigger.focus();
        component.show();
        expect(document.activeElement).toBe(component.dialogElement?.nativeElement);
        component.hide();
        expect(document.activeElement).toBe(trigger);
      } finally {
        trigger.remove();
      }
    });

    it('keeps projected bindings live and dropdown options above the dialog', async () => {
      const host = TestBed.createComponent(ProjectedDialogHost);
      host.detectChanges();
      const dialog = host.debugElement.query(By.directive(IDialog)).componentInstance as IDialog;
      const overlay = document.getElementById(dialog.componentId)!;
      host.componentInstance.caption = 'Updated content';
      host.changeDetectorRef.markForCheck();
      host.detectChanges();
      await host.whenStable();
      expect(overlay.textContent).toContain('Updated content');
      overlay.querySelector<HTMLButtonElement>('.i-option-trigger')!.click();
      host.detectChanges();
      await host.whenStable();
      const option = document.querySelector<HTMLElement>('[role="option"]')!;
      expect(option).not.toBeNull();
      const bounds = option.getBoundingClientRect();
      expect(
        option.contains(
          document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2),
        ),
      ).toBe(true);
      option.click();
      host.detectChanges();
      expect(dialog.visible).toBe(true);
      expect(overlay.textContent).toContain('South Africa');
      host.componentInstance.visible = false;
      host.changeDetectorRef.markForCheck();
      host.detectChanges();
      expect(overlay.isConnected).toBe(false);
    });

    it('preserves dynamic service content and disposes it on close', () => {
      const ref = TestBed.inject(DialogService).open(DialogTestContent, {
        header: 'Dynamic dialog',
      });
      const overlay = document.getElementById((ref.instance as IDialog).componentId)!;
      expect(overlay.closest('.cdk-overlay-container')?.parentElement).toBe(document.body);
      expect(overlay.querySelector('.i-dialog-content button')?.textContent).toBe('Dynamic action');
      const closed = vi.fn();
      ref.onClose.subscribe(closed);
      ref.close('saved');
      expect(closed).toHaveBeenCalledWith('saved');
      expect(overlay.isConnected).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });
  });
});
