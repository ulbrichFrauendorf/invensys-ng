import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IDialogActions } from './inner/dialog-actions/dialog-actions.component';
import { ISelect } from '../select/select.component';
import { By } from '@angular/platform-browser';
import { DialogService } from './services/dialog.service';
import { IDialog } from './dialog.component';
import { userEvent } from 'vitest/browser';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  imports: [IDialogActions, ReactiveFormsModule],
  template: `<form [formGroup]="form" (ngSubmit)="onSubmit()">
    <input aria-label="Username" name="username" formControlName="username" />
    <input
      aria-label="Password"
      name="password"
      formControlName="password"
      type="password"
    />
    <i-dialog-actions
      slot="footer"
      submitLabel="Login"
      [submitDisabled]="busy()"
    />
  </form>`,
})
class FormDialogContent {
  static current: FormDialogContent;
  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });
  busy = signal(false);
  submitted = vi.fn();
  constructor() {
    FormDialogContent.current = this;
  }
  onSubmit() {
    if (this.form.invalid) return;
    this.submitted();
  }
}

@Component({ template: '<button>Dynamic action</button>' })
class DialogTestContent {}

@Component({
  imports: [IDialogActions],
  template: `<form (submit)="$event.preventDefault()">
    <div style="height: 2000px">Long dialog content</div>
    @if (showActions()) {
      <i-dialog-actions
        slot="footer"
        [submitLabel]="label()"
        (submitEvent)="submitted()"
      />
    }
  </form>`,
})
class TallDialogContent {
  static current: TallDialogContent;
  showActions = signal(true);
  label = signal('Save');
  submitted = vi.fn();
  constructor() {
    TallDialogContent.current = this;
  }
}

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

  it('fits oversized dimensions inside the viewport and responds to size input changes', async () => {
    fixture.componentRef.setInput('width', '2000px');
    fixture.componentRef.setInput('height', '2000px');
    component.show();
    await fixture.whenStable();
    const dialog = document
      .getElementById(component.componentId)!
      .querySelector<HTMLElement>('.i-dialog-container')!;
    dialog.style.animation = 'none';
    const bounds = dialog.getBoundingClientRect();
    const inset = window.innerWidth <= 640 ? 12 : 16;
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.width).toBeCloseTo(
      Math.min(2000, window.innerWidth - inset * 2),
      0,
    );
    expect(bounds.left).toBeGreaterThanOrEqual(inset - 1);
    expect(bounds.bottom).toBeLessThanOrEqual(window.innerHeight - inset + 1);
    fixture.componentRef.setInput('width', '240px');
    fixture.componentRef.setInput('height', '180px');
    await fixture.whenStable();
    expect(dialog.style.width).toBe('240px');
    expect(dialog.style.height).toBe('180px');
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
    for (const height of [undefined, '2000px']) {
      it(`keeps dynamic actions outside the scrolling body with height ${height}`, async () => {
        const ref = TestBed.inject(DialogService).open(TallDialogContent, {
          height,
        });
        try {
          await fixture.whenStable();
          const overlay = document.getElementById(
            (ref.instance as IDialog).componentId,
          )!;
          const body = overlay.querySelector<HTMLElement>('.i-card-body')!;
          const footer = overlay.querySelector<HTMLElement>('.i-card-footer')!;
          const card = overlay.querySelector<HTMLElement>('.i-card')!;
          expect(footer.querySelector('i-dialog-actions')).not.toBeNull();
          expect(body.querySelector('i-dialog-actions')).toBeNull();
          expect(card.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
          expect(card.getBoundingClientRect().bottom).toBeLessThanOrEqual(
            window.innerHeight,
          );
          expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
          const footerTop = footer.getBoundingClientRect().top;
          body.scrollTo({ top: 500, behavior: 'instant' });
          expect(body.scrollTop).toBe(500);
          expect(footer.getBoundingClientRect().top).toBe(footerTop);
          TallDialogContent.current.label.set('Updated save');
          await fixture.whenStable();
          expect(footer.textContent).toContain('Updated save');
          footer
            .querySelector<HTMLButtonElement>('button[type="submit"]')!
            .click();
          expect(TallDialogContent.current.submitted).toHaveBeenCalledOnce();
          TallDialogContent.current.showActions.set(false);
          await fixture.whenStable();
          expect(footer.querySelector('i-dialog-actions')).toBeNull();
          TallDialogContent.current.showActions.set(true);
          await fixture.whenStable();
          expect(footer.querySelectorAll('i-dialog-actions').length).toBe(1);
        } finally {
          ref.close();
        }
      });
    }

    it('preserves native form ownership, Enter submission and disabled state in a dynamic footer', async () => {
      const ref = TestBed.inject(DialogService).open(FormDialogContent);
      try {
        await fixture.whenStable();
        const overlay = document.getElementById(
          (ref.instance as IDialog).componentId,
        )!;
        const form = overlay.querySelector('form')!;
        const username =
          form.querySelector<HTMLInputElement>('[name="username"]')!;
        const password =
          form.querySelector<HTMLInputElement>('[name="password"]')!;
        const submit = overlay.querySelector<HTMLButtonElement>(
          'button[type="submit"]',
        )!;
        expect(form.contains(submit)).toBe(false);
        expect(submit.form).toBe(form);
        submit.click();
        expect(FormDialogContent.current.submitted).not.toHaveBeenCalled();
        username.value = 'user@example.test';
        password.value = 'test-password';
        username.dispatchEvent(new Event('input', { bubbles: true }));
        password.dispatchEvent(new Event('input', { bubbles: true }));
        await fixture.whenStable();
        username.focus();
        await userEvent.keyboard('{Enter}');
        expect(FormDialogContent.current.submitted).toHaveBeenCalledTimes(1);
        password.focus();
        await userEvent.keyboard('{Enter}');
        expect(FormDialogContent.current.submitted).toHaveBeenCalledTimes(2);
        submit.click();
        expect(FormDialogContent.current.submitted).toHaveBeenCalledTimes(3);
        FormDialogContent.current.busy.set(true);
        await fixture.whenStable();
        password.focus();
        await userEvent.keyboard('{Enter}');
        expect(FormDialogContent.current.submitted).toHaveBeenCalledTimes(3);
      } finally {
        ref.close();
      }
    });

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
        expect(overlay.closest('.cdk-overlay-container')?.parentElement).toBe(
          document.body,
        );
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
        document
          .getElementById(component.componentId)
          ?.closest('.cdk-overlay-container')?.parentElement,
      ).toBe(document.body);
      fixture.componentRef.setInput('visible', false);
      fixture.detectChanges();
      expect(document.getElementById(component.componentId)).toBeNull();
      expect(document.body.style.overflow).toBe('');
      component.show();
      component.hide();
      component.show();
      expect(
        document
          .getElementById(component.componentId)
          ?.closest('.cdk-overlay-container')?.parentElement,
      ).toBe(document.body);
    });

    it('preserves scroll lock until the last modal closes and restores the previous value', () => {
      document.body.style.overflow = 'scroll';
      const second = TestBed.createComponent(IDialog);
      second.detectChanges();
      component.show();
      second.componentInstance.show();
      const upperOverlay = document.getElementById(
        second.componentInstance.componentId,
      )!;
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
        new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true,
        }),
      );
      expect(second.componentInstance.visible).toBe(false);
      expect(component.visible).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true,
        }),
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
        expect(document.activeElement).toBe(
          component.dialogElement?.nativeElement,
        );
        expect(
          getComputedStyle(component.dialogElement!.nativeElement).outlineStyle,
        ).toBe('none');
        component.hide();
        expect(document.activeElement).toBe(trigger);
      } finally {
        trigger.remove();
      }
    });

    it('keeps projected bindings live and dropdown options above the dialog', async () => {
      const host = TestBed.createComponent(ProjectedDialogHost);
      host.detectChanges();
      const dialog = host.debugElement.query(By.directive(IDialog))
        .componentInstance as IDialog;
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
          document.elementFromPoint(
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2,
          ),
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
      const overlay = document.getElementById(
        (ref.instance as IDialog).componentId,
      )!;
      expect(overlay.closest('.cdk-overlay-container')?.parentElement).toBe(
        document.body,
      );
      expect(
        overlay.querySelector('.i-dialog-content button')?.textContent,
      ).toBe('Dynamic action');
      const closed = vi.fn();
      ref.onClose.subscribe(closed);
      ref.close('saved');
      expect(closed).toHaveBeenCalledWith('saved');
      expect(overlay.isConnected).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });
  });
});
