import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { IInputText } from '../input-text/input-text.component';
import { IButton } from '../button/button.component';

/**
 * Supported calendar view types
 */
export type CalendarView = 'date' | 'month' | 'year';

/**
 * Calendar Component
 *
 * A customizable date picker component that replaces PrimeNG's p-calendar.
 * Supports date, month, and year selection with flexible formatting.
 * Fully compatible with Angular Reactive Forms and Template-driven Forms.
 *
 * @example
 * ```html
 * <!-- Basic date picker -->
 * <i-calendar [(ngModel)]="selectedDate"></i-calendar>
 *
 * <!-- Month picker -->
 * <i-calendar
 *   [(ngModel)]="selectedMonth"
 *   [view]="'month'"
 *   [dateFormat]="'mm-yy'"
 *   placeholder="Select Month">
 * </i-calendar>
 *
 * <!-- Year picker -->
 * <i-calendar
 *   [(ngModel)]="selectedYear"
 *   [view]="'year'"
 *   [dateFormat]="'yy'"
 *   placeholder="Select Year">
 * </i-calendar>
 *
 * <!-- With event handling -->
 * <i-calendar
 *   [(ngModel)]="date"
 *   (onSelect)="handleDateSelection($event)">
 * </i-calendar>
 *
 * <!-- Readonly input -->
 * <i-calendar
 *   [(ngModel)]="date"
 *   [readonlyInput]="true">
 * </i-calendar>
 * ```
 */
@Component({
  selector: 'i-calendar',
  standalone: true,
  imports: [FormsModule, IInputText, IButton],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ICalendar),
      multi: true,
    },
  ],
})
export class ICalendar implements ControlValueAccessor, AfterViewInit {
  /**
   * Placeholder text for the input
   * @default 'Select Date'
   */
  @Input() placeholder = 'Select Date';

  /**
   * Whether the input field is readonly
   * @default false
   */
  @Input() readonlyInput = false;

  /**
   * Calendar view mode
   * @default 'date'
   */
  @Input() view: CalendarView = 'date';

  /**
   * Date format string
   * Supported tokens:
   * - dd: day (01-31)
   * - mm: month (01-12)
   * - yy: 4-digit year
   * - MMM: short month name
   * - MMMM: full month name
   * @default 'dd/mm/yy'
   */
  @Input() dateFormat = 'dd/mm/yy';

  /**
   * Label for the input field
   * @default 'Date'
   */
  @Input() label = 'Date';

  /**
   * Whether the calendar is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Whether to use floating label
   * @default true
   */
  @Input() useFloatLabel = true;

  /**
   * Icon to display in the input
   * @default 'pi pi-calendar'
   */
  @Input() icon = 'pi pi-calendar';

  /**
   * Event emitted when a date is selected
   */
  @Output() onSelect = new EventEmitter<Date>();

  /**
   * Selected date value (the actual form control value)
   * @internal
   */
  value: Date | null = null;

  /**
   * Formatted date string for display in i-input-text (internal ngModel)
   * @internal
   */
  inputDisplayValue = '';

  /**
   * Whether the calendar panel is visible
   * @internal
   */
  isOpen = false;

  /**
   * Current view date (for navigation)
   * @internal
   */
  viewDate = new Date();

  /**
   * Currently displayed view mode
   * @internal
   */
  currentView: CalendarView = 'date';

  /**
   * Calendar days grid
   * @internal
   */
  calendarDays: (Date | null)[][] = [];

  /**
   * Months array for month view
   * @internal
   */
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  /**
   * Short month names
   * @internal
   */
  monthsShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  /**
   * Weekday names
   * @internal
   */
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /**
   * Years array for year view
   * @internal
   */
  years: number[] = [];

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-calendar-');

