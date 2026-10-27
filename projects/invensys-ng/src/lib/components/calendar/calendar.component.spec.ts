import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { userEvent } from 'vitest/browser';
import { IDialog } from '../dialog/dialog.component';
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

@Component({
  imports: [IDialog, ICalendar, FormsModule],
  template: `<i-dialog
    [(visible)]="visible"
    header="Report run"
    width="600px"
    [contentStyle]="{ overflow: 'auto' }"
  >
    <i-calendar [(ngModel)]="date" view="month" dateFormat="mm-yy" />
  </i-dialog>`,
})
class CalendarDialogHost {
  visible = true;
  date: Date | null = null;
}

describe('ICalendar overlay', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [ICalendar, CalendarDialogHost] }));

  async function settle(fixture: ComponentFixture<unknown>) {
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector<HTMLElement>('.i-calendar-panel');
    await Promise.all(panel?.getAnimations().map((animation) => animation.finished) ?? []);
    return panel;
  }

  async function open(fixture: ComponentFixture<unknown>, root: Element = fixture.nativeElement) {
    root.querySelector<HTMLElement>('.i-calendar-input-wrapper')!.click();
    return (await settle(fixture))!;
  }

  it('escapes transformed, scrolling ancestors without increasing their scroll area', async () => {
    const fixture = TestBed.createComponent(ICalendar);
    fixture.componentRef.setInput('view', 'month');
    const host = fixture.nativeElement as HTMLElement;
    host.style.cssText =
      'display:block;position:fixed;left:20px;top:40px;width:160px;height:70px;overflow:auto;transform:translateZ(0)';
    await settle(fixture);
    const height = host.scrollHeight;
    const panel = await open(fixture);
    expect(host.contains(panel)).toBe(false);
    expect(panel.closest('.cdk-overlay-container')?.parentElement).toBe(document.body);
    expect(host.scrollHeight).toBe(height);
    const lastMonth = Array.from(panel.querySelectorAll<HTMLButtonElement>('button')).at(-1)!;
    const rect = lastMonth.getBoundingClientRect();
    expect(rect.bottom).toBeGreaterThan(host.getBoundingClientRect().bottom);
    expect(
      panel.contains(
        document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2),
      ),
    ).toBe(true);
  });

  it('stays inside the viewport when the trigger is near its bottom-right edge', async () => {
    const fixture = TestBed.createComponent(ICalendar);
    fixture.nativeElement.style.cssText =
      'display:block;position:fixed;right:12px;bottom:12px;width:180px';
    const panel = await open(fixture);
    const rect = panel.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(11);
    expect(rect.right).toBeLessThanOrEqual(innerWidth - 11);
    expect(rect.top).toBeGreaterThanOrEqual(11);
    expect(rect.bottom).toBeLessThanOrEqual(innerHeight - 11);
    expect(rect.bottom).toBeLessThanOrEqual(
      fixture.nativeElement.querySelector('.i-calendar-input-wrapper').getBoundingClientRect().top,
    );
  });

  it('selects a month in a scrolling dialog without growing or scrolling the dialog body', async () => {
    const fixture = TestBed.createComponent(CalendarDialogHost);
    await settle(fixture);
    const dialog = document.querySelector('.i-dialog-overlay')!;
    const body = dialog.querySelector<HTMLElement>('.i-card-body')!;
    const height = body.scrollHeight;
    const panel = await open(fixture, dialog);
    expect(dialog.contains(panel)).toBe(false);
    expect(body.scrollHeight).toBe(height);
    expect(body.scrollTop).toBe(0);
    const month = Array.from(panel.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent?.trim() === 'Jun',
    )!;
    const rect = month.getBoundingClientRect();
    expect(
      panel.contains(
        document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2),
      ),
    ).toBe(true);
    month.click();
    await settle(fixture);
    expect(fixture.componentInstance.date?.getMonth()).toBe(5);
    expect(fixture.componentInstance.visible).toBe(true);
    expect(document.querySelector('.i-calendar-panel')).toBeNull();
  });

  it('closes only the calendar on Escape and restores focus to its input', async () => {
    const fixture = TestBed.createComponent(CalendarDialogHost);
    await settle(fixture);
    const dialog = document.querySelector('.i-dialog-overlay')!;
    const panel = await open(fixture, dialog);
    panel.querySelector<HTMLButtonElement>('button')!.focus();
    await userEvent.keyboard('{Escape}');
    await settle(fixture);
    expect(document.querySelector('.i-calendar-panel')).toBeNull();
    expect(fixture.componentInstance.visible).toBe(true);
    expect(document.activeElement).toBe(dialog.querySelector('input'));
  });

  it('keeps navigation open and dismisses on an outside click', async () => {
    const fixture = TestBed.createComponent(ICalendar);
    const panel = await open(fixture);
    panel.querySelector<HTMLButtonElement>('button')!.click();
    await settle(fixture);
    expect(fixture.componentInstance.isOpen).toBe(true);
    document.body.click();
    await settle(fixture);
    expect(document.querySelector('.i-calendar-panel')).toBeNull();
    expect(fixture.componentInstance.isOpen).toBe(false);
  });

  it('removes the open overlay when disabled or destroyed and can reopen', async () => {
    const fixture = TestBed.createComponent(ICalendar);
    await open(fixture);
    fixture.componentRef.setInput('disabled', true);
    await settle(fixture);
    expect(document.querySelector('.i-calendar-panel')).toBeNull();
    expect(fixture.componentInstance.isOpen).toBe(false);
    fixture.componentRef.setInput('disabled', false);
    await settle(fixture);
    await open(fixture);
    expect(document.querySelectorAll('.i-calendar-panel').length).toBe(1);
    fixture.destroy();
    expect(document.querySelector('.i-calendar-panel')).toBeNull();
  });

  it('removes the popup when its containing dialog closes', async () => {
    const fixture = TestBed.createComponent(CalendarDialogHost);
    await settle(fixture);
    const dialog = document.querySelector('.i-dialog-overlay')!;
    await open(fixture, dialog);
    fixture.debugElement.query(By.directive(IDialog)).componentInstance.hide();
    await settle(fixture);
    expect(document.querySelector('.i-calendar-panel')).toBeNull();
    expect(document.querySelector('.i-dialog-overlay')).toBeNull();
  });
});
