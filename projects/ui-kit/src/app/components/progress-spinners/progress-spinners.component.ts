import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IProgressSpinner } from '@shared/components/progress-spinner/progress-spinner.component';
import { IButton } from '@shared/components/button/button.component';

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-progress-spinners',
  imports: [DemoPlaygroundComponent, DemoOptionDirective,
    IProgressSpinner,
    IButton,
    ],
  templateUrl: './progress-spinners.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: [
    './progress-spinners.component.scss',
    '../shared-demo-styles.scss',
  ],
})
export class ProgressSpinnersComponent {
  // Loading state for button example
  isLoading = false;

  // Code examples organized by category
  codeExamples = {
    basic: `<!-- Default spinner (medium size) -->
<i-progress-spinner></i-progress-spinner>`,

    sizes: `<!-- Small spinner -->
<i-progress-spinner size="small"></i-progress-spinner>

<!-- Medium spinner (default) -->
<i-progress-spinner size="medium"></i-progress-spinner>

<!-- Large spinner -->
<i-progress-spinner size="large"></i-progress-spinner>`,

    strokeWidth: `<!-- Custom stroke width -->
<i-progress-spinner [strokeWidth]="2"></i-progress-spinner>
<i-progress-spinner [strokeWidth]="4"></i-progress-spinner>
<i-progress-spinner [strokeWidth]="6"></i-progress-spinner>`,

    accessibility: `<!-- With custom aria-label -->
<i-progress-spinner ariaLabel="Loading data"></i-progress-spinner>
<i-progress-spinner ariaLabel="Processing request"></i-progress-spinner>`,

    withButton: `<!-- Loading button with native loading state -->
<i-button
  [loading]="isLoading"
  (clicked)="simulateLoading()"
>
  {{ isLoading ? 'Loading...' : 'Click Me' }}
</i-button>`,

    severities: `<!-- Loading buttons automatically match severity colors -->
<!-- Filled buttons show white spinner -->
<i-button severity="primary" [loading]="true">Primary</i-button>
<i-button severity="success" [loading]="true">Success</i-button>
<i-button severity="danger" [loading]="true">Danger</i-button>

<!-- Outlined buttons show colored spinner -->
<i-button severity="primary" [outlined]="true" [loading]="true">Primary</i-button>
<i-button severity="success" [outlined]="true" [loading]="true">Success</i-button>
<i-button severity="danger" [outlined]="true" [loading]="true">Danger</i-button>`,

    inCard: `<!-- Loading state in a card -->
<div class="loading-card">
  @if (isLoading) {
    <div class="loading-overlay">
      <i-progress-spinner></i-progress-spinner>
      <p>Loading content...</p>
    </div>
  } @else {
    <div class="card-content">
      <h3>Card Content</h3>
      <p>This is your loaded content.</p>
    </div>
  }
</div>`,
  };

  tsExamples = {
    withButton: `export class ExampleComponent {
  isLoading = false;

  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}`,
  };

  // Simulate loading for button example
  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