  /**
   * Reference to the calendar panel element
   * @internal
   */
  @ViewChild('calendarPanel', { read: ElementRef }) calendarPanel?: ElementRef;

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onChange: (v: Date | null) => void = () => {};

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.currentView = this.view;
  }

  /**
   * Writes a value to the component (ControlValueAccessor)
   * @internal
   */
  writeValue(date: Date | null): void {
    this.value = date;
    if (date) {
      this.viewDate = new Date(date);
      this.inputDisplayValue = this.formatDate(date);
    } else {
      this.inputDisplayValue = '';
    }
  }

  /**
   * Registers the onChange callback (ControlValueAccessor)
   * @internal
   */
  registerOnChange(fn: (v: Date | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers the onTouched callback (ControlValueAccessor)
   * @internal
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state (ControlValueAccessor)
   * @internal
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Toggles the calendar panel
   * @internal
   */
  toggleCalendar(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.currentView = this.view;
      if (this.value) {
        this.viewDate = new Date(this.value);
      }
      this.updateCalendar();
    }
  }

  /**
   * Updates the calendar view based on current view mode
   * @internal
   */
  updateCalendar(): void {
    if (this.currentView === 'date') {
      this.generateCalendarDays();
    } else if (this.currentView === 'year') {
      this.generateYears();
    }
  }

  /**
   * Generates the calendar days grid
   * @internal
   */
  generateCalendarDays(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const firstDayOfWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();

    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = [];

    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      week.push(new Date(year, month - 1, prevLastDate - i));
    }

    // Current month days
    for (let day = 1; day <= lastDate; day++) {
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      week.push(new Date(year, month, day));
    }

    // Next month days
    const remainingDays = 7 - week.length;
    for (let day = 1; day <= remainingDays; day++) {
      week.push(new Date(year, month + 1, day));
    }

    if (week.length > 0) {
      weeks.push(week);
    }

    this.calendarDays = weeks;
  }

  /**
   * Generates the years array for year view
   * @internal
   */
  generateYears(): void {
    const currentYear = this.viewDate.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    this.years = Array.from({ length: 12 }, (_, i) => startYear + i);
  }

  /**
   * Selects a date
   * @internal
   */
  selectDate(date: Date): void {
    if (!this.isDateInCurrentMonth(date)) {
      return;
    }

    if (this.view === 'date') {
      this.value = date;
      this.inputDisplayValue = this.formatDate(date);
      this.onChange(date);
      this.onTouched();
      this.onSelect.emit(date);
      this.isOpen = false;
    }
  }

  /**
   * Selects a month
   * @internal
   */
  selectMonth(monthIndex: number): void {
    if (this.view === 'month') {
      const date = new Date(this.viewDate.getFullYear(), monthIndex, 1);
      this.value = date;
      this.inputDisplayValue = this.formatDate(date);
      this.onChange(date);
      this.onTouched();
      this.onSelect.emit(date);
      this.isOpen = false;
    } else {
      // Navigate to month in date view
      this.viewDate = new Date(this.viewDate.getFullYear(), monthIndex, 1);
      this.currentView = 'date';
      this.updateCalendar();
    }
  }

  /**
   * Selects a year
   * @internal
   */
  selectYear(year: number): void {
    if (this.view === 'year') {
      const date = new Date(year, 0, 1);
      this.value = date;
      this.inputDisplayValue = this.formatDate(date);
      this.onChange(date);
      this.onTouched();
      this.onSelect.emit(date);
      this.isOpen = false;
    } else {
      // Navigate to year in month or date view
      this.viewDate = new Date(year, this.viewDate.getMonth(), 1);
      this.currentView = this.view === 'month' ? 'month' : 'date';
      this.updateCalendar();
    }
  }

  /**
   * Navigates to previous period
   * @internal
   */
  navigatePrevious(): void {
    if (this.currentView === 'date') {
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth() - 1,
        1
      );
    } else if (this.currentView === 'month') {
      this.viewDate = new Date(
        this.viewDate.getFullYear() - 1,
        this.viewDate.getMonth(),
        1
      );
    } else if (this.currentView === 'year') {
      const startYear = Math.floor(this.viewDate.getFullYear() / 10) * 10;
      this.viewDate = new Date(startYear - 10, 0, 1);
    }
    this.updateCalendar();
  }

  /**
   * Navigates to next period
   * @internal
   */
  navigateNext(): void {
    if (this.currentView === 'date') {
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth() + 1,
        1
      );
    } else if (this.currentView === 'month') {
      this.viewDate = new Date(
        this.viewDate.getFullYear() + 1,
        this.viewDate.getMonth(),
        1
      );
    } else if (this.currentView === 'year') {
      const startYear = Math.floor(this.viewDate.getFullYear() / 10) * 10;
      this.viewDate = new Date(startYear + 10, 0, 1);
    }
    this.updateCalendar();
  }

  /**
   * Shows month view
   * @internal
   */
  showMonthView(): void {
    this.currentView = 'month';
    this.updateCalendar();
  }

  /**
   * Shows year view
   * @internal
   */
  showYearView(): void {
    this.currentView = 'year';
    this.updateCalendar();
  }

  /**
   * Gets the header title based on current view
   * @internal
   */
  getHeaderTitle(): string {
    if (this.currentView === 'date') {
      return `${
        this.months[this.viewDate.getMonth()]
      } ${this.viewDate.getFullYear()}`;
    } else if (this.currentView === 'month') {
      return this.viewDate.getFullYear().toString();
    } else {
      const startYear = Math.floor(this.viewDate.getFullYear() / 10) * 10;
      return `${startYear} - ${startYear + 9}`;
    }
  }

  /**
   * Checks if a date is the selected date
   * @internal
   */
  isSelectedDate(date: Date): boolean {
    if (!this.value) return false;

    if (this.view === 'date') {
      return (
        date.getDate() === this.value.getDate() &&
        date.getMonth() === this.value.getMonth() &&
        date.getFullYear() === this.value.getFullYear()
      );
    }
    return false;
  }

  /**
   * Checks if a month is the selected month
   * @internal
   */
  isSelectedMonth(monthIndex: number): boolean {
    if (!this.value) return false;
    return (
      monthIndex === this.value.getMonth() &&
      this.viewDate.getFullYear() === this.value.getFullYear()
    );
  }

  /**
   * Checks if a year is the selected year
   * @internal
   */
  isSelectedYear(year: number): boolean {
    if (!this.value) return false;
    return year === this.value.getFullYear();
  }

  /**
   * Checks if a date is today
   * @internal
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Checks if a date is in the current view month
   * @internal
   */
  isDateInCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.viewDate.getMonth();
  }

  /**
   * Formats a date according to the dateFormat input
   * @internal
   */
  formatDate(date: Date): string {
    if (!date) return '';

    let formatted = this.dateFormat;

    // Day
    formatted = formatted.replace(
      'dd',
      date.getDate().toString().padStart(2, '0')
    );

    // Month
    formatted = formatted.replace('MMMM', this.months[date.getMonth()]);
    formatted = formatted.replace('MMM', this.monthsShort[date.getMonth()]);
    formatted = formatted.replace(
      'mm',
      (date.getMonth() + 1).toString().padStart(2, '0')
    );

    // Year
    formatted = formatted.replace('yy', date.getFullYear().toString());

    return formatted;
  }

  /**
   * Closes the calendar when clicking outside
   * @internal
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
