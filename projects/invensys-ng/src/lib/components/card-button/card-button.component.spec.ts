import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ICardButton } from './card-button.component';
import { ICardButtonGroup } from './card-button-group.component';
import type {} from '@vitest/browser-playwright';
import { cdp } from 'vitest/browser';

@Component({
  imports: [ICardButton],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<i-card-button
    [routerLink]="route"
    [selected]="selected"
    [disabled]="disabled"
    ariaControls="tool-panel"
    (clicked)="activate($event)"
  >
    <h2>Reports</h2>
    <p>View reports</p>
  </i-card-button>`,
})
class Host {
  route: string | null = null;
  selected: boolean | null = null;
  disabled = false;
  activate = vi.fn().mockName('activate');
}

@Component({
  imports: [ICardButton],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<i-card-button title="Fallback title">
    <span slot="header">Custom header</span>
    <p>Card body</p>
    <span slot="footer">Footer detail</span>
  </i-card-button>`,
})
class SlotsHost {}

@Component({
  imports: [ICardButton],
  template: `<div class="scroll-parent" style="height: 120px; overflow: auto">
    <i-card-button [fullHeight]="true" style="height: 80px">Card content</i-card-button>
    <div style="height: 600px"></div>
  </div>`,
})
class ScrollHost {}

@Component({
  imports: [ICardButton, ICardButtonGroup],
  template: `<nav iCardButtonGroup [compact]="compact()" style="width: 24rem">
    <i-card-button
      tile
      title="Add password"
      description="Require a password to open PDFs"
      icon="pi pi-lock"
      ariaControls="tool-panel"
      [selected]="true"
    />
    <i-card-button tile title="Add watermark" />
  </nav>`,
})
class TileGroupHost {
  readonly compact = signal(false);
}

describe('ICardButton', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('allows the page to scroll when the wheel is over a full-height card body', async () => {
    const fixture = TestBed.createComponent(ScrollHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const body = root.querySelector<HTMLElement>('.i-card-body')!;
    const parent = root.querySelector<HTMLElement>('.scroll-parent')!;
    const bounds = body.getBoundingClientRect();
    await cdp().send('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
      deltaX: 0,
      deltaY: 100,
    });
    await vi.waitFor(() => expect(parent.scrollTop).toBeGreaterThan(0));
  });

  it('renders projected content in a native non-submit button and emits once', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.type).toBe('button');
    expect(button.querySelector('i-card h2')?.textContent).toBe('Reports');
    expect(button.hasAttribute('aria-pressed')).toBe(false);
    expect(button.getAttribute('aria-controls')).toBe('tool-panel');
    button.click();
    expect(fixture.componentInstance.activate).toHaveBeenCalledTimes(1);
  });

  it('forwards selection and disabled state to the native button', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.selected = true;
    fixture.componentInstance.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.disabled).toBe(true);
    button.click();
    expect(fixture.componentInstance.activate).not.toHaveBeenCalled();
  });

  it('forwards the card title and full-height layout', () => {
    const fixture = TestBed.createComponent(ICardButton);
    fixture.componentRef.setInput('title', 'Card title');
    fixture.componentRef.setInput('fullHeight', true);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.i-card-title')?.textContent).toBe('Card title');
    expect(fixture.nativeElement.classList.contains('i-card-button--full-height')).toBe(true);
    expect(
      fixture.nativeElement.querySelector('i-card').classList.contains('i-card--full-height'),
    ).toBe(true);
  });

  it('projects header and footer into the card slots and replaces the default title', () => {
    const fixture = TestBed.createComponent(SlotsHost);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.i-card-header').textContent).toContain(
      'Custom header',
    );
    expect(fixture.nativeElement.querySelector('.i-card-body').textContent).toContain('Card body');
    expect(fixture.nativeElement.querySelector('.i-card-footer').textContent).toContain(
      'Footer detail',
    );
    expect(fixture.nativeElement.textContent).not.toContain('Fallback title');
  });

  it('renders centered tile content in the native button and wraps to the group width', () => {
    const fixture = TestBed.createComponent(TileGroupHost);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const [password, watermark] = root.querySelectorAll('i-card-button button');

    expect(password.querySelector('h5')?.textContent).toBe('Add password');
    expect(password.querySelector('p')?.textContent).toBe('Require a password to open PDFs');
    expect(password.querySelector('[aria-hidden="true"] i.pi-lock')).not.toBeNull();
    expect(password.querySelector('.i-card-title')).toBeNull();
    expect(password.getAttribute('aria-controls')).toBe('tool-panel');
    expect(password.getAttribute('aria-pressed')).toBe('true');
    expect(watermark.querySelector('p')).toBeNull();
    expect(watermark.getBoundingClientRect().top).toBeGreaterThan(
      password.getBoundingClientRect().top,
    );

    fixture.componentInstance.compact.set(true);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(watermark.getBoundingClientRect().top).toBe(password.getBoundingClientRect().top);
    expect(watermark.getBoundingClientRect().height).toBe(password.getBoundingClientRect().height);
  });

  it('renders routes as real links and removes navigation when disabled', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.route = '/reports';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const anchor: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(anchor.getAttribute('href')).toBe('/reports');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    fixture.componentInstance.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(anchor.hasAttribute('href')).toBe(false);
    expect(anchor.tabIndex).toBe(-1);
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    anchor.click();
    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.componentInstance.activate).not.toHaveBeenCalled();
  });
});
