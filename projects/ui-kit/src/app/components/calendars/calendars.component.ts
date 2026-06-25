import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ICalendar } from '../../../../../invensys-ng/src/lib/components/calendar/calendar.component';
import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';


@Component({
  selector: 'app-calendars',
  imports: [
    ICalendar,
    IButton,
    ReactiveFormsModule,
    FormsModule,
    DemoCardComponent,
    FeaturesListComponent
],
  templateUrl: './calendars.component.html',
  styleUrl: './calendars.component.scss',
})
export class CalendarsComponent implements OnInit {
  // Forms
  basicForm: FormGroup;
  validationForm: FormGroup;
  monthPickerForm: FormGroup;
  yearPickerForm: FormGroup;
  dateRangeForm: FormGroup;

  // NgModel examples
  selectedDate: Date | null = null;
  selectedMonth: Date | null = null;
  selectedYear: Date | null = null;
  birthDate: Date | null = null;
  appointmentDate: Date | null = null;

  // Date range
  startDate: Date | null = null;
  endDate: Date | null = null;

  // HTML Code examples
  codeExamples = {
    ngModel: `<!-- Basic Date Picker -->
<i-calendar
  [(ngModel)]="selectedDate"
  [placeholder]="'Select Date'"
/>

<!-- Month Picker -->
<i-calendar
  [(ngModel)]="selectedMonth"
  [view]="'month'"
  [dateFormat]="'MMM yy'"
  [placeholder]="'Select Month'"
/>

<!-- Year Picker -->
<i-calendar
  [(ngModel)]="selectedYear"
  [view]="'year'"
  [dateFormat]="'yy'"
  [placeholder]="'Select Year'"
/>`,

    reactiveForm: `<form [formGroup]="basicForm">
  <i-calendar
    formControlName="date"
    [label]="'Select Date'"
    [placeholder]="'DD/MM/YYYY'"
  />

  <i-calendar
    formControlName="eventDate"
    [label]="'Event Date'"
    [dateFormat]="'dd MMMM yy'"
    [icon]="'pi pi-calendar-plus'"
  />
</form>`,

    monthPicker: `<!-- Report Month Picker -->
<i-calendar
  [(ngModel)]="reportMonth"
  [view]="'month'"
  [dateFormat]="'mm-yy'"
  [label]="'Report Month'"
  [readonlyInput]="true"
  [placeholder]="'MM-YYYY'"
  (onSelect)="onMonthSelected($event)"
/>

<!-- Month Picker with Full Month Name -->
<i-calendar
  [(ngModel)]="monthName"
  [view]="'month'"
  [dateFormat]="'MMMM yy'"
  [label]="'Select Month'"
  [readonlyInput]="true"
/>`,

    yearPicker: `<!-- Fiscal Year Picker -->
<i-calendar
  [(ngModel)]="fiscalYear"
  [view]="'year'"
  [dateFormat]="'yy'"
  [label]="'Fiscal Year'"
  [readonlyInput]="true"
  [placeholder]="'YYYY'"
/>`,

    dateRange: `<!-- Date Range Picker -->
<div class="date-range">
  <i-calendar
    [(ngModel)]="startDate"
    [label]="'Start Date'"
    [placeholder]="'Select start date'"
    (onSelect)="onStartDateChange($event)"
  />

  <i-calendar
    [(ngModel)]="endDate"
    [label]="'End Date'"
    [placeholder]="'Select end date'"
    (onSelect)="onEndDateChange($event)"
  />
</div>`,

    validation: `<form [formGroup]="validationForm">
  <i-calendar
    formControlName="birthDate"
    [label]="'Birth Date'"
    [placeholder]="'DD/MM/YYYY'"
  />

  <i-calendar
    formControlName="appointmentDate"
    [label]="'Appointment Date'"
    [placeholder]="'Select appointment date'"
  />
</form>`,

    customFormats: `<!-- Different Date Formats -->

<!-- DD/MM/YYYY Format -->
<i-calendar
  [(ngModel)]="date1"
  [dateFormat]="'dd/mm/yy'"
  [placeholder]="'DD/MM/YYYY'"
/>

<!-- MM-YYYY Format -->
<i-calendar
  [(ngModel)]="date2"
  [view]="'month'"
  [dateFormat]="'mm-yy'"
  [placeholder]="'MM-YYYY'"
/>

<!-- Full Month Name Format -->
<i-calendar
  [(ngModel)]="date3"
  [dateFormat]="'dd MMMM yy'"
  [placeholder]="'DD Month YYYY'"
/>

<!-- Short Month Name Format -->
<i-calendar
  [(ngModel)]="date4"
  [dateFormat]="'dd MMM yy'"
  [placeholder]="'DD Mon YYYY'"
/>`,

    events: `<!-- With Event Handling -->
<i-calendar
  [(ngModel)]="selectedDate"
  [label]="'Select Date'"
  (onSelect)="handleDateSelection($event)"
/>`,

    disabled: `<!-- Disabled Calendar -->
<i-calendar
  [(ngModel)]="date"
  [label]="'Disabled Date'"
  [disabled]="true"
/>

<!-- Readonly Input (Forces Calendar Picker) -->
<i-calendar
  [(ngModel)]="date"
  [label]="'Readonly Input'"
  [readonlyInput]="true"
/>`,

    floating: `<!-- Without Floating Label -->
<i-calendar
  [(ngModel)]="date"
  [useFloatLabel]="false"
  [label]="'Date'"
  [placeholder]="'Select date'"
/>

<!-- With Floating Label (Default) -->
<i-calendar
  [(ngModel)]="date"
  [useFloatLabel]="true"
  [label]="'Date'"
/>`,
  };

