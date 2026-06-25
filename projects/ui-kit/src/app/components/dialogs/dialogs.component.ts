import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ExampleDialogComponent } from '../example-dialog/example-dialog.component';
import { IDialog } from '@shared/components/dialog/dialog.component';
import { IButton } from '@shared/components/button/button.component';
import { IDynamicDialogRef } from '@shared/components/dialog/services/dialog.interfaces';
import { DialogService } from '@shared/components/dialog/services/dialog.service';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import { IDialogActions } from '@shared/components/dialog/inner/dialog-actions/dialog-actions.component';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import {
  IListbox,
  ListboxOption,
} from '@shared/components/listbox/listbox.component';
import { TooltipDirective } from '@shared/directives/tooltip/tooltip.directive';
import { ISelect } from '@shared/components/select/select.component';
import { IMultiSelect } from '@shared/components/multi-select/multi-select.component';

@Component({
  selector: 'app-dialogs',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    IDialog,
    IButton,
    DemoCardComponent,
    FeaturesListComponent,
    IDialogActions,
    IListbox,
    TooltipDirective,
    ISelect,
    IMultiSelect,
  ],
  templateUrl: './dialogs.component.html',
  styleUrl: './dialogs.component.scss',
})
export class DialogsComponent implements OnInit, OnDestroy {
  ref: IDynamicDialogRef | undefined;
  dialogService = inject(DialogService);
  private fb = inject(FormBuilder);

  showBasicDialog = false;
  showSingleButtonDialog = false;
  showResponsiveDialog = false;
  showFullscreenDialog = false;
  showDropdownTestDialog = false;

  // Form for the large dialog listbox
  largeDialogForm: FormGroup;

  // Form for the dropdown test dialog
  dropdownTestForm: FormGroup;

  // Observable data for the listbox
  departmentOptions$: Observable<ListboxOption[]>;
  private departmentSubject = new BehaviorSubject<ListboxOption[]>([]);

  // Dropdown test options
  countryOptions = [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Japan', value: 'jp' },
    { label: 'Australia', value: 'au' },
  ];

