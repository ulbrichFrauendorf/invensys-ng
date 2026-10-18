import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITable, GridData } from './table.component';

describe('ITable detail row borders', () => {
  it.each(['small', 'medium', 'large'] as const)('condenses borderless details while preserving parent rows and headers (%s)', (size) => {
    const fixture = TestBed.createComponent(ITable);
    const row = { name: 'Parent' };
    const grid: GridData = {
      columns: [{ field: 'name', header: 'Name' }],
      rows: [row],
      details: {
        columns: [{ field: 'name', header: 'Detail' }],
        rows: () => [{ name: 'First' }, { name: 'Second' }],
      },
    };
    fixture.componentRef.setInput('grid', grid);
    fixture.componentRef.setInput('bordered', true);
    fixture.componentRef.setInput('size', size);
    fixture.nativeElement.style.setProperty(
      '--surface-border',
      'rgb(123, 124, 125)',
    );
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.componentInstance.toggleRowExpansion(row, new MouseEvent('click'));
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const nested = fixture.debugElement.query(By.directive(ITable));
    const detailSelector =
      ':scope > .i-table-wrapper > .i-table-container > table > tbody > tr';
    let detailRow = nested.nativeElement.querySelector(detailSelector);
    expect(getComputedStyle(detailRow).borderBottomStyle).toBe('solid');
    const originalDetailHeight = detailRow.getBoundingClientRect().height;
    const originalPadding = getComputedStyle(detailRow.querySelector('td')).paddingTop;
    const parentRow = fixture.nativeElement.querySelector('tbody > tr');
    const parentHeight = parentRow.getBoundingClientRect().height;
    const header = nested.nativeElement.querySelector('th');
    const headerHeight = header.getBoundingClientRect().height;

    fixture.componentRef.setInput('detailRowBorders', false);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    detailRow = nested.nativeElement.querySelector(detailSelector);
    expect(nested.componentInstance.rowBorders).toBe(false);
    expect(getComputedStyle(detailRow.querySelector('td')).paddingTop).toBe('4px');
    expect(getComputedStyle(detailRow.querySelector('td')).paddingBottom).toBe('4px');
    expect(detailRow.getBoundingClientRect().height).toBeLessThan(originalDetailHeight);
    expect(parentRow.getBoundingClientRect().height).toBe(parentHeight);
    expect(header.getBoundingClientRect().height).toBe(headerHeight);
    expect(getComputedStyle(detailRow).borderBottomStyle).toBe('none');
    expect(
      getComputedStyle(detailRow.querySelector('td')).borderBottomStyle,
    ).toBe('none');
    expect(
      getComputedStyle(nested.nativeElement.querySelector('th'))
        .borderBottomStyle,
    ).toBe('solid');
    expect(getComputedStyle(parentRow).borderBottomStyle).toBe('solid');

    fixture.componentRef.setInput('detailRowBorders', true);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    detailRow = nested.nativeElement.querySelector(detailSelector);
    expect(getComputedStyle(detailRow).borderBottomStyle).toBe('solid');
    expect(getComputedStyle(detailRow.querySelector('td')).paddingTop).toBe(originalPadding);
    expect(detailRow.getBoundingClientRect().height).toBe(originalDetailHeight);
  });
});
