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

  readonly sourceCode = `<i-stepper [(activeIndex)]="activeIndex" [linear]="true">
  <i-step
    label="Report details"
    description="Name, access and scope"
    icon="pi pi-file-edit"
    [completed]="detailsComplete"
  >
    <!-- First step content -->
  </i-step>
  <i-step
    label="Choose columns"
    description="Select and arrange fields"
    icon="pi pi-table"
    [completed]="columnsComplete"
  >
    <!-- Second step content -->
  </i-step>
  <i-step
    label="Refine results"
    description="Optional filters and sorting"
    icon="pi pi-sliders-h"
    [optional]="true"
    [completed]="resultsComplete"
  >
    <!-- Final step content -->
  </i-step>
  <div stepperActions>
    @if (activeIndex === 0) {
      <i-button (clicked)="completeDetails()">Complete and continue</i-button>
    } @else if (activeIndex === 1) {
      <i-button (clicked)="completeColumns()">Complete and continue</i-button>
    } @else {
      <i-button (clicked)="resultsComplete = true">Save report</i-button>
    }
  </div>
</i-stepper>`;

  readonly tsCode = `import { IButton, IStep, IStepper } from 'invensys-ng';

@Component({
  imports: [IButton, IStep, IStepper],
  templateUrl: './report-wizard.component.html'
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
