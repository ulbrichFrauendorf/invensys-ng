import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DemoPlaygroundComponent } from './demo-playground.component';
import { DemoOptionDirective } from './demo-option.directive';

@Component({
  imports: [DemoPlaygroundComponent, DemoOptionDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-demo-playground title="Buttons">
    <ng-template
      appDemoOption="primary"
      label="Primary"
      [selected]="true"
      sourceCode="<button>Primary action</button>"
    >
      <button>Primary action</button>
    </ng-template>
    <ng-template
      appDemoOption="secondary"
      label="Secondary"
      sourceCode="<button>Secondary action</button>"
    >
      <button>Secondary action</button>
    </ng-template>
  </app-demo-playground>`,
})
class PlaygroundHost {}

describe('Demo page layout', () => {
  it('uses a right sidebar and header code action without a showcase card', async () => {
    const fixture = TestBed.createComponent(PlaygroundHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(
      root.querySelector('.sidebar-slot-right aside .options-panel'),
    ).not.toBeNull();
    expect(root.querySelector('header h1')?.textContent).toBe('Buttons');
    expect(root.querySelector('.preview-panel, .panel-content')).toBeNull();
    expect(root.querySelector('.page-content')?.textContent).toContain(
      'Primary action',
    );
    const [primary, secondary] =
      root.querySelectorAll<HTMLElement>('[role="radio"]');
    secondary.click();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('.page-content')?.textContent).toContain(
      'Secondary action',
    );
    expect(root.querySelector('.page-content')?.textContent).not.toContain(
      'Primary action',
    );
    expect(primary.getAttribute('aria-checked')).toBe('false');
    root
      .querySelector<HTMLButtonElement>(
        'header button[aria-label="View code"]',
      )!
      .click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('pre code')?.textContent).toContain(
      '<button>Secondary action</button>',
    );
    expect(root.querySelector('pre code')?.textContent).not.toContain(
      'Primary action',
    );
    root
      .querySelector<HTMLButtonElement>(
        'header button[aria-label="View preview"]',
      )!
      .click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('pre code')).toBeNull();
    expect(root.querySelector('.page-content')?.textContent).toContain(
      'Secondary action',
    );
    expect(secondary.getAttribute('aria-checked')).toBe('true');
    expect(
      root.querySelectorAll('[role="radio"][aria-checked="true"]'),
    ).toHaveLength(1);
  });
  it('keeps separate playground radio groups independent', async () => {
    const first = TestBed.createComponent(PlaygroundHost);
    const second = TestBed.createComponent(PlaygroundHost);
    await first.whenStable();
    await second.whenStable();
    first.nativeElement.querySelectorAll('[role="radio"]')[1].click();
    first.detectChanges();
    second.detectChanges();
    await first.whenStable();
    await second.whenStable();
    expect(
      first.nativeElement.querySelector('.page-content').textContent,
    ).toContain('Secondary action');
    expect(
      second.nativeElement.querySelector('.page-content').textContent,
    ).toContain('Primary action');
    expect(
      second.nativeElement
        .querySelector('[role="radio"]')
        .getAttribute('aria-checked'),
    ).toBe('true');
  });
});
