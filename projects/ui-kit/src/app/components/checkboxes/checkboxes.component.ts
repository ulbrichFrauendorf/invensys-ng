import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ICheckbox } from '../../../../../invensys-ng/src/lib/components/checkbox/checkbox.component';
import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';
import { JsonPipe } from '@angular/common';
import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-checkboxes',
  imports: [DemoPlaygroundComponent, DemoOptionDirective,
    ICheckbox,
    IButton,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    ],
  templateUrl: './checkboxes.component.html',
  styleUrl: './checkboxes.component.scss',
})
export class CheckboxesComponent {
  // ngModel examples
  basicChecked = false;
  checkedWithLabel = true;
  disabledChecked = false;
  readonlyChecked = true;

  // Size examples
  smallChecked = false;
  mediumChecked = true;
  largeChecked = false;

  // FormControl examples
  formControlExample = new FormControl(false);

  // FormGroup example
  userPreferencesForm = new FormGroup({
    notifications: new FormControl(true),
    newsletter: new FormControl(false),
    marketing: new FormControl(false),
    analytics: new FormControl(true),
  });

  // HTML Code examples organized by category
  codeExamples = {
    ngModel: `<i-checkbox [(ngModel)]="basicChecked" />
<i-checkbox [(ngModel)]="checkedWithLabel" label="Accept terms and conditions" />
<i-checkbox [(ngModel)]="disabledChecked" [disabled]="true" label="Disabled checkbox" />
<i-checkbox [(ngModel)]="readonlyChecked" [readonly]="true" label="Readonly checkbox" />`,

    reactiveForm: `<form [formGroup]="userPreferencesForm">
  <i-checkbox formControlName="notifications" label="Email notifications" />
  <i-checkbox formControlName="newsletter" label="Subscribe to newsletter" />
  <i-checkbox formControlName="marketing" label="Marketing communications" />
  <i-checkbox formControlName="analytics" label="Usage analytics" />
</form>`,

    sizes: `<i-checkbox [(ngModel)]="smallChecked" size="small" label="Small checkbox" />
<i-checkbox [(ngModel)]="mediumChecked" size="medium" label="Medium checkbox" />
<i-checkbox [(ngModel)]="largeChecked" size="large" label="Large checkbox" />`,

    formControl: `<i-checkbox [formControl]="formControlExample" label="FormControl checkbox" />`,
  };

  // TypeScript examples
  tsExamples = {
    ngModel: `import { FormsModule } from '@angular/forms';
import { ICheckbox } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [FormsModule, ICheckbox],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  basicChecked = false;
  checkedWithLabel = true;
  disabledChecked = false;
  readonlyChecked = true;

  onCheckboxChange(isChecked: boolean) {
    console.log('Checkbox is now:', isChecked);
  }
}`,

    reactiveForm: `import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ICheckbox } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, ICheckbox],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  userPreferencesForm = new FormGroup({
    notifications: new FormControl(true),
    newsletter: new FormControl(false),
    marketing: new FormControl(false),
    analytics: new FormControl(true)
  });

  onFormSubmit() {
    console.log('Form submitted:', this.userPreferencesForm.value);
  }
}`,

    formControl: `import { FormControl, ReactiveFormsModule } from '@angular/forms';

formControlExample = new FormControl(false);

// Access value
console.log(this.formControlExample.value);`,
  };

  // Component setup
  initializationCode = `import { ICheckbox } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ICheckbox],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  checked = false;
}`;

  // Event handlers
  onBasicChange(checked: boolean) {
    console.log('Basic checkbox changed:', checked);
    console.log('Current state:', this.basicChecked);
  }

  onFormSubmit() {
    console.log('Form submitted:', this.userPreferencesForm.value);
  }

  resetForm() {
    this.userPreferencesForm.reset({
      notifications: false,
      newsletter: false,
      marketing: false,
      analytics: false,
    });
  }

  selectAll() {
    this.userPreferencesForm.patchValue({
      notifications: true,
      newsletter: true,
      marketing: true,
      analytics: true,
    });
  }
}
