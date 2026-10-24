import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { IInputText } from '../../../../../invensys-ng/src/lib/components/input-text/input-text.component';
import { ITextarea } from '../../../../../invensys-ng/src/lib/components/textarea/textarea.component';
import { ISelect } from '../../../../../invensys-ng/src/lib/components/select/select.component';
import { IMultiSelect } from '../../../../../invensys-ng/src/lib/components/multi-select/multi-select.component';
import { ICalendar } from '../../../../../invensys-ng/src/lib/components/calendar/calendar.component';
import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';
interface InputExample {
  label: string;
  type: string;
  placeholder?: string;
  fluid?: boolean;
  disabled?: boolean;
  formControlName: string;
}

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-input-texts',
  imports: [
    DemoPlaygroundComponent,
    DemoOptionDirective,
    IInputText,
    ITextarea,
    ISelect,
    IMultiSelect,
    ICalendar,
    IButton,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './input-texts.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './input-texts.component.scss',
})
export class InputTextsComponent implements OnInit {
  labelSurfaces = ['ground', 'tinted', 'gradient'];
  labelOptions = [
    { label: 'Alpha', value: 'alpha' },
    { label: 'Beta', value: 'beta' },
  ];
  labelDate = new Date(2026, 9, 16);

  basicForm: FormGroup;
  validationForm: FormGroup;
  fluidForm: FormGroup;
  prefilledForm: FormGroup;

  // NgModel examples
  textValue = '';
  emailValue = '';
  passwordValue = '';
  numberValue = 0;
  prefilledNumberValue = 42;

  // Organized input examples by category
  inputExamples = {
    basic: [
      { label: 'Text Input', type: 'text', formControlName: 'textInput' },
      { label: 'Email Input', type: 'email', formControlName: 'emailInput' },
      {
        label: 'Password Input',
        type: 'password',
        formControlName: 'passwordInput',
      },
      { label: 'Number Input', type: 'number', formControlName: 'numberInput' },
    ],
    validation: [
      {
        label: 'Required Field',
        type: 'text',
        formControlName: 'requiredField',
      },
      {
        label: 'Min Length (5 chars)',
        type: 'text',
        formControlName: 'minLengthField',
      },
      {
        label: 'Email Validation',
        type: 'email',
        formControlName: 'emailValidation',
      },
      {
        label: 'Pattern (Letters only)',
        type: 'text',
        formControlName: 'patternField',
      },
    ],
    fluid: [
      {
        label: 'Fluid Text Input',
        type: 'text',
        formControlName: 'fluidText',
        fluid: true,
      },
      {
        label: 'Fluid Email Input',
        type: 'email',
        formControlName: 'fluidEmail',
        fluid: true,
      },
      {
        label: 'Fluid Password Input',
        type: 'password',
        formControlName: 'fluidPassword',
        fluid: true,
      },
    ],
  };

