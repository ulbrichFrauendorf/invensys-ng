# Data editor components

These standalone controls follow the library's `i-*` selectors, documented inputs/outputs, shared controls and theme mixins. They contain no API clients or application-specific report models. See the UI kit at `/components/data-editors` for editable and read-only examples.

## Field picker

Import `IFieldPicker` and `FormsModule`. Supply `FieldPickerOption[]` with unique keys. The ControlValueAccessor value is `string[]`; both ngModel and reactive forms are supported. Search includes labels, groups and descriptions and preserves selections outside the current search. `readonly` prevents selection changes; `disabled` also disables searching. A form reset accepts null. `onChange` emits only user changes, as a new array.

```html
<i-field-picker [options]="fields" [(ngModel)]="selectedKeys" />
```

## Ordered list

Import `IOrderedList`. Use `[(items)]`, or handle `itemsChange`, to apply changes. Inputs are never mutated. `itemLabel` supplies readable labels and `itemKey` supplies stable identity when item objects are replaced. `itemTemplate` receives `$implicit`, `index` and `readonly`; the consumer must honor readonly in projected controls. Move and remove buttons support keyboard activation, and changes are announced through a live region. Reordering and removal have optional detail outputs `onMove` and `onRemove`.

```html
<i-ordered-list [(items)]="columns" [itemLabel]="columnLabel" [itemKey]="columnKey" [itemTemplate]="settings" />
<ng-template #settings let-column let-index="index" let-readonly="readonly">
  <!-- Bind domain settings here using the supplied readonly state. -->
</ng-template>
```

## Rule editor

Import `IRuleEditor`. Supply `RuleEditorField[]`, `RuleEditorOperator[]` and bind `[(rules)]` to `EditorRule[]`. Field keys and operator keys must be unique. Operators can restrict fieldTypes; changing a field clears its old value and chooses the first compatible operator. Date/number fields render typed inputs and boolean fields render a true/false selector. Values are strings; this control does not perform domain validation or execute rules. Use `requiresValue: false` for empty checks or sort directions. Sorting uses the same component with `operatorLabel="Direction"` and caller-defined ascending/descending operators. The order of the rules is significant and remains caller-controlled.

```html
<i-rule-editor [fields]="fields" [operators]="operators" [(rules)]="filters" />
```

All controls compose existing invensys-ng primitives. Responsive styles and color theme mixins follow the neighboring components. Integrating applications should adapt their generated API contracts at the view boundary and retain their validation and persistence rules.
