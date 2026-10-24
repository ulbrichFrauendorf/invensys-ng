import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { IMultiSelect } from '@shared/components/multi-select/multi-select.component';
import { IButton } from '@shared/components/button/button.component';
export interface MultiSelectOption {
  value: any;
  label?: string;
  [key: string]: any;
}

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-multi-selects',
  imports: [
    DemoPlaygroundComponent,
    DemoOptionDirective,
    IMultiSelect,
    IButton,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './multi-selects.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './multi-selects.component.scss',
})
export class MultiSelectsComponent implements OnInit {
  basicForm: FormGroup;
  validationForm: FormGroup;
  advancedForm: FormGroup;
  fluidForm: FormGroup;

  // NgModel examples - now store full objects
  skillsValue: MultiSelectOption[] = [];
  departmentsValue: MultiSelectOption[] = [];
  preselectedValue: MultiSelectOption[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'angular', label: 'Angular' },
  ];

  // Sample data organized by category
  selectData = {
    skills: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'angular', label: 'Angular' },
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'nodejs', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'csharp', label: 'C#' },
      { value: 'php', label: 'PHP' },
    ],

    departments: [
      { value: 1, label: 'Sales' },
      { value: 2, label: 'Marketing' },
      { value: 3, label: 'Engineering' },
      { value: 4, label: 'Human Resources' },
      { value: 5, label: 'Finance' },
      { value: 6, label: 'Operations' },
    ],

    categories: [
      {
        value: 'frontend',
        name: 'Frontend Development',
        description: 'User interface development',
      },
      {
        value: 'backend',
        name: 'Backend Development',
        description: 'Server-side development',
      },
      {
        value: 'mobile',
        name: 'Mobile Development',
        description: 'iOS and Android apps',
      },
      {
        value: 'devops',
        name: 'DevOps',
        description: 'Infrastructure and deployment',
      },
      {
        value: 'testing',
        name: 'Quality Assurance',
        description: 'Testing and validation',
      },
      {
        value: 'design',
        name: 'UI/UX Design',
        description: 'User experience design',
      },
    ],
  };

  // HTML Code examples organized by category
  codeExamples = {
    ngModel: `// ngModel now stores full objects
<i-multi-select
  label="Skills"
  [options]="skills"
  optionLabel="label"
  [(ngModel)]="skillsValue"
  placeholder="Select your skills" />

<i-multi-select
  label="Departments"
  [options]="departments"
  optionLabel="label"
  [(ngModel)]="departmentsValue"
  placeholder="Select departments" />`,

    reactiveForm: `// Form controls now store full objects
<form [formGroup]="basicForm">
  <i-multi-select
    label="Skills"
    [options]="skills"
    optionLabel="label"
    formControlName="skills"
    placeholder="Select your skills" />

  <i-multi-select
    label="Departments"
    [options]="departments"
    optionLabel="label"
    formControlName="departments"
    placeholder="Select departments" />
</form>`,

    validation: `<form [formGroup]="validationForm">
  <i-multi-select
    label="Required Skills (At least 1)"
    [options]="skills"
    optionLabel="label"
    placeholder="Select at least 1 skill"
    formControlName="requiredSkills" />

  <i-multi-select
    label="Minimum Skills (At least 2)"
    [options]="skills"
    optionLabel="label"
    placeholder="Select at least 2 skills"
    formControlName="minimumSkills" />
</form>`,

    advanced: `// Advanced multi-select - stores full objects
<i-multi-select
  [options]="categories"
  [filter]="true"
  [showClear]="true"
  filterBy="name"
  optionLabel="name"
  placeholder="Select Categories"
  [maxSelectedLabels]="3"
  formControlName="selectedCategories" />`,

    fluid: `<i-multi-select
  label="Fluid Multi-Select"
  [options]="skills"
  optionLabel="label"
  [fluid]="true"
  placeholder="Select options"
  formControlName="fluidSelect" />`,
  };

  // TypeScript examples
  tsExamples = {
    ngModel: `import { FormsModule } from '@angular/forms';
import { IMultiSelect } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [FormsModule, IMultiSelect],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // ngModel now stores full objects
  skillsValue: MultiSelectOption[] = [];
  departmentsValue: MultiSelectOption[] = [];

  skills = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'angular', label: 'Angular' }
  ];
}`,

    reactiveForm: `import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IMultiSelect } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, IMultiSelect],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Form values now store full objects
  basicForm = this.fb.group({
    skills: [[]],
    departments: [[]],
    preselected: [[
      { value: 'javascript', label: 'JavaScript' },
      { value: 'angular', label: 'Angular' }
    ]]
  });

  constructor(private fb: FormBuilder) {}
}`,

    validation: `import { FormBuilder, Validators } from '@angular/forms';

validationForm = this.fb.group({
  requiredSkills: [[], [Validators.required]],
  minimumSkills: [[], [this.minArrayLengthValidator(2)]]
});

private minArrayLengthValidator(minLength: number) {
  return (control: any) => {
    const value = control.value;
    if (!value || !Array.isArray(value) || value.length < minLength) {
      return {
        minArrayLength: {
          requiredLength: minLength,
          actualLength: value?.length || 0,
        },
      };
    }
    return null;
  };
}`,
  };

  // Component setup
  initializationCode = `import { IMultiSelect } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IMultiSelect],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];
}`;

  constructor(private fb: FormBuilder) {
    this.basicForm = this.fb.group({
      skills: [[]],
      departments: [[]],
      preselected: [
        [
          { value: 'javascript', label: 'JavaScript' },
          { value: 'angular', label: 'Angular' },
        ],
      ],
      disabled: [
        {
          value: [
            { value: 1, label: 'Sales' },
            { value: 2, label: 'Marketing' },
          ],
          disabled: true,
        },
      ],
      // Now all multi-selects store full objects by default
      fullObjectSkills: [[]],
    });

    this.validationForm = this.fb.group({
      requiredSkills: [[], [Validators.required]], // Just requires at least 1 selection
      minimumSkills: [[], [this.minArrayLengthValidator(2)]], // Requires at least 2 selections
    });

    this.advancedForm = this.fb.group({
      selectedCategories: [[]],
    });

    this.fluidForm = this.fb.group({
      fluidSelect: [[]],
    });
  }

  ngOnInit() {
    // Demo validation state
    setTimeout(() => {
      this.validationForm.get('requiredSkills')?.markAsTouched();
      this.validationForm.get('minimumSkills')?.markAsTouched();
    }, 100);
  }

  onSubmit(form: FormGroup, formName: string) {
    if (form.valid) {
      console.log(`${formName} form submitted:`, form.value);
    } else {
      this.markFormGroupTouched(form);
    }
  }

  onSkillsValueChange(values: any[]) {
    console.log('Skills Values Changed (full objects):', values);
    console.log('Form control value:', this.basicForm.get('skills')?.value);
    console.log('Array length:', values.length);
    console.log(
      'Types:',
      values.map((v) => typeof v),
    );
    console.log(
      'Object properties:',
      values.map((v) => (v ? Object.keys(v) : 'null')),
    );
  }

  onSkillsObjectChange(values: any[]) {
    console.log('Skills Objects Changed (full objects):', values);
    console.log('Form control value:', this.basicForm.get('fullObjectSkills')?.value);
    console.log('Array length:', values.length);
    console.log(
      'Types:',
      values.map((v) => typeof v),
    );
    console.log(
      'Object properties:',
      values.map((v) => (v ? Object.keys(v) : 'null')),
    );
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  private minArrayLengthValidator(minLength: number) {
    return (control: any) => {
      const value = control.value;
      if (!value || !Array.isArray(value) || value.length < minLength) {
        return {
          minArrayLength: {
            requiredLength: minLength,
            actualLength: value?.length || 0,
          },
        };
      }
      return null;
    };
  }
}
