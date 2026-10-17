import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITable, GridData } from './table.component';

describe('ITable detail row borders', () => {
  it('can hide detail separators while retaining parent separators and header borders', () => {
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
    fixture.nativeElement.style.setProperty(
      '--surface-border',
      'rgb(123, 124, 125)',
    );
    fixture.detectChanges();
    fixture.componentInstance.toggleRowExpansion(row, new MouseEvent('click'));
    fixture.detectChanges();
    const nested = fixture.debugElement.query(By.directive(ITable));
    const detailSelector =
      ':scope > .i-table-wrapper > .i-table-container > table > tbody > tr';
    let detailRow = nested.nativeElement.querySelector(detailSelector);
    expect(getComputedStyle(detailRow).borderBottomStyle).toBe('solid');

    fixture.componentRef.setInput('detailRowBorders', false);
    fixture.detectChanges();
    detailRow = nested.nativeElement.querySelector(detailSelector);
    expect(nested.componentInstance.rowBorders).toBe(false);
    expect(getComputedStyle(detailRow).borderBottomStyle).toBe('none');
    expect(
      getComputedStyle(detailRow.querySelector('td')).borderBottomStyle,
    ).toBe('none');
    expect(
      getComputedStyle(nested.nativeElement.querySelector('th'))
        .borderBottomStyle,
    ).toBe('solid');
    const parentRow = fixture.nativeElement.querySelector('tbody > tr');
    expect(getComputedStyle(parentRow).borderBottomStyle).toBe('solid');

    fixture.componentRef.setInput('detailRowBorders', true);
    fixture.detectChanges();
    detailRow = nested.nativeElement.querySelector(detailSelector);
    expect(getComputedStyle(detailRow).borderBottomStyle).toBe('solid');
  });
});
