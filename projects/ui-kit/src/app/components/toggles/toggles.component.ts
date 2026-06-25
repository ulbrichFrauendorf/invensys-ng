import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { IToggle } from '../../../../../invensys-ng/src/lib/components/toggle/toggle.component';
import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import { JsonPipe } from '@angular/common';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-toggles',
  imports: [
    IToggle,
    IButton,
    DemoCardComponent,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    FeaturesListComponent,
  ],
  templateUrl: './toggles.component.html',
  styleUrl: './toggles.component.scss',
})
export class TogglesComponent {
  // ngModel examples
  basicToggled = false;
  toggledWithLabel = true;
  disabledToggled = false;
  readonlyToggled = true;

  // Size examples
  smallToggled = false;
  mediumToggled = true;
  largeToggled = false;

  // FormControl examples
  formControlExample = new FormControl(false);

  // FormGroup example
  settingsForm = new FormGroup({
    darkMode: new FormControl(true),
    notifications: new FormControl(false),
    autoSave: new FormControl(true),
    analytics: new FormControl(false),
  });

  // HTML Code examples organized by category
  codeExamples = {
    ngModel: `<i-toggle [(ngModel)]="basicToggled" />
<i-toggle [(ngModel)]="toggledWithLabel" label="Enable dark mode" />
<i-toggle [(ngModel)]="disabledToggled" [disabled]="true" label="Disabled toggle" />
<i-toggle [(ngModel)]="readonlyToggled" [readonly]="true" label="Readonly toggle" />`,

    reactiveForm: `<form [formGroup]="settingsForm">
  <i-toggle formControlName="darkMode" label="Dark mode" />
  <i-toggle formControlName="notifications" label="Push notifications" />
  <i-toggle formControlName="autoSave" label="Auto-save" />
  <i-toggle formControlName="analytics" label="Usage analytics" />
</form>`,

    sizes: `<i-toggle [(ngModel)]="smallToggled" size="small" label="Small toggle" />
<i-toggle [(ngModel)]="mediumToggled" size="medium" label="Medium toggle" />
<i-toggle [(ngModel)]="largeToggled" size="large" label="Large toggle" />`,

    formControl: `<i-toggle [formControl]="formControlExample" label="FormControl toggle" />`,
  };

  // TypeScript examples
  tsExamples = {
    ngModel: `import { FormsModule } from '@angular/forms';
import { IToggle } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [FormsModule, IToggle],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  basicToggled = false;
  toggledWithLabel = true;
  disabledToggled = false;
  readonlyToggled = true;

  onToggleChange(isOn: boolean) {
    console.log('Toggle is now:', isOn);
  }
}`,

    reactiveForm: `import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IToggle } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, IToggle],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  settingsForm = new FormGroup({
    darkMode: new FormControl(true),
    notifications: new FormControl(false),
    autoSave: new FormControl(true),
    analytics: new FormControl(false)
  });

  onFormSubmit() {
    console.log('Form submitted:', this.settingsForm.value);
  }
}`,

    formControl: `import { FormControl, ReactiveFormsModule } from '@angular/forms';

formControlExample = new FormControl(false);

// Access value
console.log(this.formControlExample.value);`,
  };

  // Component setup
  initializationCode = `import { IToggle } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IToggle],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  toggled = false;
}`;

  features: Feature[] = [
    {
      title: 'Two-way Data Binding',
      description: 'Full support for ngModel and reactive forms',
    },
    {
      title: 'Size Variants',
      description: 'Small, medium, and large toggle sizes',
    },
    {
      title: 'Label Support',
      description: 'Optional labels with proper accessibility',
    },
    {
      title: 'State Management',
      description: 'Disabled and readonly states',
    },
    {
      title: 'Form Integration',
      description: 'Works seamlessly with Angular forms',
    },
    {
      title: 'Custom Events',
      description: 'onChange event for custom handling',
    },
    {
      title: 'Accessibility',
      description: 'ARIA role="switch" with keyboard navigation',
    },
    {
      title: 'Custom Styling',
      description: 'Theme-aware styling with CSS custom properties',
    },
  ];

  // Event handlers
  onBasicChange(toggled: boolean) {
    console.log('Basic toggle changed:', toggled);
  }

  onFormSubmit() {
    console.log('Form submitted:', this.settingsForm.value);
  }

  resetForm() {
    this.settingsForm.reset({
      darkMode: false,
      notifications: false,
      autoSave: false,
      analytics: false,
    });
  }

  enableAll() {
    this.settingsForm.patchValue({
      darkMode: true,
      notifications: true,
      autoSave: true,
      analytics: true,
    });
  }
}
