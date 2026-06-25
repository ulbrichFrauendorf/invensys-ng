import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IRadioButton } from '../../../../../invensys-ng/src/lib/components/radio-button/radio-button.component';
import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import { JsonPipe } from '@angular/common';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-radio-buttons',
  imports: [
    IRadioButton,
    IButton,
    DemoCardComponent,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    FeaturesListComponent,
  ],
  templateUrl: './radio-buttons.component.html',
  styleUrl: './radio-buttons.component.scss',
})
export class RadioButtonsComponent {
  // ngModel examples
  selectedOption = 'option1';
  selectedGender = 'male';
  selectedPlan = '';

  // FormControl examples
  colorControl = new FormControl('red');

  // FormGroup example
  surveyForm = new FormGroup({
    satisfaction: new FormControl('good', Validators.required),
    recommendation: new FormControl('yes'),
  });

  // HTML Code examples
  codeExamples = {
    basic: `<i-radio-button 
  label="Option 1" 
  value="option1" 
  name="options"
  [(ngModel)]="selectedOption">
</i-radio-button>
<i-radio-button 
  label="Option 2" 
  value="option2" 
  name="options"
  [(ngModel)]="selectedOption">
</i-radio-button>
<i-radio-button 
  label="Option 3" 
  value="option3" 
  name="options"
  [(ngModel)]="selectedOption">
</i-radio-button>`,

    gender: `<i-radio-button 
  label="Male" 
  value="male" 
  name="gender"
  [(ngModel)]="selectedGender">
</i-radio-button>
<i-radio-button 
  label="Female" 
  value="female" 
  name="gender"
  [(ngModel)]="selectedGender">
</i-radio-button>
<i-radio-button 
  label="Other" 
  value="other" 
  name="gender"
  [(ngModel)]="selectedGender">
</i-radio-button>`,

    disabled: `<i-radio-button 
  label="Available" 
  value="available" 
  name="availability"
  [(ngModel)]="selectedPlan">
</i-radio-button>
<i-radio-button 
  label="Unavailable (Disabled)" 
  value="unavailable" 
  name="availability"
  [disabled]="true"
  [(ngModel)]="selectedPlan">
</i-radio-button>`,

    reactiveForm: `<form [formGroup]="surveyForm">
  <div class="form-group">
    <label>How satisfied are you?</label>
    <i-radio-button label="Very Good" value="very-good" name="satisfaction" formControlName="satisfaction" />
    <i-radio-button label="Good" value="good" name="satisfaction" formControlName="satisfaction" />
    <i-radio-button label="Average" value="average" name="satisfaction" formControlName="satisfaction" />
    <i-radio-button label="Poor" value="poor" name="satisfaction" formControlName="satisfaction" />
  </div>
  <div class="form-group">
    <label>Would you recommend us?</label>
    <i-radio-button label="Yes" value="yes" name="recommendation" formControlName="recommendation" />
    <i-radio-button label="No" value="no" name="recommendation" formControlName="recommendation" />
  </div>
</form>`,

    formControl: `<i-radio-button label="Red" value="red" name="color" [formControl]="colorControl" />
<i-radio-button label="Green" value="green" name="color" [formControl]="colorControl" />
<i-radio-button label="Blue" value="blue" name="color" [formControl]="colorControl" />`,
  };

  // TypeScript examples
  tsExamples = {
    basic: `import { FormsModule } from '@angular/forms';
import { IRadioButton } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [FormsModule, IRadioButton],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  selectedOption = 'option1';
}`,

    reactiveForm: `import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRadioButton } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, IRadioButton],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  surveyForm = new FormGroup({
    satisfaction: new FormControl('good', Validators.required),
    recommendation: new FormControl('yes')
  });

  onFormSubmit() {
    console.log('Form submitted:', this.surveyForm.value);
  }
}`,

    formControl: `import { FormControl, ReactiveFormsModule } from '@angular/forms';

colorControl = new FormControl('red');

// Access value
console.log(this.colorControl.value);`,
  };

  features: Feature[] = [
    {
      title: 'Two-way Data Binding',
      description: 'Full support for ngModel and reactive forms',
    },
    {
      title: 'Group Selection',
      description: 'Radio buttons with same name work as a group',
    },
    {
      title: 'Label Support',
      description: 'Optional labels with proper accessibility',
    },
    {
      title: 'Disabled State',
      description: 'Support for disabled styling and interaction prevention',
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
      description: 'ARIA attributes and keyboard navigation',
    },
    {
      title: 'Custom Styling',
      description: 'Theme-aware styling with CSS custom properties',
    },
  ];

  // Event handlers
  onOptionChange(value: any) {
    console.log('Option changed:', value);
  }

  onFormSubmit() {
    console.log('Form submitted:', this.surveyForm.value);
  }

  resetForm() {
    this.surveyForm.reset({
      satisfaction: '',
      recommendation: '',
    });
  }
}