  // HTML Code examples organized by category
  codeExamples = {
    ngModel: `<i-input-text label="Text Input" type="text" [(ngModel)]="textValue" />
<i-input-text label="Email Input" type="email" [(ngModel)]="emailValue" />
<i-input-text label="Password Input" type="password" [(ngModel)]="passwordValue" />
<i-input-text label="Number Input" type="number" [(ngModel)]="numberValue" />
<i-input-text label="Pre-filled Number" type="number" [(ngModel)]="prefilledNumberValue" />`,

    reactiveForm: `<form [formGroup]="basicForm">
  <i-input-text label="Text Input" type="text" formControlName="textInput" />
  <i-input-text label="Email Input" type="email" formControlName="emailInput" />
  <i-input-text label="Password Input" type="password" formControlName="passwordInput" />
  <i-input-text label="Number Input" type="number" formControlName="numberInput" />
</form>`,

    validation: `<form [formGroup]="validationForm">
  <i-input-text label="Required Field" type="text" formControlName="requiredField" />
  <i-input-text label="Min Length (5 chars)" type="text" formControlName="minLengthField" />
  <i-input-text label="Email Validation" type="email" formControlName="emailValidation" />
  <i-input-text label="Pattern (Letters only)" type="text" formControlName="patternField" />
</form>`,

    fluid: `<i-input-text label="Fluid Text Input" type="text" [fluid]="true" formControlName="fluidText" />
<i-input-text label="Fluid Email Input" type="email" [fluid]="true" formControlName="fluidEmail" />
<i-input-text label="Fluid Password Input" type="password" [fluid]="true" formControlName="fluidPassword" />`,

    prefilled: `<form [formGroup]="prefilledForm">
  <i-input-text label="Full Name" type="text" formControlName="prefilledText" />
  <i-input-text label="Email Address" type="email" formControlName="prefilledEmail" />
  <i-input-text label="Price" type="number" formControlName="prefilledNumber" [attr.step]="0.01" />
  <i-input-text label="Quantity" type="number" formControlName="prefilledQuantity" />
</form>`,
  };

  // TypeScript examples
  tsExamples = {
    ngModel: `import { FormsModule } from '@angular/forms';
import { IInputText } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [FormsModule, IInputText],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  textValue = '';
  emailValue = '';
  passwordValue = '';
  numberValue = 0;
  prefilledNumberValue = 42;
}`,

    reactiveForm: `import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IInputText } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, IInputText],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  basicForm = this.fb.group({
    textInput: [''],
    emailInput: [''],
    passwordInput: [''],
    numberInput: ['']
  });

  constructor(private fb: FormBuilder) {}
}`,

    validation: `import { FormBuilder, FormGroup, Validators } from '@angular/forms';

validationForm = this.fb.group({
  requiredField: ['', [Validators.required]],
  minLengthField: ['', [Validators.minLength(5)]],
  emailValidation: ['', [Validators.required, Validators.email]],
  patternField: ['', [Validators.pattern(/^[A-Za-z]+$/)]]
});`,

    prefilled: `import { FormBuilder } from '@angular/forms';

prefilledForm = this.fb.group({
  prefilledText: ['John Doe'],
  prefilledEmail: ['john.doe@example.com'],
  prefilledNumber: [123.45],
  prefilledQuantity: [5]
});`,
  };

  // Component setup
  initializationCode = `import { IInputText } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IInputText],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Component is ready to use
}`;

  constructor(private fb: FormBuilder) {
    this.basicForm = this.fb.group({
      textInput: [''],
      emailInput: [''],
      passwordInput: [''],
      numberInput: [''],
    });

    this.validationForm = this.fb.group({
      requiredField: ['', [Validators.required]],
      minLengthField: ['', [Validators.minLength(5)]],
      emailValidation: ['', [Validators.required, Validators.email]],
      patternField: ['', [Validators.pattern(/^[A-Za-z]+$/)]],
    });

    this.fluidForm = this.fb.group({
      fluidText: [''],
      fluidEmail: [''],
      fluidPassword: [''],
    });

    this.prefilledForm = this.fb.group({
      prefilledText: ['John Doe'],
      prefilledEmail: ['john.doe@example.com'],
      prefilledNumber: [123.45],
      prefilledQuantity: [5],
    });
  }

  ngOnInit() {
    // Demo some validation states
    setTimeout(() => {
      this.validationForm.get('requiredField')?.markAsTouched();
      this.validationForm.get('minLengthField')?.setValue('abc');
      this.validationForm.get('minLengthField')?.markAsTouched();
      this.validationForm.get('patternField')?.setValue('123invalid');
      this.validationForm.get('patternField')?.markAsTouched();
    }, 100);
  }

  onSubmit(form: FormGroup, formName: string) {
    if (form.valid) {
      console.log(`${formName} form submitted:`, form.value);
    } else {
      this.markFormGroupTouched(form);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }
}
