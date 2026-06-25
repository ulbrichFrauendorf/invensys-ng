import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ITextarea } from '../../../../../invensys-ng/src/lib/components/textarea/textarea.component';
import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-textareas',
  imports: [
    ITextarea,
    IButton,
    ReactiveFormsModule,
    FormsModule,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './textareas.component.html',
  styleUrl: './textareas.component.scss',
})
export class TextareasComponent implements OnInit {
  basicForm: FormGroup;
  validationForm: FormGroup;

  // NgModel examples
  basicValue = '';
  notesValue = '';
  commentValue = '';
  disabledValue = 'This value cannot be edited.';
  readonlyValue = 'This is read-only content that cannot be modified.';

  codeExamples = {
    ngModel: `<i-textarea label="Description" [(ngModel)]="basicValue" />
<i-textarea label="Notes" [(ngModel)]="notesValue" [rows]="6" />
<i-textarea label="Comment" [(ngModel)]="commentValue" [maxLength]="200" />`,

    reactiveForm: `<form [formGroup]="basicForm">
  <i-textarea label="Bio" formControlName="bio" />
  <i-textarea label="Address" formControlName="address" [rows]="3" />
  <i-textarea label="Notes" formControlName="notes" [fluid]="true" />
</form>`,

    validation: `<form [formGroup]="validationForm">
  <i-textarea label="Required Field" formControlName="requiredField" />
  <i-textarea label="Min Length (20 chars)" formControlName="minLengthField" />
  <i-textarea label="Max 100 chars" formControlName="maxLengthField" [maxLength]="100" />
</form>`,

    disabled: `<i-textarea label="Disabled Textarea" [disabled]="true" />
<i-textarea label="Disabled With Value" [disabled]="true" [forceFloated]="true" />
<i-textarea label="Readonly Textarea" [readonly]="true" />`,

    charCount: `<i-textarea label="Short Comment" [maxLength]="50" [(ngModel)]="commentValue" />
<i-textarea label="Bio" [maxLength]="200" [rows]="5" [(ngModel)]="bioValue" />`,

    fluid: `<i-textarea label="Full Width Notes" [fluid]="true" [rows]="5" formControlName="notes" />`,
  };

  tsExamples = {
    ngModel: `import { FormsModule } from '@angular/forms';
import { ITextarea } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [FormsModule, ITextarea],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  basicValue = '';
  notesValue = '';
  commentValue = '';
}`,

    reactiveForm: `import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ITextarea } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, ITextarea],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  basicForm = this.fb.group({
    bio: [''],
    address: [''],
    notes: ['']
  });

  constructor(private fb: FormBuilder) {}
}`,

    validation: `import { FormBuilder, Validators } from '@angular/forms';

validationForm = this.fb.group({
  requiredField: ['', [Validators.required]],
  minLengthField: ['', [Validators.minLength(20)]],
  maxLengthField: ['', [Validators.maxLength(100)]]
});`,
  };

  features: Feature[] = [
    {
      title: 'Float Labels',
      description: 'Animated floating labels consistent with i-input-text',
    },
    {
      title: 'Character Counter',
      description: 'Optional character count with warning and over-limit states',
    },
    {
      title: 'Validation Support',
      description: 'Full Angular reactive forms and template-driven validation',
    },
    {
      title: 'Resizable',
      description: 'User-resizable with option to lock resize',
    },
    {
      title: 'Fluid Layout',
      description: 'Full-width for responsive form designs',
    },
    {
      title: 'Disabled & Readonly',
      description: 'Proper disabled and readonly styling in both themes',
    },
    {
      title: 'Theme Integration',
      description: 'Light and dark mode support via CSS variables',
    },
    {
      title: 'Accessibility',
      description: 'ARIA attributes and label association via htmlFor',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.basicForm = this.fb.group({
      bio: [''],
      address: [''],
      notes: [''],
    });

    this.validationForm = this.fb.group({
      requiredField: ['', [Validators.required]],
      minLengthField: ['', [Validators.minLength(20)]],
      maxLengthField: ['', [Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.validationForm.get('requiredField')?.markAsTouched();
      this.validationForm.get('minLengthField')?.setValue('too short');
      this.validationForm.get('minLengthField')?.markAsTouched();
    }, 100);
  }

  onSubmit(form: FormGroup, formName: string) {
    if (form.valid) {
      console.log(`${formName} form submitted:`, form.value);
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.get(key)?.markAsTouched();
        form.get(key)?.markAsDirty();
      });
    }
  }
}
