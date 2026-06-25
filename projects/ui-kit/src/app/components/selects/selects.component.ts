import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ISelect } from '@shared/components/select/select.component';
import { IButton } from '@shared/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

export interface SelectOption {
  value: any;
  label?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-selects',
  imports: [
    ISelect,
    IButton,
    ReactiveFormsModule,
    FormsModule,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './selects.component.html',
  styleUrl: './selects.component.scss',
})
export class SelectsComponent implements OnInit {
  basicForm: FormGroup;
  validationForm: FormGroup;
  advancedForm: FormGroup;
  fluidForm: FormGroup;

  // NgModel examples - now store full objects
  countryValue: SelectOption | null = null;
  statusValue: SelectOption | null = null;
  preselectedValue: SelectOption | null = {
    value: 'us',
    label: 'United States',
    code: 'US',
  };

  // Sample data organized by category
  selectData = {
    countries: [
      { value: 'us', label: 'United States', code: 'US' },
      { value: 'uk', label: 'United Kingdom', code: 'GB' },
      { value: 'de', label: 'Germany', code: 'DE' },
      { value: 'fr', label: 'France', code: 'FR' },
      { value: 'it', label: 'Italy', code: 'IT' },
      { value: 'es', label: 'Spain', code: 'ES' },
      { value: 'ca', label: 'Canada', code: 'CA' },
      { value: 'au', label: 'Australia', code: 'AU' },
      { value: 'jp', label: 'Japan', code: 'JP' },
      { value: 'br', label: 'Brazil', code: 'BR' },
    ],

    statuses: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
      { value: 'suspended', label: 'Suspended' },
    ],

    reports: [
      { value: 1, name: 'Monthly Sales Report', department: 'Sales' },
      { value: 2, name: 'Quarterly Performance Report', department: 'Finance' },
      {
        value: 3,
        name: 'Customer Satisfaction Report',
        department: 'Customer Service',
      },
      { value: 4, name: 'Inventory Status Report', department: 'Operations' },
      { value: 5, name: 'Employee Performance Report', department: 'HR' },
    ],
  };

  // HTML Code examples organized by category
  codeExamples = {
    ngModel: `<i-select
  label="Country"
  [options]="countries"
  optionLabel="label"
  [(ngModel)]="countryValue"
  placeholder="Select country" />

<i-select
  label="Status"
  [options]="statuses"
  optionLabel="label"
  [(ngModel)]="statusValue"
  placeholder="Select status" />`,

    reactiveForm: `<form [formGroup]="basicForm">
  <i-select
    label="Country"
    [options]="countries"
    optionLabel="label"
    formControlName="country"
    placeholder="Select country" />

  <i-select
    label="Status"
    [options]="statuses"
    optionLabel="label"
    formControlName="status"
    placeholder="Select status" />
</form>`,

    validation: `<form [formGroup]="validationForm">
  <i-select
    label="Status (Required)"
    [options]="statuses"
    optionLabel="label"
    placeholder="Select status"
    formControlName="status" />
</form>`,

    advanced: `<i-select
  [options]="reports"
  [filter]="true"
  [showClear]="true"
  filterBy="name"
  optionLabel="name"
  placeholder="Select Report"
  formControlName="selectedReport" />`,

    fluid: `<i-select
  label="Fluid Select"
  [options]="countries"
  optionLabel="label"
  [fluid]="true"
  placeholder="Select option"
  formControlName="fluidSelect" />`,
  };

  // TypeScript examples
  tsExamples = {
    ngModel: `import { FormsModule } from '@angular/forms';
import { ISelect } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [FormsModule, ISelect],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // ngModel stores full objects now
  countryValue: SelectOption | null = null;
  statusValue: SelectOption | null = null;

  countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' }
  ];
}`,

    reactiveForm: `import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ISelect } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, ISelect],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Form values now store full objects
  basicForm = this.fb.group({
    country: [null],
    status: [null],
    preselected: [{ value: 'us', label: 'United States' }]
  });

  constructor(private fb: FormBuilder) {}
}`,

    validation: `import { FormBuilder, Validators } from '@angular/forms';

validationForm = this.fb.group({
  status: [null, [Validators.required]]
});`,
  };

  // Component setup
  initializationCode = `import { ISelect } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ISelect],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];
}`;

  features: Feature[] = [
    {
      title: 'Option Configuration',
      description:
        'Flexible option labels and values with custom object properties',
    },
    {
      title: 'Filtering',
      description: 'Built-in search functionality for large option lists',
    },
    {
      title: 'Clear Function',
      description: 'Optional clear button to reset selection',
    },
    {
      title: 'Form Integration',
      description: 'Full reactive forms support with validation',
    },
    {
      title: 'Disabled State',
      description: 'Support for disabled selects and individual options',
    },
    {
      title: 'Fluid Layout',
      description: 'Full-width selects for responsive designs',
    },
    {
      title: 'Custom Templates',
      description: 'Customizable option display and selection',
    },
    {
      title: 'Accessibility',
      description: 'ARIA support and keyboard navigation',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.basicForm = this.fb.group({
      country: [null],
      status: [null],
      preselected: [{ value: 'us', label: 'United States', code: 'US' }],
      disabled: [{ value: { value: 'uk', label: 'United Kingdom', code: 'GB' }, disabled: true }],
      // Now all selects store full objects by default
      fullObjectSelect: [null],
    });

    this.validationForm = this.fb.group({
      status: [null, [Validators.required]],
    });

    this.advancedForm = this.fb.group({
      selectedReport: [null],
    });

    this.fluidForm = this.fb.group({
      fluidSelect: [null],
    });
  }

  ngOnInit() {
    // Demo validation state
    setTimeout(() => {
      this.validationForm.get('status')?.markAsTouched();
    }, 100);
  }

  onReportChange() {
    console.log(
      'Report changed:',
      this.advancedForm.get('selectedReport')?.value
    );
  }

  onReportClear() {
    console.log('Report cleared');
  }

  onSubmit(form: FormGroup, formName: string) {
    if (form.valid) {
      console.log(`${formName} form submitted:`, form.value);
    } else {
      this.markFormGroupTouched(form);
    }
  }

  onCountryValueChange(value: any) {
    console.log('Country Value Changed (full object):', value);
    console.log('Form control value:', this.basicForm.get('country')?.value);
    console.log('Type:', typeof value);
    console.log('Object properties:', value ? Object.keys(value) : 'null');
  }

  onCountryObjectChange(value: any) {
    console.log('Country Object Changed (full object):', value);
    console.log(
      'Form control value:',
      this.basicForm.get('fullObjectSelect')?.value
    );
    console.log('Type:', typeof value);
    console.log('Full object properties:', value ? Object.keys(value) : 'null');
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
