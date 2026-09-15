import { Component } from '@angular/core';
import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';
import { IStep } from '../../../../../invensys-ng/src/lib/components/stepper/step.component';
import { IStepper } from '../../../../../invensys-ng/src/lib/components/stepper/stepper.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import { Feature, FeaturesListComponent } from '../features-list/features-list.component';

@Component({
  selector: 'app-steppers',
  standalone: true,
  imports: [IButton, IStep, IStepper, DemoCardComponent, FeaturesListComponent],
  templateUrl: './steppers.component.html',
  styleUrl: './steppers.component.scss',
})
export class SteppersComponent {
  activeIndex = 0;
  detailsComplete = false;
  columnsComplete = false;

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
  >
    <!-- Third step content -->
  </i-step>
</i-stepper>`;

  readonly tsCode = `import { IStep, IStepper } from 'invensys-ng';

@Component({
  imports: [IStep, IStepper],
  templateUrl: './report-wizard.component.html'
})
export class ReportWizardComponent {
  activeIndex = 0;
  detailsComplete = false;
  columnsComplete = false;
}`;

  readonly features: Feature[] = [
    { title: 'Guided workflows', description: 'Linear mode prevents users from skipping incomplete required steps.' },
    { title: 'Progress states', description: 'Step counts remain visible alongside active, completed, optional, and disabled states.' },
    { title: 'Custom icons', description: 'Use the same PrimeIcons classes as tabs without losing step-number context.' },
    { title: 'Accessible navigation', description: 'Includes progress semantics, panel relationships, and keyboard navigation.' },
    { title: 'Responsive layouts', description: 'Supports horizontal and vertical layouts and adapts on small screens.' },
    { title: 'Projected content', description: 'Each step accepts forms, tables, or any other Angular content.' },
    { title: 'Two-way binding', description: 'The active step is controlled with [(activeIndex)].' },
  ];

  completeDetails(): void {
    this.detailsComplete = true;
    this.activeIndex = 1;
  }

  completeColumns(): void {
    this.columnsComplete = true;
    this.activeIndex = 2;
  }
}