  // TypeScript examples
  tsExamples = {
    ngModel: `import { FormsModule } from '@angular/forms';
import { ICalendar } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [FormsModule, ICalendar],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  selectedDate: Date | null = null;
  selectedMonth: Date | null = null;
  selectedYear: Date | null = null;
}`,

    reactiveForm: `import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICalendar } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, ICalendar],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  basicForm = this.fb.group({
    date: [null],
    eventDate: [null]
  });

  constructor(private fb: FormBuilder) {}
}`,

    monthPicker: `reportMonth: Date | null = null;

onMonthSelected(date: Date): void {
  console.log('Selected month:', date);
  // Fetch report data for the selected month
  this.loadReportData(date);
}`,

    yearPicker: `fiscalYear: Date | null = null;

onYearSelected(date: Date): void {
  const year = date.getFullYear();
  console.log('Selected fiscal year:', year);
  // Load fiscal year data
  this.loadFiscalYearData(year);
}`,

    dateRange: `startDate: Date | null = null;
endDate: Date | null = null;

onStartDateChange(date: Date): void {
  this.startDate = date;
  // Optionally set minimum end date
  console.log('Date range start:', date);
}

onEndDateChange(date: Date): void {
  this.endDate = date;
  if (this.startDate && this.endDate) {
    console.log('Date range:', this.startDate, 'to', this.endDate);
    this.fetchDataForDateRange(this.startDate, this.endDate);
  }
}`,

    validation: `validationForm = this.fb.group({
  birthDate: [null, [Validators.required]],
  appointmentDate: [null, [Validators.required]]
});`,

    events: `handleDateSelection(date: Date): void {
  console.log('Date selected:', date);

  // Format the date
  const formatted = date.toLocaleDateString();

  // Perform actions with the selected date
  this.checkAvailability(date);
}`,
  };

  // Features
  features: Feature[] = [
    {
      title: 'Multiple View Modes',
      description: 'Date, Month, and Year picker modes for different use cases',
    },
    {
      title: 'Customizable Date Formats',
      description: 'Support for various date format patterns (dd/mm/yy, MMM yy, etc.)',
    },
    {
      title: 'Angular Forms Integration',
      description: 'Full support for both template-driven and reactive forms',
    },
    {
      title: 'Event Handling',
      description: 'onSelect event emitter for custom date selection logic',
    },
    {
      title: 'Readonly Input',
      description: 'Force users to use calendar picker instead of manual input',
    },
    {
      title: 'Floating Labels',
      description: 'Optional animated floating labels for better UX',
    },
    {
      title: 'Custom Icons',
      description: 'Configurable calendar icon using PrimeIcons',
    },
    {
      title: 'Accessibility',
      description: 'Keyboard navigation and screen reader support',
    },
    {
      title: 'Disabled State',
      description: 'Proper disabled styling and interaction handling',
    },
    {
      title: 'Theme Integration',
      description: 'Consistent styling with design system',
    },
    {
      title: 'Click Outside to Close',
      description: 'Calendar panel closes when clicking outside',
    },
    {
      title: 'Today Highlighting',
      description: "Today's date is highlighted in the calendar",
    },
  ];

  constructor(private fb: FormBuilder) {
    // Basic form
    this.basicForm = this.fb.group({
      date: [null],
      eventDate: [null],
    });

    // Validation form
    this.validationForm = this.fb.group({
      birthDate: [null, [Validators.required]],
      appointmentDate: [null, [Validators.required]],
    });

    // Month picker form
    this.monthPickerForm = this.fb.group({
      reportMonth: [null],
      fiscalMonth: [null],
    });

    // Year picker form
    this.yearPickerForm = this.fb.group({
      fiscalYear: [null],
      graduationYear: [null],
    });

    // Date range form
    this.dateRangeForm = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    // Set some demo values
    this.selectedDate = new Date();
    this.selectedMonth = new Date();
    this.selectedYear = new Date();
  }

  // Event handlers
  handleDateSelection(date: Date): void {
    console.log('Date selected:', date);
  }

  onMonthSelected(date: Date): void {
    console.log('Month selected:', date);
  }

  onYearSelected(date: Date): void {
    console.log('Year selected:', date.getFullYear());
  }

  onStartDateChange(date: Date): void {
    this.startDate = date;
    console.log('Start date:', date);
  }

  onEndDateChange(date: Date): void {
    this.endDate = date;
    if (this.startDate && this.endDate) {
      console.log('Date range:', this.startDate, 'to', this.endDate);
    }
  }

  // Form submission handlers
  onSubmit(form: FormGroup, formName: string) {
    if (form.valid) {
      console.log(`${formName} form submitted:`, form.value);
    } else {
      this.markFormGroupTouched(form);
      console.log(`${formName} form is invalid`);
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

  // Helper to format date
  formatDate(date: Date | null): string {
    if (!date) return 'No date selected';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Helper to format month
  formatMonth(date: Date | null): string {
    if (!date) return 'No month selected';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }

  // Helper to format year
  formatYear(date: Date | null): string {
    if (!date) return 'No year selected';
    return date.getFullYear().toString();
  }
}
