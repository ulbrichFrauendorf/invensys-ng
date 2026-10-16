import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IButton } from '@shared/components/button/button.component';
import { IInputText } from '@shared/components/input-text/input-text.component';
import { IFieldPicker, FieldPickerOption } from '@shared/components/field-picker/field-picker.component';
import { IOrderedList } from '@shared/components/ordered-list/ordered-list.component';
import { IRuleEditor, EditorRule, RuleEditorField, RuleEditorOperator } from '@shared/components/rule-editor/rule-editor.component';
import { IStepper } from '@shared/components/stepper/stepper.component';
import { IStep } from '@shared/components/stepper/step.component';
import { ITable, GridData } from '@shared/components/table/table.component';
import { IDialogActions } from '@shared/components/dialog/inner/dialog-actions/dialog-actions.component';
interface AutomationExample { id: string; name: string; status: string; steps: number; }
interface StepExample { order: number; name: string; }

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-reporting-workflows',
  imports: [DemoPlaygroundComponent, DemoOptionDirective, FormsModule, IButton, IInputText, IFieldPicker, IOrderedList,
    IRuleEditor, IStepper, IStep, ITable, IDialogActions],
  templateUrl: './reporting-workflows.component.html',
  styleUrl: './reporting-workflows.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingWorkflowsComponent {
  activeIndex = 0;
  name = 'Monthly payroll summary';
  selected = ['employee', 'department', 'gross'];
  rules: EditorRule[] = [];
  private savedSignature: string | null = null;
  narrow = false;
  actionState: 'ready' | 'loading' | 'disabled' = 'ready';
  readonly fields: FieldPickerOption[] = [
    { key: 'employee', label: 'Employee name', group: 'Employee' },
    { key: 'department', label: 'Department', group: 'Employee' },
    { key: 'number', label: 'Employee number', group: 'Employee' },
    { key: 'gross', label: 'Gross pay', group: 'Payroll' },
    { key: 'net', label: 'Net pay', group: 'Payroll' },
    { key: 'tax', label: 'Tax', group: 'Payroll' },
  ];
  readonly ruleFields: RuleEditorField[] = [
    { key: 'department', label: 'Department', type: 'text' },
    { key: 'gross', label: 'Gross pay', type: 'number' },
  ];
  readonly operators: RuleEditorOperator[] = [
    { key: 'eq', label: 'Equals' },
    { key: 'gt', label: 'Greater than', fieldTypes: ['number'] },
  ];
  readonly label = (key: string): string => this.fields.find(f => f.key === key)?.label ?? key;
  readonly automations: GridData<AutomationExample, StepExample> = {
    columns: [
      { field: 'name', header: 'Automation' },
      { field: 'status', header: 'Status' },
    ],
    rows: [
      { id: 'monthly', name: 'Month-end payroll pack', steps: 2, status: 'Active' },
      { id: 'audit', name: 'Quarterly audit', steps: 1, status: 'Inactive' },
    ],
    details: {
      columns: [{ field: 'order', header: 'Order', type: 'number' }, { field: 'name', header: 'Report step' }],
      rows: row => row.id === 'monthly'
        ? [{ order: 1, name: 'Payroll summary' }, { order: 2, name: 'Payment register' }]
        : [{ order: 1, name: 'Employee audit' }],
    },
  };
  readonly sourceCode = '<i-stepper [(activeIndex)]="activeIndex" ariaLabel="Report setup">\n  <i-step label="Details" [completed]="!!name.trim()">…</i-step>\n  <i-step label="Columns" [disabled]="!name.trim()">…</i-step>\n  <i-step label="Refine" [optional]="true" [completed]="isSaved()">…</i-step>\n  <i-step label="Preview & save" [completed]="isSaved()">…</i-step>\n</i-step>';
  readonly runProgress: GridData<{ name: string }, { name: string; status: string }> = {
    columns: [{ field: 'name', header: 'Automation' }],
    rows: [{ name: 'Month-end payroll pack' }],
    details: {
      columns: [{ field: 'name', header: 'Report' }, { field: 'status', header: 'Status' }],
      actionsHeader: '',
      rows: () => [{ name: 'Payroll summary', status: 'InProgress' }, { name: 'Payment register', status: 'Completed' }],
      actions: [{
        id: 'progress', tooltip: 'Report in progress', severity: 'info',
        loading: step => step.status === 'InProgress',
        visible: step => step.status === 'InProgress', handler: () => {},
      }],
    },
  };
  readonly progressTableCode = '<i-table [grid]="runProgress" dataKey="name" />';
  readonly progressCode = 'details: { actionsHeader: "", actions: [{ id: "progress", loading: step => step.status === "InProgress", visible: step => step.status === "InProgress", tooltip: "Report in progress", handler: () => {} }] }';
  readonly actionsCode = '<i-dialog-actions submitLabel="Save automation"\n  [submitLoading]="saving" [submitDisabled]="form.invalid"\n  (submitEvent)="save()" (cancelEvent)="cancel()" />';
  readonly tableCode = '<i-table [grid]="automations" dataKey="id" [globalFilter]="true" />';
  next(): void { this.activeIndex = Math.min(3, this.activeIndex + 1); }
  save(): void {
    if (this.name.trim() && this.selected.length) this.savedSignature = this.draftSignature();
  }
  isSaved(): boolean { return this.savedSignature === this.draftSignature(); }
  private draftSignature(): string {
    return JSON.stringify({ name: this.name, selected: this.selected, rules: this.rules });
  }
}
