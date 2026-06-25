import { Component } from '@angular/core';
import { IAccordion } from '../../../../../invensys-ng/src/lib/components/accordion/accordion.component';
import { IAccordionList } from '../../../../../invensys-ng/src/lib/components/accordion-list/accordion-list.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-accordions',
  imports: [
    IAccordion,
    IAccordionList,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './accordions.component.html',
  styleUrl: './accordions.component.scss',
})
export class AccordionsComponent {
  // State for programmatic control example
  programmaticExpanded = false;

  // State for accordion list examples
  singleModeExpanded1 = false;
  singleModeExpanded2 = false;
  singleModeExpanded3 = false;

  multipleModeExpanded1 = true;
  multipleModeExpanded2 = false;
  multipleModeExpanded3 = true;

  // HTML Code examples organized by category
  codeExamples = {
    basic: `<i-accordion header="Basic Accordion">
  <p>This is the content of the accordion.</p>
  <p>You can put any content here.</p>
</i-accordion>`,

    withIcon: `<i-accordion header="Accordion with Icon" icon="pi pi-info-circle">
  <p>This accordion has an icon in the header.</p>
</i-accordion>

<i-accordion header="Settings" icon="pi pi-cog">
  <p>Configure your settings here.</p>
</i-accordion>`,

    disabled: `<i-accordion header="Disabled Accordion" [disabled]="true">
  <p>This accordion cannot be toggled.</p>
</i-accordion>`,

    programmatic: `<i-accordion 
  header="Programmatic Control" 
  [expanded]="programmaticExpanded"
  (expandedChange)="programmaticExpanded = $event">
  <p>This accordion is controlled programmatically.</p>
</i-accordion>

<button (click)="programmaticExpanded = !programmaticExpanded">
  Toggle Accordion
</button>`,

    singleMode: `<i-accordion-list [multiple]="false">
  <i-accordion header="Section 1">
    <p>Content for section 1</p>
  </i-accordion>
  <i-accordion header="Section 2">
    <p>Content for section 2</p>
  </i-accordion>
  <i-accordion header="Section 3">
    <p>Content for section 3</p>
  </i-accordion>
</i-accordion-list>`,

    multipleMode: `<i-accordion-list [multiple]="true">
  <i-accordion header="Section 1" [expanded]="true">
    <p>Content for section 1</p>
  </i-accordion>
  <i-accordion header="Section 2">
    <p>Content for section 2</p>
  </i-accordion>
  <i-accordion header="Section 3" [expanded]="true">
    <p>Content for section 3</p>
  </i-accordion>
</i-accordion-list>`,
  };

  // TypeScript examples
  tsExamples = {
    basic: `import { IAccordion } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IAccordion],
  templateUrl: './example.component.html'
})
export class ExampleComponent {}`,

    programmatic: `import { IAccordion } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IAccordion],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  programmaticExpanded = false;

  toggleAccordion() {
    this.programmaticExpanded = !this.programmaticExpanded;
  }
}`,

    accordionList: `import { IAccordion, IAccordionList } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IAccordion, IAccordionList],
  templateUrl: './example.component.html'
})
export class ExampleComponent {}`,
  };

  // Component initialization
  initializationCode = `import { IAccordion, IAccordionList } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IAccordion, IAccordionList],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  expanded = false;
}`;

  features: Feature[] = [
    {
      title: 'Expandable Content',
      description: 'Smooth expand/collapse animations with customizable content',
    },
    {
      title: 'Icon Support',
      description: 'Optional header icons using PrimeIcons format',
    },
    {
      title: 'Disabled State',
      description: 'Prevent user interaction with disabled accordions',
    },
    {
      title: 'Programmatic Control',
      description: 'Two-way binding for expanded state control',
    },
    {
      title: 'Single Expansion Mode',
      description: 'Accordion list where only one item can be open at a time',
    },
    {
      title: 'Multiple Expansion Mode',
      description: 'Accordion list allowing multiple items to be open simultaneously',
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
  onToggle(expanded: boolean) {
    console.log('Accordion toggled:', expanded);
  }

  toggleProgrammatic() {
    this.programmaticExpanded = !this.programmaticExpanded;
  }
}
