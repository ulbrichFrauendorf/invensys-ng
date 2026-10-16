import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IToggle } from '@shared/components/toggle/toggle.component';
import {
  FieldPickerOption,
  IFieldPicker,
} from '@shared/components/field-picker/field-picker.component';
import { IOrderedList } from '@shared/components/ordered-list/ordered-list.component';
import {
  EditorRule,
  IRuleEditor,
  RuleEditorField,
  RuleEditorOperator,
} from '@shared/components/rule-editor/rule-editor.component';
import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-data-editors',
  standalone: true,
  imports: [DemoPlaygroundComponent, DemoOptionDirective,
    FormsModule,
    IToggle,
    IFieldPicker,
    IOrderedList,
    IRuleEditor,
    ],
  templateUrl: './data-editors.component.html',
  styleUrl: './data-editors.component.scss',
})
export class DataEditorsComponent {
  readonly = false;
  fields: FieldPickerOption[] = [
    { key: 'name', label: 'Name', group: 'Identity', description: 'Text' },
    { key: 'amount', label: 'Amount', group: 'Amounts', description: 'Number' },
    { key: 'date', label: 'Date', group: 'Dates', description: 'Date' },
  ];
  selected = ['name', 'amount'];
  rules: EditorRule[] = [{ fieldKey: 'amount', operator: 'gt', value: '100' }];
  sorts: EditorRule[] = [{ fieldKey: 'name', operator: 'asc' }];
  ruleFields: RuleEditorField[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'amount', label: 'Amount', type: 'number' },
    { key: 'date', label: 'Date', type: 'date' },
  ];
  operators: RuleEditorOperator[] = [
    { key: 'eq', label: 'Equals' },
    { key: 'contains', label: 'Contains', fieldTypes: ['text'] },
    { key: 'gt', label: 'Greater than', fieldTypes: ['number', 'date'] },
    { key: 'empty', label: 'Is empty', requiresValue: false },
  ];
  directions: RuleEditorOperator[] = [
    { key: 'asc', label: 'Ascending', requiresValue: false },
    { key: 'desc', label: 'Descending', requiresValue: false },
  ];
  label = (key: string): string =>
    this.fields.find((field) => field.key === key)?.label ?? key;

  codeExamples = {
    fieldPicker: `<i-field-picker [options]="fields" [(ngModel)]="selectedFields" />`,
    orderedList: `<i-ordered-list [(items)]="columns" [itemLabel]="columnLabel" />`,
    filters: `<i-rule-editor [fields]="fields" [operators]="operators" [(rules)]="filters" />`,
    sorts: `<i-rule-editor operatorLabel="Direction" addLabel="Add sort"
  [fields]="fields" [operators]="directions" [(rules)]="sorts" />`,
  };

}
