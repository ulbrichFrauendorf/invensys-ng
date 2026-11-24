import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IPanel } from '../panel/panel.component';
import { IStep } from '../stepper/step.component';
import { StepperChangeEvent } from '../stepper/stepper.component';
import { IAccordionStepper } from './accordion-stepper.component';

@Component({
  imports: [IAccordionStepper, IPanel, IStep],
  template: `
    <i-accordion-stepper
      ariaLabel="Report setup"
      [linear]="true"
      [activeIndex]="index()"
      (activeIndexChange)="index.set($event)"
      (onChange)="changes.push($event)"
    >
      <i-step label="Details" [completed]="detailsComplete()">
        <i-panel header="Report headings" [toggleable]="false">
          <div class="full-preview" style="height: 70rem"><input aria-label="Report name" /></div>
        </i-panel>
      </i-step>
      <i-step label="Options" [optional]="true" [disabled]="optionsDisabled()">Options form</i-step>
      <i-step label="Review">Review summary</i-step>
      <div stepperActions>
        <button type="button" (click)="advance()">Continue</button>
      </div>
    </i-accordion-stepper>
  `,
})
class Host {
  readonly index = signal(0);
  readonly detailsComplete = signal(false);
  readonly optionsDisabled = signal(true);
  readonly changes: StepperChangeEvent[] = [];

  advance(): void {
    this.detailsComplete.set(true);
    this.index.set(2);
  }
}

describe('IAccordionStepper', () => {
  it('opens exactly one labeled region immediately after its header and respects linear rules', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('.i-accordion-stepper-trigger')];
    const regions = [...root.querySelectorAll<HTMLElement>('[role="region"]')];

    expect(root.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Report setup');
    expect(buttons.map((button) => button.getAttribute('aria-expanded'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(buttons.map((button) => button.disabled)).toEqual([false, true, true]);
    buttons.forEach((button, index) => {
      expect(button.closest('.i-accordion-stepper-header')?.nextElementSibling).toBe(
        regions[index],
      );
      expect(button.getAttribute('aria-controls')).toBe(regions[index].id);
      expect(regions[index].getAttribute('aria-labelledby')).toBe(button.id);
    });
    expect(regions[0].querySelector('input')).not.toBeNull();
    expect(regions[2].textContent).not.toContain('Review summary');
    expect(regions[0].querySelector('.i-accordion-stepper-actions')).not.toBeNull();
    buttons[0].click();
    expect(fixture.componentInstance.index()).toBe(0);
    expect(fixture.componentInstance.changes).toHaveLength(0);

    fixture.componentInstance.detailsComplete.set(true);
    fixture.detectChanges();
    expect(buttons[2].disabled).toBe(false);
    buttons[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changes[0]).toMatchObject({ previousIndex: 0, index: 2 });
    expect(regions.map((region) => region.hidden)).toEqual([true, true, false]);
    expect(regions[0].querySelector('input')).toBeNull();
    expect(regions[2].textContent).toContain('Review summary');
    expect(regions[2].querySelector('.i-accordion-stepper-actions')).not.toBeNull();
    expect(root.querySelectorAll('.i-accordion-stepper-actions')).toHaveLength(1);
  });

  it('contains tall panels above the actions and the next header', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const panel = root.querySelector('.i-accordion-stepper-panel')!;
    const content = panel.querySelector('.full-preview')!.getBoundingClientRect();
    const actions = panel.querySelector('.i-accordion-stepper-actions')!.getBoundingClientRect();
    const nextHeader = root
      .querySelectorAll('.i-accordion-stepper-trigger')[1]
      .getBoundingClientRect();

    expect(content.height).toBeGreaterThan(1000);
    expect(actions.top).toBeGreaterThanOrEqual(content.bottom);
    expect(panel.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(actions.bottom);
    expect(nextHeader.top).toBeGreaterThanOrEqual(actions.bottom);
  });

  it('uses the active caret to open the previous available step and restore focus', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.advance();
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('.i-accordion-stepper-previous')).toBeNull();
    fixture.componentInstance.optionsDisabled.set(false);
    fixture.detectChanges();
    const caret = root.querySelector<HTMLButtonElement>('.i-accordion-stepper-previous')!;
    expect(caret.getAttribute('aria-label')).toBe('Back to Options');

    caret.focus();
    caret.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.index()).toBe(1);
    expect(fixture.componentInstance.changes[0]).toMatchObject({ previousIndex: 2, index: 1 });
    const current = root.querySelector('[aria-current="step"]');
    expect(document.activeElement).toBe(current);
    expect(current?.getAttribute('aria-expanded')).toBe('true');
  });

  it('moves focus from inline actions to the new step and skips disabled headers with arrow keys', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('.i-accordion-stepper-trigger')];
    const nextButton = root.querySelector<HTMLButtonElement>(
      '.i-accordion-stepper-actions button',
    )!;

    nextButton.focus();
    nextButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.activeElement).toBe(buttons[2]);
    expect(buttons[2].getAttribute('aria-current')).toBe('step');

    buttons[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(document.activeElement).toBe(buttons[0]);
    expect(fixture.componentInstance.index()).toBe(2);

    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect(document.activeElement).toBe(buttons[2]);
  });
});
