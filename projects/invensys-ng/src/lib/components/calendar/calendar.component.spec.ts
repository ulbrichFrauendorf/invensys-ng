import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ICalendar } from './calendar.component';

describe('ICalendar', () => {
  let component: ICalendar;
  let fixture: ComponentFixture<ICalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ICalendar, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ICalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date correctly with default format', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024
    component.dateFormat = 'dd/mm/yy';
    const formatted = component.formatDate(date);
    expect(formatted).toBe('15/01/2024');
  });

  it('should format date with month-year format', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024
    component.dateFormat = 'mm-yy';
    const formatted = component.formatDate(date);
    expect(formatted).toBe('01-2024');
  });

  it('should format date with short month name', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024
    component.dateFormat = 'dd MMM yy';
    const formatted = component.formatDate(date);
    expect(formatted).toBe('15 Jan 2024');
  });

  it('should write value correctly', () => {
    const date = new Date(2024, 0, 15);
    component.writeValue(date);
    expect(component.value).toEqual(date);
    expect(component.displayValue).toBeTruthy();
  });

  it('should handle null value', () => {
    component.writeValue(null);
    expect(component.value).toBeNull();
    expect(component.displayValue).toBe('');
  });

  it('should toggle calendar panel', () => {
    expect(component.isOpen).toBeFalse();
    component.toggleCalendar();
    expect(component.isOpen).toBeTrue();
    component.toggleCalendar();
    expect(component.isOpen).toBeFalse();
  });

  it('should not toggle calendar when disabled', () => {
    component.disabled = true;
    component.isOpen = false;
    component.toggleCalendar();
    expect(component.isOpen).toBeFalse();
  });

  it('should detect today correctly', () => {
    const today = new Date();
    expect(component.isToday(today)).toBeTrue();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(component.isToday(yesterday)).toBeFalse();
  });

  it('should detect selected date correctly', () => {
    const date = new Date(2024, 0, 15);
    component.value = date;
    component.view = 'date';
    expect(component.isSelectedDate(date)).toBeTrue();

    const otherDate = new Date(2024, 0, 16);
    expect(component.isSelectedDate(otherDate)).toBeFalse();
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

  it('should emit onSelect when date is selected', (done) => {
    const date = new Date(2024, 0, 15);
    component.view = 'date';
    component.viewDate = new Date(2024, 0, 1);

    component.onSelect.subscribe((selectedDate: Date) => {
      expect(selectedDate).toEqual(date);
      done();
    });

    component.selectDate(date);
  });

  it('should select month correctly', (done) => {
    component.view = 'month';
    component.viewDate = new Date(2024, 0, 1);

    component.onSelect.subscribe((selectedDate: Date) => {
      expect(selectedDate.getMonth()).toBe(5); // June
      done();
    });

    component.selectMonth(5); // June
  });

  it('should select year correctly', (done) => {
    component.view = 'year';

    component.onSelect.subscribe((selectedDate: Date) => {
      expect(selectedDate.getFullYear()).toBe(2025);
      done();
    });

    component.selectYear(2025);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();

    component.setDisabledState(false);
    expect(component.disabled).toBeFalse();
  });
});
