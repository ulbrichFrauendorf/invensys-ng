import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ICardButton } from './card-button.component';

@Component({
  imports: [ICardButton],
  template: `<i-card-button [routerLink]="route" [selected]="selected" [disabled]="disabled"
    ariaControls="tool-panel" (clicked)="activate($event)">
    <h2>Reports</h2><p>View reports</p>
  </i-card-button>`,
})
class Host {
  route: string | null = null;
  selected: boolean | null = null;
  disabled = false;
  activate = jasmine.createSpy('activate');
}

@Component({
  imports: [ICardButton],
  template: `<i-card-button title="Fallback title">
    <span slot="header">Custom header</span>
    <p>Card body</p>
    <span slot="footer">Footer detail</span>
  </i-card-button>`,
})
class SlotsHost {}

describe('ICardButton', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('renders projected content in a native non-submit button and emits once', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.type).toBe('button');
    expect(button.querySelector('i-card h2')?.textContent).toBe('Reports');
    expect(button.hasAttribute('aria-pressed')).toBeFalse();
    expect(button.getAttribute('aria-controls')).toBe('tool-panel');
    button.click();
    expect(fixture.componentInstance.activate).toHaveBeenCalledTimes(1);
  });

  it('forwards selection and disabled state to the native button', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.selected = true;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.disabled).toBeTrue();
    button.click();
    expect(fixture.componentInstance.activate).not.toHaveBeenCalled();
  });

  it('forwards the card title and full-height layout', () => {
    const fixture = TestBed.createComponent(ICardButton);
    fixture.componentRef.setInput('title', 'Card title');
    fixture.componentRef.setInput('fullHeight', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.i-card-title')?.textContent).toBe('Card title');
    expect(fixture.nativeElement.classList.contains('i-card-button--full-height')).toBeTrue();
    expect(fixture.nativeElement.querySelector('i-card').classList.contains('i-card--full-height')).toBeTrue();
  });

  it('projects header and footer into the card slots and replaces the default title', () => {
    const fixture = TestBed.createComponent(SlotsHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.i-card-header').textContent).toContain('Custom header');
    expect(fixture.nativeElement.querySelector('.i-card-body').textContent).toContain('Card body');
    expect(fixture.nativeElement.querySelector('.i-card-footer').textContent).toContain('Footer detail');
    expect(fixture.nativeElement.textContent).not.toContain('Fallback title');
  });

  it('renders routes as real links and removes navigation when disabled', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.route = '/reports';
    fixture.detectChanges();
    const anchor: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(anchor.getAttribute('href')).toBe('/reports');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    expect(anchor.hasAttribute('href')).toBeFalse();
    expect(anchor.tabIndex).toBe(-1);
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl');
    anchor.click();
    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.componentInstance.activate).not.toHaveBeenCalled();
  });
});
