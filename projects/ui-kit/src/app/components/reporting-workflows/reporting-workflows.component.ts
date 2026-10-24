import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IButton } from '@shared/components/button/button.component';
import { IInputText } from '@shared/components/input-text/input-text.component';
import {
  IFieldPicker,
  FieldPickerOption,
} from '@shared/components/field-picker/field-picker.component';
import { IOrderedList } from '@shared/components/ordered-list/ordered-list.component';
import {
  IRuleEditor,
  EditorRule,
  RuleEditorField,
  RuleEditorOperator,
} from '@shared/components/rule-editor/rule-editor.component';
import { IStepper } from '@shared/components/stepper/stepper.component';
import { IStep } from '@shared/components/stepper/step.component';
import { ITable, GridData } from '@shared/components/table/table.component';
import { IDialogActions } from '@shared/components/dialog/inner/dialog-actions/dialog-actions.component';
interface AutomationExample {
  id: string;
  name: string;
  status: string;
  steps: number;
}
interface StepExample {
  order: number;
  name: string;
}

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-reporting-workflows',
  imports: [
    DemoPlaygroundComponent,
    DemoOptionDirective,
    FormsModule,
    IButton,
    IInputText,
    IFieldPicker,
    IOrderedList,
    IRuleEditor,
    IStepper,
    IStep,
    ITable,
    IDialogActions,
  ],
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
  readonly label = (key: string): string => this.fields.find((f) => f.key === key)?.label ?? key;
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
      columns: [
        { field: 'order', header: 'Order', type: 'number' },
        { field: 'name', header: 'Report step' },
      ],
      rows: (row) =>
        row.id === 'monthly'
          ? [
              { order: 1, name: 'Payroll summary' },
              { order: 2, name: 'Payment register' },
            ]
          : [{ order: 1, name: 'Employee audit' }],
    },
  };
  readonly sourceCode = `<i-stepper [(activeIndex)]="activeIndex" ariaLabel="Report setup">
  <i-step label="Report details" icon="pi pi-file-edit" [completed]="!!name.trim()">
    <section class="step-content">
      <h2>Report details</h2>
      <i-input-text label="Report name" [(ngModel)]="name" [fluid]="true" />
    </section>
  </i-step>
  <i-step
    label="Choose columns"
    [description]="selected.length + ' selected'"
    icon="pi pi-table"
    [disabled]="!name.trim()"
    [completed]="selected.length > 0"
  >
    <section class="step-content">
      <h2>Columns</h2>
      <div class="editor-grid">
        <i-field-picker [options]="fields" [(ngModel)]="selected" /><i-ordered-list
          [(items)]="selected"
          [itemLabel]="label"
          ariaLabel="Spreadsheet columns"
          emptyMessage="Select fields from the catalog to start your spreadsheet."
        />
      </div>
    </section>
  </i-step>
  <i-step
    label="Refine results"
    icon="pi pi-sliders-h"
    [optional]="true"
    [completed]="isSaved()"
    [disabled]="!name.trim() || !selected.length"
  >
    <section class="step-content">
      <h2>Filters</h2>
      <i-rule-editor
        [fields]="ruleFields"
        [operators]="operators"
        [(rules)]="rules"
        addLabel="Add filter"
        emptyMessage="All matching records are included."
      />
    </section>
  </i-step>
  <i-step
    label="Preview & save"
    icon="pi pi-eye"
    [completed]="isSaved()"
    [disabled]="!name.trim() || !selected.length"
  >
    <section class="step-content">
      <h2>{{ name }}</h2>
      <p>{{ selected.length }} columns · {{ rules.length }} filters</p>
      <i-ordered-list
        [(items)]="selected"
        [itemLabel]="label"
        [removable]="false"
        ariaLabel="Final headings"
      />
    </section>
  </i-step>
  <footer stepperActions class="workflow-footer">
    <i-button
      severity="contrast"
      [text]="true"
      [disabled]="activeIndex === 0"
      (clicked)="activeIndex = activeIndex - 1"
      >Back</i-button
    >
    <span>Step {{ activeIndex + 1 }} of 4</span>
    @if (activeIndex < 3) {
      <i-button
        [disabled]="!name.trim() || (activeIndex > 0 && !selected.length)"
        (clicked)="next()"
        >Continue</i-button
      >
    } @else {
      <i-button icon="pi pi-check" [disabled]="!name.trim() || !selected.length" (clicked)="save()"
        >Save example</i-button
      >
    }
  </footer>
</i-stepper>`;
  readonly runProgress: GridData<{ name: string }, { name: string; status: string }> = {
    columns: [{ field: 'name', header: 'Automation' }],
    rows: [{ name: 'Month-end payroll pack' }],
    details: {
      columns: [
        { field: 'name', header: 'Report' },
        { field: 'status', header: 'Status' },
      ],
      actionsHeader: '',
      rows: () => [
        { name: 'Payroll summary', status: 'InProgress' },
        { name: 'Payment register', status: 'Completed' },
      ],
      actions: [
        {
          id: 'progress',
          tooltip: 'Report in progress',
          severity: 'info',
          loading: (step) => step.status === 'InProgress',
          visible: (step) => step.status === 'InProgress',
          handler: () => {},
        },
      ],
    },
  };
  readonly progressTableCode = `<i-table [grid]="runProgress" dataKey="name" />`;
  readonly progressCode =
    'details: { actionsHeader: "", actions: [{ id: "progress", loading: step => step.status === "InProgress", visible: step => step.status === "InProgress", tooltip: "Report in progress", handler: () => {} }] }';
  readonly actionsCode = `<i-dialog-actions
  submitLabel="Save automation"
  [submitLoading]="saving"
  [submitDisabled]="form.invalid"
  (submitEvent)="save()"
  (cancelEvent)="cancel()"
/>`;
  readonly tableCode = `<i-table [grid]="automations" dataKey="id" [globalFilter]="true" />`;
  next(): void {
    this.activeIndex = Math.min(3, this.activeIndex + 1);
  }
  save(): void {
    if (this.name.trim() && this.selected.length) this.savedSignature = this.draftSignature();
  }
  isSaved(): boolean {
    return this.savedSignature === this.draftSignature();
  }
  private draftSignature(): string {
    return JSON.stringify({ name: this.name, selected: this.selected, rules: this.rules });
  }
}
