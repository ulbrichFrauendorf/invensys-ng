import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITable, GridData } from './table.component';
import { IProgressSpinner } from '../progress-spinner/progress-spinner.component';

@Component({
  imports: [ITable],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<i-table [grid]="grid" dataKey="id" />',
})
class Host {
  step = { status: 'InProgress' };
  handler = vi.fn().mockName('action');
  grid: GridData = {
    columns: [{ field: 'id', header: 'Run' }],
    rows: [{ id: 'run' }],
    actions: [{ id: 'parent', handler: () => {} }],
    details: {
      columns: [{ field: 'status', header: 'Status' }],
      rows: () => [this.step],
      actionsHeader: '',
      actions: [
        {
          id: 'progress',
          tooltip: 'Report in progress',
          loading: (row) => row.status === 'InProgress',
          handler: this.handler,
        },
      ],
    },
  };
}

describe('ITable action progress', () => {
  it('renders the shared spinner in detail actions, leaves that heading blank, and stops after completion', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('.i-table-expand-cell button'))
      .nativeElement.click();
    fixture.detectChanges();
    const tables = fixture.debugElement.queryAll(By.directive(ITable));
    const child = tables[1];
    expect(
      fixture.debugElement
        .query(By.css('.i-table-actions-header'))
        .nativeElement.textContent.trim(),
    ).toBe('Actions');
    expect(
      child
        .query(By.css('.i-table-actions-header'))
        .nativeElement.textContent.trim(),
    ).toBe('');
    expect(child.query(By.directive(IProgressSpinner))).not.toBeNull();
    const table = child.componentInstance as ITable;
    const action = fixture.componentInstance.grid.details!.actions![0];
    table.triggerAction(
      action,
      fixture.componentInstance.step,
      new Event('click'),
    );
    expect(fixture.componentInstance.handler).not.toHaveBeenCalled();
    fixture.componentInstance.step = { status: 'Completed' };
    fixture.componentInstance.grid = { ...fixture.componentInstance.grid };
    fixture.detectChanges();
    expect(child.query(By.directive(IProgressSpinner))).toBeNull();
  });
});
