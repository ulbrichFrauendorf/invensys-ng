import { Component } from '@angular/core';
import { TooltipDirective } from '@shared/directives/tooltip/tooltip.directive';
import { IButton } from '@shared/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-tooltips',
  imports: [
    TooltipDirective,
    IButton,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './tooltips.component.html',
  styleUrl: './tooltips.component.scss',
})
export class TooltipsComponent {
  // HTML Code examples organized by category
  codeExamples = {
    basic: `<!-- Tooltip Positions -->
<i-button iTooltip="Tooltip appears above" tooltipPosition="above">
  <i class="pi pi-arrow-up"></i> Above
</i-button>

<i-button iTooltip="Tooltip appears below" tooltipPosition="below">
  <i class="pi pi-arrow-down"></i> Below
</i-button>

<i-button iTooltip="Tooltip appears to the left" tooltipPosition="left">
  <i class="pi pi-arrow-left"></i> Left
</i-button>

<i-button iTooltip="Tooltip appears to the right" tooltipPosition="right">
  Right <i class="pi pi-arrow-right"></i>
</i-button>`,

    icons: `<!-- Icon Toolbar with Tooltips -->
<div class="icon-toolbar">
  <button class="icon-btn" iTooltip="Create new document" tooltipPosition="below">
    <i class="pi pi-file"></i>
  </button>
  <button class="icon-btn" iTooltip="Save changes" tooltipPosition="below">
    <i class="pi pi-save"></i>
  </button>
  <button class="icon-btn" iTooltip="Edit content" tooltipPosition="below">
    <i class="pi pi-pencil"></i>
  </button>
  <button class="icon-btn" iTooltip="Delete selected" tooltipPosition="below">
    <i class="pi pi-trash"></i>
  </button>
</div>`,

    formHelp: `<!-- Form Field with Help Tooltip -->
<div class="form-field">
  <label class="field-label">
    Email Address
    <span
      class="help-icon"
      iTooltip="Enter your primary email address for account recovery."
      tooltipPosition="right">
      <i class="pi pi-question-circle"></i>
    </span>
  </label>
  <input type="email" placeholder="user@example.com" />
</div>

<!-- Warning Help Icon -->
<span
  class="help-icon warning"
  iTooltip="Keep this key secure! Never share it publicly."
  tooltipPosition="right">
  <i class="pi pi-exclamation-triangle"></i>
</span>`,

    timing: `<!-- Custom Tooltip Delays -->
<i-button
  iTooltip="Instant feedback for quick actions"
  tooltipPosition="above"
  [tooltipDelay]="100">
  Fast (100ms)
</i-button>

<i-button
  iTooltip="Standard delay prevents accidental triggers"
  tooltipPosition="above"
  [tooltipDelay]="500">
  Normal (500ms)
</i-button>

<i-button
  iTooltip="Slower delay for less important hints"
  tooltipPosition="above"
  [tooltipDelay]="1000">
  Slow (1000ms)
</i-button>`,

    truncated: `<!-- Truncated Text with Full Content Tooltip -->
<div
  class="truncated-item"
  iTooltip="project-requirements-document-v2-final-reviewed.pdf"
  tooltipPosition="above">
  <i class="pi pi-file-pdf file-icon"></i>
  <span class="truncated-text">project-requirements-document-v2-final-reviewed.pdf</span>
</div>`,

    status: `<!-- Status Badges with Tooltip Details -->
<span
  class="status-badge success"
  iTooltip="All systems operational. Last checked 2 minutes ago."
  tooltipPosition="above">
  <i class="pi pi-check-circle"></i>
  Online
</span>

<span
  class="status-badge warning"
  iTooltip="High CPU usage detected. Consider scaling up resources."
  tooltipPosition="above">
  <i class="pi pi-exclamation-triangle"></i>
  Warning
</span>

<span
  class="status-badge danger"
  iTooltip="Service unavailable. Our team is investigating."
  tooltipPosition="above">
  <i class="pi pi-times-circle"></i>
  Offline
</span>`,
  };

  // TypeScript examples
  tsExamples = {
    basic: `import { TooltipDirective } from 'invensys-ng';
import { IButton } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [TooltipDirective, IButton],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Tooltip directive can be applied to any element
  // Available positions: 'above' | 'below' | 'left' | 'right'
  // Custom delay in milliseconds (default: 500)
}`,
  };

  features: Feature[] = [
    {
      title: 'Positioning Options',
      description: 'Four directional positions: above, below, left, right',
    },
    {
      title: 'Any Element Support',
      description: 'Works with buttons, spans, divs, icons, and any HTML element',
    },
    {
      title: 'Custom Delays',
      description: 'Configurable show timing from instant to delayed',
    },
    {
      title: 'Auto Text Wrapping',
      description: 'Long content automatically wraps to multiple lines',
    },
    {
      title: 'Viewport Awareness',
      description: 'Automatically adjusts position to stay within viewport',
    },
    {
      title: 'Hover & Focus',
      description: 'Triggered by mouse hover and keyboard focus for accessibility',
    },
    {
      title: 'ARIA Compliant',
      description: 'Built-in accessibility support for screen readers',
    },
    {
      title: 'Lightweight',
      description: 'Minimal performance impact with efficient DOM management',
    },
  ];
}
