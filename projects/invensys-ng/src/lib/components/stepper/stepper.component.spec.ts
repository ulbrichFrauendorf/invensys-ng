import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IStep } from './step.component';
import {
  IStepper,
  StepperChangeEvent,
  StepperOrientation,
} from './stepper.component';

@Component({
  standalone: true,
  imports: [IStepper, IStep],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <i-stepper
      [(activeIndex)]="activeIndex"
      [linear]="linear"
      [orientation]="orientation"
      (onChange)="lastChange = $event"
    >
      <i-step
        label="Details"
        description="Name and access"
        [completed]="detailsComplete"
      >
        Details content
        <div
          class="tall-content"
          [style.height.px]="contentHeight"
          style="float: left; width: 100%"
        >
          Form fields
        </div>
      </i-step>
      <i-step label="Columns">Columns content</i-step>
      <i-step
        label="Review"
        [disabled]="reviewDisabled"
        [completed]="reviewComplete"
        >Review content</i-step
      >
      @for (label of extraSteps; track label) {
        <i-step [label]="label">{{ label }} content</i-step>
      }
      <footer stepperActions><button type="button">Continue</button></footer>
    </i-stepper>
  `,
})
class TestHostComponent {
  orientation: StepperOrientation = 'horizontal';
  contentHeight = 100;
  activeIndex = 0;
  linear = false;
  detailsComplete = false;
  reviewDisabled = true;
  reviewComplete = false;
  extraSteps: string[] = [];
  lastChange: StepperChangeEvent | null = null;
}

describe('IStepper', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('renders every projected step and the active content', () => {
    expect(
      fixture.debugElement.queryAll(By.css('.i-stepper-trigger')).length,
    ).toBe(3);
    expect(
      fixture.debugElement.query(By.css('.i-stepper-panel-active'))
        .nativeElement.textContent,
    ).toContain('Details content');
  });

  for (const orientation of ['horizontal', 'vertical'] as const) {
    for (const width of [360, 1100]) {
      it(`keeps shared actions below all content in ${orientation} layout at ${width}px`, () => {
        host.orientation = orientation;
        fixture.nativeElement.style.width = `${width}px`;
        for (const height of [100, 700]) {
          host.contentHeight = height;
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();
          const root: HTMLElement = fixture.nativeElement;
          const actions = root.querySelector('.i-stepper-actions')!;
          const navigation = root.querySelector('.i-stepper-navigation')!;
          const content = root.querySelector('.tall-content')!;
          expect(actions.textContent).toContain('Continue');
          expect(content.getBoundingClientRect().height).toBe(height);
          expect(actions.getBoundingClientRect().top).toBeGreaterThanOrEqual(
            content.getBoundingClientRect().bottom,
          );
          expect(actions.getBoundingClientRect().top).toBeGreaterThanOrEqual(
            navigation.getBoundingClientRect().bottom,
          );
        }
        host.activeIndex = 1;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        const panel = fixture.nativeElement.querySelector(
          '.i-stepper-panel-active',
        );
        const actions =
          fixture.nativeElement.querySelector('.i-stepper-actions');
        expect(actions.textContent).toContain('Continue');
        expect(actions.getBoundingClientRect().top).toBeGreaterThanOrEqual(
          panel.getBoundingClientRect().bottom,
        );
      });
    }
  }

  it('uses a horizontal carousel at narrow widths and follows external step changes', async () => {
    fixture.nativeElement.style.width = '360px';
    fixture.detectChanges();
    await fixture.whenStable();
    const viewport: HTMLElement = fixture.nativeElement.querySelector(
      '.i-carousel-viewport',
    );
    const items = fixture.nativeElement.querySelectorAll('.i-stepper-item');
    expect(items[0].getBoundingClientRect().top).toBe(
      items[1].getBoundingClientRect().top,
    );
    expect(items[0].getBoundingClientRect().width).toBeLessThan(
      viewport.clientWidth,
    );
    expect(
      fixture.nativeElement.querySelector('.i-carousel-controls i-button'),
    ).toBeNull();
    host.activeIndex = 1;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(viewport.scrollLeft).toBeGreaterThan(0);
    expect(
      fixture.nativeElement.querySelector('.i-stepper-panel-active')
        .textContent,
    ).toContain('Columns content');
  });

  it('preserves wide horizontal and vertical navigation layouts', async () => {
    fixture.nativeElement.style.width = '1100px';
    fixture.detectChanges();
    await fixture.whenStable();
    const viewport: HTMLElement = fixture.nativeElement.querySelector(
      '.i-carousel-viewport',
    );
    const items = fixture.nativeElement.querySelectorAll('.i-stepper-item');
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
    expect(items[0].getBoundingClientRect().top).toBe(
      items[1].getBoundingClientRect().top,
    );
    expect(
      getComputedStyle(
        fixture.nativeElement.querySelector('.i-carousel-controls'),
      ).display,
    ).toBe('none');
    host.orientation = 'vertical';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(items[1].getBoundingClientRect().top).toBeGreaterThan(
      items[0].getBoundingClientRect().bottom,
    );
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
  });

  async function settleLayout(): Promise<void> {
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    fixture.detectChanges();
  }

  it('shrinks cards gradually across 900px and enables the carousel only below their combined minimum width', async () => {
    const root: HTMLElement = fixture.nativeElement;
    const viewport = root.querySelector<HTMLElement>('.i-carousel-viewport')!;
    const item = root.querySelector<HTMLElement>('.i-stepper-item')!;
    const controls = root.querySelector<HTMLElement>('.i-carousel-controls')!;
    let previousWidth = 0;
    let previousItemWidth = 0;
    for (const width of [1100, 940, 901, 900, 880, 825, 700, 600, 596]) {
      root.style.width = `${width}px`;
      await settleLayout();
      const itemWidth = item.getBoundingClientRect().width;
      expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
      expect(getComputedStyle(controls).display).toBe('none');
      expect(itemWidth).toBeCloseTo((width - 56) / 3, 1);
      if (previousWidth) {
        expect(previousItemWidth - itemWidth).toBeCloseTo(
          (previousWidth - width) / 3,
          1,
        );
      }
      previousWidth = width;
      previousItemWidth = itemWidth;
    }
    for (const width of [595, 500, 360]) {
      root.style.width = `${width}px`;
      await settleLayout();
      expect(item.getBoundingClientRect().width).toBeCloseTo(180, 1);
      expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
      expect(getComputedStyle(controls).display).toBe('flex');
    }
    root.style.width = '825px';
    await settleLayout();
    expect(getComputedStyle(controls).display).toBe('none');
    expect(viewport.scrollLeft).toBe(0);
  });

  it('uses the actual number of steps when deciding whether the carousel is needed', async () => {
    const root: HTMLElement = fixture.nativeElement;
    root.style.width = '1100px';
    host.extraSteps = ['Permissions', 'Schedule', 'Delivery', 'Confirmation'];
    await settleLayout();
    const viewport = root.querySelector<HTMLElement>('.i-carousel-viewport')!;
    const controls = root.querySelector<HTMLElement>('.i-carousel-controls')!;
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    expect(getComputedStyle(controls).display).toBe('flex');
    expect(root.querySelectorAll('.i-carousel-dot')).toHaveLength(7);
    host.extraSteps = [];
    await settleLayout();
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
    expect(getComputedStyle(controls).display).toBe('none');
  });

  it('updates the active index and emits change details', () => {
    fixture.debugElement
      .queryAll(By.css('.i-stepper-trigger'))[1]
      .nativeElement.click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(host.activeIndex).toBe(1);
    expect(host.lastChange?.index).toBe(1);
    expect(host.lastChange?.previousIndex).toBe(0);
  });

  it('does not select a disabled step', () => {
    fixture.debugElement
      .queryAll(By.css('.i-stepper-trigger'))[2]
      .nativeElement.click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(host.activeIndex).toBe(0);
  });

  it('does not skip an incomplete step in linear mode', () => {
    host.linear = true;
    host.reviewDisabled = false;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const stepper = fixture.debugElement.query(By.directive(IStepper))
      .componentInstance as IStepper;
    expect(stepper.canSelect(1)).toBe(false);

    host.detailsComplete = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(stepper.canSelect(1)).toBe(true);
  });

  it('replaces the trailing chevron with a tick when a step is completed', () => {
    const first = fixture.debugElement.query(
      By.css('.i-stepper-trigger'),
    ).nativeElement;
    expect(first.querySelector('.i-stepper-chevron')).not.toBeNull();
    expect(first.querySelector('.i-stepper-completion')).toBeNull();
    host.detailsComplete = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(first.querySelector('.i-stepper-chevron')).toBeNull();
    expect(first.querySelector('.i-stepper-completion')).not.toBeNull();
  });

  it('shows a completed final step while keeping its panel active', () => {
    host.reviewDisabled = false;
    host.activeIndex = 2;
    host.reviewComplete = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const final = fixture.debugElement.queryAll(By.css('.i-stepper-trigger'))[2]
      .nativeElement;
    expect(final.querySelector('.i-stepper-completion')).not.toBeNull();
    expect(final.querySelector('.i-stepper-chevron')).toBeNull();
    expect(final.getAttribute('aria-current')).toBe('step');
    expect(
      fixture.debugElement.query(By.css('.i-stepper-panel-active'))
        .nativeElement.textContent,
    ).toContain('Review content');
    host.reviewComplete = false;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(final.querySelector('.i-stepper-chevron')).toBeNull();
    expect(final.querySelector('.i-stepper-completion')).toBeNull();
  });

  it('does not show a next-step chevron or connector on the final step', () => {
    const final = fixture.debugElement.queryAll(By.css('.i-stepper-item'))[2]
      .nativeElement;
    expect(final.querySelector('.i-stepper-chevron')).toBeNull();
    expect(final.querySelector('.i-stepper-connector')).toBeNull();
  });

  it('exposes step progress semantics', () => {
    const first = fixture.debugElement.query(
      By.css('.i-stepper-trigger'),
    ).nativeElement;
    expect(first.getAttribute('aria-current')).toBe('step');
    expect(first.getAttribute('aria-controls')).toContain('-panel-0');
    expect(first.textContent).toContain('Step 1 of 3');
  });

  it('keeps accessible step position when a custom icon is used', () => {
    const stepper = fixture.debugElement.query(By.directive(IStepper))
      .componentInstance as IStepper;
    const step = stepper.steps[0];
    step.icon = 'pi pi-file-edit';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const first = fixture.debugElement.query(
      By.css('.i-stepper-trigger'),
    ).nativeElement;
    expect(first.querySelector('.pi-file-edit')).not.toBeNull();
    expect(first.textContent).toContain('Step 1 of 3');
  });
});
