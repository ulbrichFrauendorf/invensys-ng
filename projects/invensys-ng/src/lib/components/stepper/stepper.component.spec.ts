import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IStep } from './step.component';
import { IStepper, StepperChangeEvent } from './stepper.component';

@Component({
  standalone: true,
  imports: [IStepper, IStep],
  template: `
    <i-stepper
      [(activeIndex)]="activeIndex"
      [linear]="linear"
      (onChange)="lastChange = $event"
    >
      <i-step
        label="Details"
        description="Name and access"
        [completed]="detailsComplete"
      >
        Details content
      </i-step>
      <i-step label="Columns">Columns content</i-step>
      <i-step label="Review" [disabled]="reviewDisabled" [completed]="reviewComplete">Review content</i-step>
    </i-stepper>
  `,
})
class TestHostComponent {
  activeIndex = 0;
  linear = false;
  detailsComplete = false;
  reviewDisabled = true;
  reviewComplete = false;
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
    fixture.detectChanges();
  });

  it('renders every projected step and the active content', () => {
    expect(
      fixture.debugElement.queryAll(By.css('.i-stepper__trigger')).length,
    ).toBe(3);
    expect(
      fixture.debugElement.query(By.css('.i-stepper__panel--active'))
        .nativeElement.textContent,
    ).toContain('Details content');
  });

  it('updates the active index and emits change details', () => {
    fixture.debugElement
      .queryAll(By.css('.i-stepper__trigger'))[1]
      .nativeElement.click();
    fixture.detectChanges();

    expect(host.activeIndex).toBe(1);
    expect(host.lastChange?.index).toBe(1);
    expect(host.lastChange?.previousIndex).toBe(0);
  });

  it('does not select a disabled step', () => {
    fixture.debugElement
      .queryAll(By.css('.i-stepper__trigger'))[2]
      .nativeElement.click();
    fixture.detectChanges();
    expect(host.activeIndex).toBe(0);
  });

  it('does not skip an incomplete step in linear mode', () => {
    host.linear = true;
    host.reviewDisabled = false;
    fixture.detectChanges();

    const stepper = fixture.debugElement.query(By.directive(IStepper))
      .componentInstance as IStepper;
    expect(stepper.canSelect(1)).toBe(false);

    host.detailsComplete = true;
    fixture.detectChanges();
    expect(stepper.canSelect(1)).toBe(true);
  });

  it('replaces the trailing chevron with a tick when a step is completed', () => {
    const first = fixture.debugElement.query(By.css('.i-stepper__trigger')).nativeElement;
    expect(first.querySelector('.i-stepper__chevron')).not.toBeNull();
    expect(first.querySelector('.i-stepper__completion')).toBeNull();
    host.detailsComplete = true;
    fixture.detectChanges();
    expect(first.querySelector('.i-stepper__chevron')).toBeNull();
    expect(first.querySelector('.i-stepper__completion')).not.toBeNull();
  });

  it('shows a completed final step while keeping its panel active', () => {
    host.reviewDisabled = false;
    host.activeIndex = 2;
    host.reviewComplete = true;
    fixture.detectChanges();
    const final = fixture.debugElement.queryAll(By.css('.i-stepper__trigger'))[2].nativeElement;
    expect(final.querySelector('.i-stepper__completion')).not.toBeNull();
    expect(final.querySelector('.i-stepper__chevron')).toBeNull();
    expect(final.getAttribute('aria-current')).toBe('step');
    expect(fixture.debugElement.query(By.css('.i-stepper__panel--active')).nativeElement.textContent).toContain('Review content');
    host.reviewComplete = false;
    fixture.detectChanges();
    expect(final.querySelector('.i-stepper__chevron')).not.toBeNull();
  });

  it('exposes step progress semantics', () => {
    const first = fixture.debugElement.query(
      By.css('.i-stepper__trigger'),
    ).nativeElement;
    expect(first.getAttribute('aria-current')).toBe('step');
    expect(first.getAttribute('aria-controls')).toContain('-panel-0');
    expect(first.textContent).toContain('Step 1 of 3');
  });

  it('keeps accessible step position when a custom icon is used', () => {
    const stepper = fixture.debugElement.query(By.directive(IStepper)).componentInstance as IStepper;
    const step = stepper.steps[0];
    step.icon = 'pi pi-file-edit';
    fixture.detectChanges();

    const first = fixture.debugElement.query(
      By.css('.i-stepper__trigger'),
    ).nativeElement;
    expect(first.querySelector('.pi-file-edit')).not.toBeNull();
    expect(first.textContent).toContain('Step 1 of 3');
  });
});
