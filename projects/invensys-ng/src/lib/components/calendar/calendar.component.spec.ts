import { firstValueFrom } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ICalendar } from './calendar.component';

describe('ICalendar', () => {
  let component: ICalendar;
  let fixture: ComponentFixture<ICalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ICalendar, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ICalendar);
    component = fixture.componentInstance;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date correctly with default format', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024
    fixture.componentRef.setInput('dateFormat', 'dd/mm/yy');
    const formatted = component.formatDate(date);
    expect(formatted).toBe('15/01/2024');
  });

  it('should format date with month-year format', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024
    fixture.componentRef.setInput('dateFormat', 'mm-yy');
    const formatted = component.formatDate(date);
    expect(formatted).toBe('01-2024');
  });

  it('should format date with short month name', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024
    fixture.componentRef.setInput('dateFormat', 'dd MMM yy');
    const formatted = component.formatDate(date);
    expect(formatted).toBe('15 Jan 2024');
  });

  it('should write value correctly', () => {
    const date = new Date(2024, 0, 15);
    component.writeValue(date);
    expect(component.value).toEqual(date);
    expect(component.inputDisplayValue).toBeTruthy();
  });

  it('should handle null value', () => {
    component.writeValue(null);
    expect(component.value).toBeNull();
    expect(component.inputDisplayValue).toBe('');
  });

  it('should toggle calendar panel', () => {
    expect(component.isOpen).toBe(false);
    component.toggleCalendar();
    expect(component.isOpen).toBe(true);
    component.toggleCalendar();
    expect(component.isOpen).toBe(false);
  });

  it('should not toggle calendar when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    component.isOpen = false;
    component.toggleCalendar();
    expect(component.isOpen).toBe(false);
  });

  it('should detect today correctly', () => {
    const today = new Date();
    expect(component.isToday(today)).toBe(true);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(component.isToday(yesterday)).toBe(false);
  });

  it('should detect selected date correctly', () => {
    const date = new Date(2024, 0, 15);
    component.value = date;
    fixture.componentRef.setInput('view', 'date');
    expect(component.isSelectedDate(date)).toBe(true);

    const otherDate = new Date(2024, 0, 16);
    expect(component.isSelectedDate(otherDate)).toBe(false);
  });

  it('should generate calendar days correctly', () => {
    component.viewDate = new Date(2024, 0, 15); // January 2024
    component.generateCalendarDays();
    expect(component.calendarDays.length).toBeGreaterThan(0);
    expect(component.calendarDays[0].length).toBe(7); // 7 days per week
  });

  it('should navigate to previous month', () => {
    component.viewDate = new Date(2024, 1, 15); // February 2024
    component.currentView = 'date';
    component.navigatePrevious();
    expect(component.viewDate.getMonth()).toBe(0); // January
  });

  it('should navigate to next month', () => {
    component.viewDate = new Date(2024, 0, 15); // January 2024
    component.currentView = 'date';
    component.navigateNext();
    expect(component.viewDate.getMonth()).toBe(1); // February
  });

  it('should emit onSelect when date is selected', async () => {
    const date = new Date(2024, 0, 15);
    fixture.componentRef.setInput('view', 'date');
    component.viewDate = new Date(2024, 0, 1);

    const emittedValue = firstValueFrom(component.onSelect);

    component.selectDate(date);

    const selectedDate = await emittedValue;

    expect(selectedDate).toEqual(date);
  });

  it('should select month correctly', async () => {
    fixture.componentRef.setInput('view', 'month');
    component.viewDate = new Date(2024, 0, 1);

    const emittedValue = firstValueFrom(component.onSelect);

    component.selectMonth(5); // June

    const selectedDate = await emittedValue;

    expect(selectedDate.getMonth()).toBe(5); // June
  });

  it('should select year correctly', async () => {
    fixture.componentRef.setInput('view', 'year');

    const emittedValue = firstValueFrom(component.onSelect);

    component.selectYear(2025);

    const selectedDate = await emittedValue;

    expect(selectedDate.getFullYear()).toBe(2025);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);

    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });
});
