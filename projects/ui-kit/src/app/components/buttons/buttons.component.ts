import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';
import { ISeverity } from '../../../../../invensys-ng/src/lib/enums/IButtonSeverity';

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-buttons',
  imports: [DemoPlaygroundComponent, DemoOptionDirective, IButton, TitleCasePipe],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
})
export class ButtonsComponent {
  // All available severity variants
  severities: ISeverity[] = [
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'contrast',
  ];

  // Code examples organized by category
  codeExamples = {
    severities: `<i-button severity="primary">Primary</i-button>
<i-button severity="secondary">Secondary</i-button>
<i-button severity="success">Success</i-button>
<i-button severity="info">Info</i-button>
<i-button severity="warning">Warning</i-button>
<i-button severity="danger">Danger</i-button>
<i-button severity="contrast">Contrast</i-button>`,

    sizes: `<i-button size="small">Small</i-button>
<i-button size="medium">Medium</i-button>
<i-button size="large">Large</i-button>`,

    styles: `<!-- Filled (default) -->
<i-button severity="primary">Primary</i-button>

<!-- Outlined -->
<i-button severity="primary" [outlined]="true">Primary</i-button>

<!-- Text -->
<i-button severity="primary" [text]="true">Primary</i-button>

<!-- Raised -->
<i-button severity="primary" [raised]="true">Primary</i-button>`,

    icons: `<!-- Button with icon and text -->
<i-button severity="primary" icon="pi pi-check">Save</i-button>

<!-- Icon-only button -->
<i-button severity="primary" icon="pi pi-check" />

<!-- Outlined icon button -->
<i-button severity="danger" icon="pi pi-trash" [outlined]="true" />`,

    fluid: `<i-button severity="primary" [fluid]="true">Submit Form</i-button>
<i-button severity="secondary" [fluid]="true" [outlined]="true">Cancel</i-button>
<i-button severity="success" [fluid]="true" [raised]="true" icon="pi pi-download">
  Download Report
</i-button>`,
  };

  // TypeScript code example
  tsExamples = {
    basic: `import { IButton } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IButton],
  templateUrl: './example.component.html'
})
export class ExampleComponent {}`,
  };

}
