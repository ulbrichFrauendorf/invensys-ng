import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { IOverlayPanel } from './overlay-panel.component';

@Component({
  imports: [IOverlayPanel],
  template: `
    <button #trigger (click)="panel.toggle($event, trigger)">
      Toggle panel
    </button>
    <i-overlay-panel #panel [dismissable]="dismissable"
      ><p>Panel content</p></i-overlay-panel
    >
  `,
})
class OverlayHost {
  dismissable = true;
}

describe('IOverlayPanel', () => {
  let fixture: ComponentFixture<OverlayHost>;
  let panel: IOverlayPanel;
  let trigger: HTMLButtonElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [OverlayHost],
      providers: [provideNoopAnimations()],
    });
    fixture = TestBed.createComponent(OverlayHost);
    await fixture.whenStable();
    panel = fixture.debugElement.query(
      By.directive(IOverlayPanel),
    ).componentInstance;
    trigger = fixture.nativeElement.querySelector('button');
  });

  async function open() {
    trigger.click();
    await fixture.whenStable();
    return document.querySelector<HTMLElement>(
      '.overlay-panel[role="dialog"]',
    )!;
  }

  it('starts hidden and dismissable', () => {
    expect(panel.visible).toBe(false);
    expect(panel.dismissable).toBe(true);
    expect(document.querySelector('.overlay-panel[role="dialog"]')).toBeNull();
  });

  it('opens from its trigger and projects content into a dialog', async () => {
    const dialog = await open();
    expect(panel.visible).toBe(true);
    expect(dialog.textContent).toContain('Panel content');
    expect(dialog.getAttribute('aria-hidden')).toBe('false');
    expect(dialog.parentElement).toBe(document.body);
  });

  it('emits lifecycle events after showing and hiding', async () => {
    const shown = vi.fn();
    const hidden = vi.fn();
    panel.onShow.subscribe(shown);
    panel.onHide.subscribe(hidden);
    await open();
    expect(shown).toHaveBeenCalledOnce();
    trigger.click();
    await fixture.whenStable();
    expect(hidden).toHaveBeenCalledOnce();
    expect(panel.visible).toBe(false);
    expect(document.querySelector('.overlay-panel[role="dialog"]')).toBeNull();
  });

  it('closes through the close button', async () => {
    const dialog = await open();
    dialog
      .querySelector<HTMLButtonElement>('.overlay-panel-close button')!
      .click();
    await fixture.whenStable();
    expect(panel.visible).toBe(false);
  });

  it('closes on Escape when dismissable', async () => {
    const dialog = await open();
    dialog.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();
    expect(panel.visible).toBe(false);
  });

  it('keeps the panel open on Escape when dismissal is disabled', async () => {
    fixture.componentInstance.dismissable = false;
    fixture.changeDetectorRef.markForCheck();
    const dialog = await open();
    dialog.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();
    expect(panel.visible).toBe(true);
  });

  it('ignores inside clicks and dismisses on outside clicks', async () => {
    const dialog = await open();
    dialog.querySelector('p')!.click();
    await fixture.whenStable();
    expect(panel.visible).toBe(true);
    document.body.click();
    await fixture.whenStable();
    expect(panel.visible).toBe(false);
  });

  it('removes its body overlay when the host is destroyed', async () => {
    await open();
    fixture.destroy();
    expect(document.querySelector('.overlay-panel[role="dialog"]')).toBeNull();
  });
});
