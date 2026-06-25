import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe, JsonPipe } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, BehaviorSubject, interval, map, takeWhile } from 'rxjs';
import {
  IListbox,
  ListboxOption,
} from '@shared/components/listbox/listbox.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-listboxes',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    IListbox,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './listboxes.component.html',
  styleUrls: ['./listboxes.component.scss', '../shared-demo-styles.scss'],
})
export class ListboxesComponent implements OnInit, OnDestroy {
  // Reactive form for departments example
  public departmentsForm: FormGroup;
  public departmentOptions$: Observable<ListboxOption[]>;
  private departmentSubject = new BehaviorSubject<ListboxOption[]>([]);
  private isComponentActive = true;

  // Simulated departments data that updates over time
  private initialDepartments: ListboxOption[] = [
    { id: 1, name: 'Engineering', code: 'ENG', employees: 25 },
    { id: 2, name: 'Marketing', code: 'MKT', employees: 12 },
    { id: 3, name: 'Sales', code: 'SAL', employees: 18 },
  ];

  // Sample data for the listbox
  countries = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Australia', code: 'AU' },
  ];

  // Large dataset for constrained height demo (50 items)
  largeDataset = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  // Selected model for constrained large dataset demo (now full object)
  selectedLargeItems: ListboxOption | null = null;

  // Tasks data with icons
  tasks = [
    { name: 'Review Documents', value: 'review', icon: 'pi pi-file' },
    { name: 'Send Emails', value: 'email', icon: 'pi pi-envelope' },
    { name: 'Schedule Meeting', value: 'meeting', icon: 'pi pi-calendar' },
    { name: 'Update Database', value: 'database', icon: 'pi pi-database' },
    { name: 'Create Report', value: 'report', icon: 'pi pi-chart-bar' },
  ];

  // Menu items for displayAsMenu demo
  menuItems = [
    { name: 'Dashboard', value: 'dashboard', icon: 'pi pi-home' },
    { name: 'Settings', value: 'settings', icon: 'pi pi-cog' },
    { name: 'Profile', value: 'profile', icon: 'pi pi-user' },
    { name: 'Messages', value: 'messages', icon: 'pi pi-envelope' },
    { name: 'Notifications', value: 'notifications', icon: 'pi pi-bell' },
    { name: 'Help', value: 'help', icon: 'pi pi-question-circle' },
  ];

  // Multiple selection listbox values (now full objects)
  selectedCountriesMultiple: ListboxOption[] = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
  ];

  // Single selection listbox value (now full object)
  selectedCountrySingle: ListboxOption | null = {
    name: 'United Kingdom',
    code: 'UK',
  };

  // Tasks selection (now full objects)
  selectedTasks: ListboxOption[] = [
    { name: 'Review Documents', value: 'review', icon: 'pi pi-file' },
  ];

  // Menu selection
  selectedMenuItem: ListboxOption | null = {
    name: 'Dashboard',
    value: 'dashboard',
    icon: 'pi pi-home',
  };

  constructor(private fb: FormBuilder) {
    // Initialize reactive form - now stores full department objects
    this.departmentsForm = this.fb.group({
      selectedDepartments: [
        [
          { id: 1, name: 'Engineering', code: 'ENG', employees: 25 },
          { id: 2, name: 'Marketing', code: 'MKT', employees: 12 },
        ],
        [Validators.required, Validators.minLength(1)],
      ],
    });

    // Initialize the observable with the subject
    this.departmentOptions$ = this.departmentSubject.asObservable();

    // Start with initial data
    this.departmentSubject.next(this.initialDepartments);
  }

  ngOnInit() {
    // Simulate dynamic data updates every 5 seconds
    this.simulateDynamicData();

    // Debug form changes - listbox with reactive forms and observable data
    this.departmentsForm
      .get('selectedDepartments')
      ?.valueChanges.subscribe((value) => {
        console.log('Departments form value changed:', value);
      });
  }

  ngOnDestroy() {
    this.isComponentActive = false;
  }

  private simulateDynamicData() {
    // Simulate adding new departments over time
    const additionalDepartments = [
      { id: 4, name: 'Human Resources', code: 'HR', employees: 8 },
      { id: 5, name: 'Finance', code: 'FIN', employees: 15 },
      { id: 6, name: 'Operations', code: 'OPS', employees: 22 },
      { id: 7, name: 'Research & Development', code: 'RND', employees: 30 },
    ];

    // Add a new department every 5 seconds
    interval(5000)
      .pipe(
        takeWhile(() => this.isComponentActive),
        map((index) => index % additionalDepartments.length)
      )
      .subscribe((index) => {
        const currentDepartments = this.departmentSubject.value;
        const newDepartment = additionalDepartments[index];

        // Check if department already exists to avoid duplicates
        if (
          !currentDepartments.some((dept) => dept['id'] === newDepartment['id'])
        ) {
          const updatedDepartments = [...currentDepartments, newDepartment];
          this.departmentSubject.next(updatedDepartments);
        }
      });
  }

  onMultipleSelectionChange(value: ListboxOption[]) {
    console.log('Multiple selection changed (full objects):', value);
    this.selectedCountriesMultiple = value;
  }

  onSingleSelectionChange(value: ListboxOption | null) {
    console.log('Single selection changed (full object):', value);
    this.selectedCountrySingle = value;
  }

  onClear() {
    console.log('Selection cleared');
  }

  onAddCountry() {
    console.log('Add country action clicked');
    alert('Add Country action triggered!');
  }

  onManageTasks() {
    console.log('Manage tasks action clicked');
    alert('Manage Tasks action triggered!');
  }

  onAddUser() {
    console.log('Add user action clicked');
    alert('Add User action triggered!');
  }

  // Features list for the component
  features: Feature[] = [
    {
      title: 'Modern Header',
      description:
        'Fixed header with title property and optional action button for quick actions.',
    },
    {
      title: 'Single & Multiple Selection',
      description:
        'Configure with [multiple] property. Checkboxes are hidden in single-select mode.',
    },
    {
      title: 'Chip Display',
      description:
        'Selected items in multiselect mode display as removable chips in the header area.',
    },
    {
      title: 'Option Icons',
      description:
        'Add icons to options using the optionIcon property for enhanced visual clarity.',
    },
    {
      title: 'Display as Menu',
      description:
        'Style listbox as a menu with larger text, chevron indicators, and menu-style selection highlighting.',
    },
    {
      title: 'Action Button',
      description:
        'Add an action button in the header using actionIcon, actionTooltip, and (onAction) output.',
    },
    {
      title: 'Built-in Filtering',
      description:
        'Optional search functionality to filter through large option lists.',
    },
    {
      title: 'Form Integration',
      description:
        'Full support for Angular reactive forms and template-driven forms.',
    },
    {
      title: 'Observable Data Support',
      description:
        'Real-time data updates through RxJS observables with automatic change detection.',
    },
  ];

  // Code examples for demo cards
  codeExamples = {
    multiple: `<i-listbox
  title="Countries"
  [options]="countries"
  optionLabel="name"
  [multiple]="true"
  [showClear]="true"
  actionIcon="pi pi-plus"
  actionTooltip="Add Country"
  (onAction)="onAddCountry()"
  [(ngModel)]="selectedCountriesMultiple">
</i-listbox>`,

    single: `<i-listbox
  title="Select Country"
  [options]="countries"
  optionLabel="name"
  [multiple]="false"
  [showClear]="true"
  [(ngModel)]="selectedCountrySingle">
</i-listbox>`,

    withIcons: `<i-listbox
  title="Tasks"
  [options]="tasks"
  optionLabel="name"
  [multiple]="true"
  optionIcon="icon"
  actionIcon="pi pi-cog"
  actionTooltip="Manage Tasks"
  (onAction)="onManageTasks()">
</i-listbox>`,

    displayAsMenu: `<i-listbox
  title="Navigation"
  [options]="menuItems"
  optionLabel="name"
  [multiple]="false"
  [displayAsMenu]="true"
  [filter]="false"
  [(ngModel)]="selectedMenuItem">
</i-listbox>`,

    filter: `<i-listbox
  title="Searchable Countries"
  [options]="countries"
  optionLabel="name"
  [multiple]="true"
  [filter]="true"
  filterBy="name"
  [showClear]="true">
</i-listbox>`,

    fluid: `<i-listbox
  title="Full Width Listbox"
  [options]="countries"
  optionLabel="name"
  [multiple]="true"
  [fluid]="true"
  [showClear]="true">
</i-listbox>`,

    disabled: `<i-listbox
  title="Disabled Listbox"
  [options]="countries"
  optionLabel="name"
  [multiple]="true"
  [disabled]="true"
  [ngModel]="preselectedCountries">
</i-listbox>`,

    constrained: `<div class="constrained-wrapper">
  <i-listbox
    title="Items (50 total)"
    [options]="largeDataset"
    optionLabel="name"
    [multiple]="false"
    [filter]="true"
    [showClear]="true"
    [(ngModel)]="selectedLargeItems">
  </i-listbox>
</div>`,

    reactive: `<form [formGroup]="departmentsForm">
  <i-listbox
    title="Departments"
    [options]="departmentOptions$ | async"
    optionLabel="name"
    formControlName="selectedDepartments"
    [multiple]="true"
    [filter]="true"
    [showClear]="true"
    [maxSelectedLabels]="2"
    selectedItemsLabel="{0} departments selected">
  </i-listbox>
</form>`,
  };

  // TypeScript examples
  tsExamples = {
    multiple: `import { IListbox, ListboxOption } from 'invensys-ng';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  imports: [IListbox, FormsModule],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  countries = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'UK' }
  ];

  selectedCountriesMultiple: ListboxOption[] = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' }
  ];

  onAddCountry() {
    console.log('Add country action clicked');
  }
}`,

    single: `selectedCountrySingle: ListboxOption | null = {
  name: 'United Kingdom',
  code: 'UK'
};`,

    withIcons: `tasks = [
  { name: 'Review Documents', value: 'review', icon: 'pi pi-file' },
  { name: 'Send Emails', value: 'email', icon: 'pi pi-envelope' },
  { name: 'Schedule Meeting', value: 'meeting', icon: 'pi pi-calendar' }
];`,

    displayAsMenu: `menuItems = [
  { name: 'Dashboard', value: 'dashboard', icon: 'pi pi-home' },
  { name: 'Settings', value: 'settings', icon: 'pi pi-cog' },
  { name: 'Profile', value: 'profile', icon: 'pi pi-user' }
];

selectedMenuItem: ListboxOption | null = {
  name: 'Dashboard',
  value: 'dashboard',
  icon: 'pi pi-home'
};`,

    reactive: `import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { IListbox, ListboxOption } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IListbox, ReactiveFormsModule, AsyncPipe],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  departmentOptions$: Observable<ListboxOption[]>;
  private departmentSubject = new BehaviorSubject<ListboxOption[]>([]);

  departmentsForm = this.fb.group({
    selectedDepartments: [[
      { id: 1, name: 'Engineering', code: 'ENG' },
      { id: 2, name: 'Marketing', code: 'MKT' }
    ], [Validators.required]]
  });

  constructor(private fb: FormBuilder) {
    this.departmentOptions$ = this.departmentSubject.asObservable();
  }
}`,
  };

  // SCSS examples
  scssExamples = {
    constrained: `.constrained-wrapper {
  height: 500px;
  border: 2px dashed var(--surface-400);
  border-radius: 8px;
  padding: 8px;
}`,
  };
}
