import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';
import { IStep } from '../../../../../invensys-ng/src/lib/components/stepper/step.component';
import { IStepper } from '../../../../../invensys-ng/src/lib/components/stepper/stepper.component';
import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-steppers',
  standalone: true,
  imports: [DemoPlaygroundComponent, DemoOptionDirective, IButton, IStep, IStepper],
  templateUrl: './steppers.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './steppers.component.scss',
})
export class SteppersComponent {
  activeIndex = 0;
  detailsComplete = false;
  columnsComplete = false;
  resultsComplete = false;

  readonly sourceCode = `<i-stepper [(activeIndex)]="activeIndex" [linear]="true" ariaLabel="Report setup">
  <i-step label="Report details" icon="pi pi-file-edit" [completed]="detailsComplete">
    <div class="step-content">
      <h3>Report details</h3>
    </div>
  </i-step>

  <i-step label="Choose columns" icon="pi pi-table" [completed]="columnsComplete">
    <div class="step-content">
      <h3>Choose columns</h3>
    </div>
  </i-step>

  <i-step
    label="Refine results"
    icon="pi pi-sliders-h"
    [optional]="true"
    [completed]="resultsComplete"
  >
    <div class="step-content">
      <h3>Refine results</h3>
      @if (resultsComplete) {
        <p role="status">Report saved. All steps are complete.</p>
      }
    </div>
  </i-step>
  <div stepperActions class="step-actions">
    @if (activeIndex > 0) {
      <i-button severity="contrast" [text]="true" (clicked)="activeIndex = activeIndex - 1"
        >Back</i-button
      >
    }
    @switch (activeIndex) {
      @case (0) {
        <i-button icon="pi pi-arrow-right" (clicked)="completeDetails()"
          >Complete and continue</i-button
        >
      }
      @case (1) {
        <i-button icon="pi pi-arrow-right" (clicked)="completeColumns()"
          >Complete and continue</i-button
        >
      }
      @case (2) {
        <i-button icon="pi pi-check" (clicked)="resultsComplete = true">Save report</i-button>
      }
    }
  </div>
</i-stepper>`;

  readonly tsCode = `import { Component } from '@angular/core';
import { IButton, IStep, IStepper } from 'invensys-ng';

@Component({
  imports: [IButton, IStep, IStepper],
  templateUrl: './report-wizard.component.html',
})
export class ReportWizardComponent {
  activeIndex = 0;
  detailsComplete = false;
  columnsComplete = false;
  resultsComplete = false;

  completeDetails(): void {
    this.detailsComplete = true;
    this.activeIndex = 1;
  }

  completeColumns(): void {
    this.columnsComplete = true;
    this.activeIndex = 2;
  }
}`;

  completeDetails(): void {
    this.detailsComplete = true;
    this.activeIndex = 1;
  }

  completeColumns(): void {
    this.columnsComplete = true;
    this.activeIndex = 2;
  }
}
