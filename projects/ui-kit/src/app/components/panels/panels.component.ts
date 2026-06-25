import { Component } from '@angular/core';
import { IPanel } from '../../../../../invensys-ng/src/lib/components/panel/panel.component';
import { IRadioButton } from '../../../../../invensys-ng/src/lib/components/radio-button/radio-button.component';
import { FormsModule } from '@angular/forms';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-panels',
  imports: [
    IPanel,
    IRadioButton,
    FormsModule,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './panels.component.html',
  styleUrl: './panels.component.scss',
})
export class PanelsComponent {
  // State for programmatic control example
  programmaticCollapsed = false;

  // Radio button selection
  splitOption = 'none';

  // HTML Code examples organized by category
  codeExamples = {
    basic: `<i-panel header="Options">
  <p>This is the content of the panel.</p>
  <p>You can put any content here.</p>
</i-panel>`,

    collapsed: `<i-panel header="Settings" [collapsed]="true">
  <p>This panel starts collapsed.</p>
  <p>Click the header to expand it.</p>
</i-panel>`,

    nonToggleable: `<i-panel header="Fixed Section" [toggleable]="false">
  <p>This panel cannot be toggled.</p>
  <p>It will always be visible.</p>
</i-panel>`,

    programmatic: `<i-panel 
  header="Programmatic Control" 
  [collapsed]="programmaticCollapsed"
  (collapsedChange)="programmaticCollapsed = $event">
  <p>This panel is controlled programmatically.</p>
</i-panel>

<button (click)="programmaticCollapsed = !programmaticCollapsed">
  Toggle Panel
</button>`,

    withContent: `<i-panel header="Split Options">
  <i-radio-button
    label="None"
    value="none"
    name="splitOption"
    [(ngModel)]="splitOption"
  />
  <i-radio-button
    label="Company"
    value="company"
    name="splitOption"
    [(ngModel)]="splitOption"
  />
  <i-radio-button
    label="Frequency"
    value="frequency"
    name="splitOption"
    [(ngModel)]="splitOption"
  />
  <i-radio-button
    label="PayRun"
    value="payrun"
    name="splitOption"
    [(ngModel)]="splitOption"
  />
</i-panel>`,
  };

  // TypeScript examples
  tsExamples = {
    basic: `import { IPanel } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IPanel],
  templateUrl: './example.component.html'
})
export class ExampleComponent {}`,

    programmatic: `import { IPanel } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IPanel],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  programmaticCollapsed = false;

  togglePanel() {
    this.programmaticCollapsed = !this.programmaticCollapsed;
  }
}`,

    withContent: `import { IPanel, IRadioButton } from 'invensys-ng';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  imports: [IPanel, IRadioButton, FormsModule],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  splitOption = 'none';
}`,
  };

  features: Feature[] = [
    {
      title: 'Collapsible Content',
      description:
        'Smooth collapse/expand animations with customizable content',
    },
    {
      title: 'Toggle Icons',
      description: 'Minus icon when expanded, plus icon when collapsed',
    },
    {
      title: 'Non-toggleable Mode',
      description:
        'Option to keep panel always visible without toggle functionality',
    },
    {
      title: 'Programmatic Control',
      description: 'Two-way binding for collapsed state control',
    },
    {
      title: 'Content Projection',
      description:
        'Supports any content including forms, text, and other components',
    },
    {
      title: 'Accessibility',
      description: 'ARIA attributes and keyboard navigation support',
    },
    {
      title: 'Theme Integration',
      description: 'Seamless integration with light and dark themes',
    },
  ];

  // Event handlers
  onToggle(collapsed: boolean) {
    console.log('Panel toggled:', collapsed);
  }

  toggleProgrammatic() {
    this.programmaticCollapsed = !this.programmaticCollapsed;
  }
}