  skillOptions = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Node.js', value: 'node' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
  ];

  // Initial data
  private initialDepartments: ListboxOption[] = [
    { label: 'Engineering', value: 'eng', selected: false },
    { label: 'Marketing', value: 'mkt', selected: false },
    { label: 'Sales', value: 'sales', selected: false },
    { label: 'Human Resources', value: 'hr', selected: false },
    { label: 'Finance', value: 'fin', selected: false },
    { label: 'Operations', value: 'ops', selected: false },
    { label: 'Customer Support', value: 'support', selected: false },
    { label: 'Product Management', value: 'pm', selected: false },
  ];

  private intervalSub: any;

  constructor() {
    // Initialize the form with the selectedDepartments field
    this.largeDialogForm = this.fb.group({
      selectedDepartments: [[], [Validators.required, Validators.minLength(1)]],
    });

    // Initialize the dropdown test form
    this.dropdownTestForm = this.fb.group({
      country: [null, Validators.required],
      skills: [[], Validators.required],
    });

    // Set up the observable
    this.departmentOptions$ = this.departmentSubject.asObservable();
  }

  ngOnInit() {
    // Initialize with the initial data
    this.departmentSubject.next([...this.initialDepartments]);

    // Start simulating dynamic data updates
    this.simulateDynamicData();
  }

  ngOnDestroy() {
    if (this.intervalSub) {
      clearInterval(this.intervalSub);
    }
  }

  simulateDynamicData() {
    // Simulate dynamic updates every 10 seconds
    this.intervalSub = setInterval(() => {
      const currentOptions = [...this.initialDepartments];

      // Randomly add/remove a "New Department" option
      const hasNewDept = Math.random() > 0.5;
      if (hasNewDept) {
        currentOptions.push({
          label: `New Department (${new Date().getSeconds()})`,
          value: `new-dept-${Date.now()}`,
          selected: false,
        });
      }

      // Randomly modify availability of some departments
      currentOptions.forEach((option) => {
        if (option['value'] !== 'eng') {
          // Keep Engineering always available
          option['disabled'] = Math.random() > 0.8; // 20% chance to be disabled
        }
      });

      console.log('Updated department options:', currentOptions);
      this.departmentSubject.next(currentOptions);
    }, 10000);
  }

  // TypeScript code example for Dynamic Dialog Service
  dynamicDialogTsCode = `// example-dialog.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDialogBase } from 'invensys-ng';
import { IDialogActions } from 'invensys-ng';
import { IInputText } from 'invensys-ng';

@Component({
  selector: 'app-example-dialog',
  imports: [CommonModule, ReactiveFormsModule, IDialogActions, IInputText],
  template: \`
    <div class="example-dialog-content">
      <p>{{ getData()?.message }}</p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <i-input-text label="Your Name" formControlName="user" [fluid]="true"></i-input-text>
        <i-dialog-actions
          slot="footer"
          (cancelEvent)="onHide()"
          (submitEvent)="onSubmit()"
          submitLabel="Submit"
          cancelLabel="Cancel"
          [submitDisabled]="form.invalid"
        ></i-dialog-actions>
      </form>
    </div>
  \`,
})
export class ExampleDialogComponent extends IDialogBase {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      user: ['', [Validators.required]],
    });
  }

  override ngOnInit() {
    super.ngOnInit();
    const data = this.getData();
    if (data) {
      this.form.patchValue({ user: data.user || '' });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.close(this.form.value);
    }
  }

  onHide() {
    this.close();
  }
}

// dialogs.component.ts - Opening the dialog
import { Component, inject } from '@angular/core';
import { DialogService, IDynamicDialogRef } from 'invensys-ng';
import { ExampleDialogComponent } from './example-dialog.component';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html'
})
export class DialogsComponent {
  ref: IDynamicDialogRef | undefined;
  dialogService = inject(DialogService);

  displayExampleDialog() {
    this.ref = this.dialogService.open(ExampleDialogComponent, {
      header: 'Example Dynamic Dialog',
      width: '600px',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': { width: '720px', height: '420px' },
        '640px': { width: '576px', height: '480px' },
      },
      data: {
        message: 'Hello from Dialog Service!',
        timestamp: new Date().toISOString(),
        user: 'Test User',
      },
    });

    this.ref.onClose.subscribe((result) => {
      console.log('Dialog closed with result:', result);
    });
  }
}`;

  // Code examples organized by category
  codeExamples = {
    dynamic: `
<i-button severity="primary" (clicked)="displayExampleDialog()">
  Open Dynamic Dialog
</i-button>`,

    basic: `<i-dialog
  [(visible)]="showBasicDialog"
  [closable]="true"
  header="Welcome to Invensys"
  width="500px"
  height="600px"
  [breakpoints]="{
    '640px': { width: '576px', height: '510px' },
  }">
  <div class="dialog-content basic-dialog">
    <div class="dialog-icon">
      <i class="pi pi-check-circle"></i>
    </div>
    <h4>Getting Started</h4>
    <p class="dialog-description">
      Welcome to the Invensys component library! This dialog demonstrates a
      clean, user-friendly design with proper spacing and hierarchy.
    </p>
    <div class="feature-highlights">
      <div class="highlight-item">
        <i class="pi pi-bolt"></i>
        <span>Fast & Responsive</span>
      </div>
      <div class="highlight-item">
        <i class="pi pi-shield"></i>
        <span>Accessible (WCAG 2.1)</span>
      </div>
      <div class="highlight-item">
        <i class="pi pi-palette"></i>
        <span>Themeable</span>
      </div>
    </div>
  </div>
  <i-dialog-actions
    slot="footer"
    (cancelEvent)="onBasicDialogHide()"
    (submitEvent)="onBasicDialogHide()"
    submitLabel="Get Started"
    cancelLabel="Maybe Later"
  ></i-dialog-actions>
</i-dialog>`,

    singleButton: `<i-dialog
  [(visible)]="showSingleButtonDialog"
  [closable]="true"
  header="Notification"
  width="24rem"
  [breakpoints]="{
    '640px': { width: '576px' },
  }">
  <div class="dialog-content basic-dialog">
    <div class="dialog-icon success">
      <i class="pi pi-check-circle"></i>
    </div>
    <h4>Success!</h4>
    <p class="dialog-description">
      Your changes have been saved successfully. This dialog only has one
      action button for acknowledgment.
    </p>
  </div>
  <i-dialog-actions
    slot="footer"
    (submitEvent)="onSingleButtonDialogHide()"
    submitLabel="OK"
    [showCancel]="false"
  ></i-dialog-actions>
</i-dialog>`,

    responsive: `<i-dialog
  [(visible)]="showResponsiveDialog"
  header="Screen Size Adaptation"
  width="800px"
  height="600px"
  [breakpoints]="{
    '960px': { width: '720px', height: '420px' },
    '640px': { width: '576px', height: '480px' },
  }">
  <div class="dialog-content responsive-dialog">
    <div class="responsive-info-card">
      <div class="info-header">
        <i class="pi pi-desktop"></i>
        <h5>Current Breakpoint</h5>
      </div>
      <p class="breakpoint-indicator">
        Resize your browser to see the dialog adapt automatically.
      </p>
    </div>
    <!-- Breakpoint cards and content -->
  </div>
  <i-dialog-actions
    slot="footer"
    (cancelEvent)="onResponsiveDialogHide()"
    (submitEvent)="onResponsiveDialogHide()"
    submitLabel="Got It"
    cancelLabel="Close"
  ></i-dialog-actions>
</i-dialog>`,

    fullscreen: `<i-dialog
  [(visible)]="showFullscreenDialog"
  header="Team Assignment"
  [modal]="true"
  width="600px"
  height="800px"
  [breakpoints]="{
    '960px': { width: '768px', height: '680px' },
    '640px': { width: '608px', height: '720px' },
  }">
  <div class="dialog-content large-dialog">
    <div class="dialog-intro">
      <i class="pi pi-users"></i>
      <div>
        <h4>Select Team Departments</h4>
        <p>Choose the departments you want to assign to this project.</p>
      </div>
    </div>
    <!-- Form content -->
  </div>
  <i-dialog-actions
    slot="footer"
    (cancelEvent)="onFullscreenDialogHide()"
    (submitEvent)="onFullscreenDialogSubmit()"
    submitLabel="Assign Departments"
    cancelLabel="Cancel"
    [submitDisabled]="largeDialogForm.invalid"
  ></i-dialog-actions>
</i-dialog>`,
  };

  features: Feature[] = [
    {
      title: 'Dynamic Dialog Service',
      description: 'Programmatically open dialogs with the DialogService',
    },
    {
      title: 'Template Dialogs',
      description: 'Declarative dialogs using the i-dialog component',
    },
    {
      title: 'Modal & Non-Modal',
      description: 'Support for both modal and non-modal dialog behaviors',
    },
    {
      title: 'Responsive Design',
      description: 'Breakpoint-based responsive sizing for mobile devices',
    },
    {
      title: 'Large Dialogs',
      description: 'Support for large viewport dimensions',
    },
    {
      title: 'Header & Footer',
      description: 'Customizable header and footer content areas',
    },
    {
      title: 'Keyboard Support',
      description: 'ESC key to close and focus management',
    },
    {
      title: 'Accessibility',
      description: 'ARIA compliant with proper focus trapping',
    },
  ];

  displayExampleDialog() {
    this.ref = this.dialogService.open(ExampleDialogComponent, {
      header: 'Example Dynamic Dialog',
      width: '600px',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': { width: '75vw', height: '70vh' },
        '640px': { width: '90vw', height: '80vh' },
      },
      data: {
        message: 'Hello from Dialog Service!',
        timestamp: new Date().toISOString(),
        user: 'Test User',
      },
    });

    this.ref.onClose.subscribe((result) => {
      console.log('Dialog closed with result:', result);
    });
  }

  showBasicDialogModal() {
    this.showBasicDialog = true;
  }

  showResponsiveDialogModal() {
    this.showResponsiveDialog = true;
  }

  showFullscreenDialogModal() {
    this.showFullscreenDialog = true;
  }

  onBasicDialogHide() {
    this.showBasicDialog = false;
  }

  showSingleButtonDialogModal() {
    this.showSingleButtonDialog = true;
  }

  onSingleButtonDialogHide() {
    this.showSingleButtonDialog = false;
  }

  onResponsiveDialogHide() {
    this.showResponsiveDialog = false;
  }

  onFullscreenDialogHide() {
    this.showFullscreenDialog = false;
  }

  onFullscreenDialogSubmit() {
    if (this.largeDialogForm.valid) {
      console.log('Selected departments:', this.largeDialogForm.value);
      this.showFullscreenDialog = false;
    }
  }

  showDropdownTestDialogModal() {
    this.showDropdownTestDialog = true;
  }

  onDropdownTestDialogHide() {
    this.showDropdownTestDialog = false;
    this.dropdownTestForm.reset();
  }

  onDropdownTestDialogSubmit() {
    if (this.dropdownTestForm.valid) {
      console.log('Dropdown test form:', this.dropdownTestForm.value);
      this.showDropdownTestDialog = false;
      this.dropdownTestForm.reset();
    }
  }
}
