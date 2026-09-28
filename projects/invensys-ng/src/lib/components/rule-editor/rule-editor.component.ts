import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IButton } from '../button/button.component';
import { IInputText } from '../input-text/input-text.component';
import { ISelect } from '../select/select.component';
import { NoContentComponent } from '../no-content/no-content.component';

export type RuleFieldType = 'text' | 'number' | 'date' | 'boolean';
/** Fields presented by a rule editor; keys must be unique. */
export interface RuleEditorField {
  key: string;
  label: string;
  type: RuleFieldType;
}
/** Operator semantics belong to the consumer. Keys must be unique. */
export interface RuleEditorOperator {
  key: string;
  label: string;
  /** Defaults to true. Set false for empty checks or sort directions. */
  requiresValue?: boolean;
  /** Omit to offer the operator for all field types. */
  fieldTypes?: RuleFieldType[];
}
/** UI rule value. Numeric/date/boolean values are represented as strings. */
export interface EditorRule {
  fieldKey: string;
  operator: string;
  value?: string;
}

/**
 * Controlled field/operator/value rows. Can also edit sorting rules by supplying
 * direction operators with requiresValue=false. Does not execute or persist rules.
 * @example
 * ```html
 * <i-rule-editor [fields]="fields" [operators]="operators" [(rules)]="filters" />
 * ```
 */
@Component({
  selector: 'i-rule-editor',
  standalone: true,
  imports: [FormsModule, IButton, IInputText, ISelect, NoContentComponent],
  templateUrl: './rule-editor.component.html',
  styleUrl: './rule-editor.component.scss',
})
export class IRuleEditor {
  /** Available fields. */
  @Input() fields: RuleEditorField[] = [];
  /** Available operators, optionally restricted by field type. */
  @Input() operators: RuleEditorOperator[] = [];
  /** Current rows. Bind rulesChange or use two-way binding. */
  @Input() rules: EditorRule[] = [];
  /** Accessible name for the collection. */
  @Input() ariaLabel = 'Rules';
  /** Label of the operator selector (for example Direction). */
  @Input() operatorLabel = 'Operator';
  /** Add action label. */
  @Input() addLabel = 'Add rule';
  /** Empty collection message. */
  @Input() emptyMessage = 'No rules.';
  /** Prevents user changes while retaining the current display. */
  @Input() readonly = false;
  /** Disables all row controls. */
  @Input() disabled = false;
  /** Immutable replacement emitted after a user action. */
  @Output() rulesChange = new EventEmitter<EditorRule[]>();
  readonly booleanOptions = [
    { key: 'true', label: 'True' },
    { key: 'false', label: 'False' },
  ];

  field(rule: EditorRule): RuleEditorField | null {
    return this.fields.find((field) => field.key === rule.fieldKey) ?? null;
  }
  operator(rule: EditorRule): RuleEditorOperator | null {
    return (
      this.operators.find((operator) => operator.key === rule.operator) ?? null
    );
  }
  booleanValue(rule: EditorRule): { key: string; label: string } | null {
    return (
      this.booleanOptions.find((option) => option.key === rule.value) ?? null
    );
  }

  operatorsFor(field: RuleEditorField | null): RuleEditorOperator[] {
    return field
      ? this.operators.filter(
          (operator) =>
            !operator.fieldTypes || operator.fieldTypes.includes(field.type),
        )
      : [];
  }

  get canAdd(): boolean {
    return (
      !this.readonly &&
      !this.disabled &&
      this.fields.some((field) => this.operatorsFor(field).length > 0)
    );
  }

  add(): void {
    if (!this.canAdd) return;
    const field = this.fields.find(
      (field) => this.operatorsFor(field).length > 0,
    )!;
    this.rulesChange.emit([
      ...this.rules,
      {
        fieldKey: field.key,
        operator: this.operatorsFor(field)[0].key,
        value: '',
      },
    ]);
  }

  changeField(index: number, field: RuleEditorField | null): void {
    if (!field) return;
    this.update(index, {
      fieldKey: field.key,
      operator: this.operatorsFor(field)[0]?.key ?? '',
      value: '',
    });
  }

  changeOperator(index: number, operator: RuleEditorOperator | null): void {
    if (!operator) return;
    this.update(index, {
      operator: operator.key,
      value: operator.requiresValue === false ? '' : this.rules[index]?.value,
    });
  }

  update(index: number, changes: Partial<EditorRule>): void {
    if (
      this.readonly ||
      this.disabled ||
      index < 0 ||
      index >= this.rules.length
    )
      return;
    this.rulesChange.emit(
      this.rules.map((rule, i) =>
        i === index ? { ...rule, ...changes } : rule,
      ),
    );
  }

  remove(index: number): void {
    if (
      this.readonly ||
      this.disabled ||
      index < 0 ||
      index >= this.rules.length
    )
      return;
    this.rulesChange.emit(this.rules.filter((_, i) => i !== index));
  }
}
