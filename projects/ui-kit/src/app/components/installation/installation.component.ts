import { Component } from '@angular/core';
import { DemoCardComponent } from '../demo-card/demo-card.component';

@Component({
  selector: 'app-installation',
  imports: [DemoCardComponent],
  templateUrl: './installation.component.html',
  styleUrl: './installation.component.scss',
})
export class InstallationComponent {
  npmInstallCode = `npm install invensys-ng`;

  importComponentCode = `import { IButton } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IButton],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Your component logic here
}`;

  usageCode = `<i-button severity="primary">Click Me</i-button>`;

  multipleComponentsCode = `import {
  IButton,
  IInputText,
  ISelect,
  ICheckbox
} from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IButton, IInputText, ISelect, ICheckbox],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Your component logic here
}`;
}
