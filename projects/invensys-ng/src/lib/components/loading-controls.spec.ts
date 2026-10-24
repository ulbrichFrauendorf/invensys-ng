import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ITable } from './table/table.component';
import { IChart } from './chart/chart.component';
import { IListbox } from './listbox/listbox.component';
import { ISelect } from './select/select.component';
import { IMultiSelect } from './multi-select/multi-select.component';
import { ITreeView } from './tree-view/tree-view.component';
import { IChipsComponent } from './chips/chips.component';
import { IFieldPicker } from './field-picker/field-picker.component';
import { IOrderedList } from './ordered-list/ordered-list.component';
import { IRuleEditor } from './rule-editor/rule-editor.component';

const options = [
  { label: 'One', id: 1 },
  { label: 'Two', id: 2 },
];
const controls: { name: string; type: Type<unknown>; inputs: Record<string, unknown> }[] = [
  {
    name: 'table',
    type: ITable,
    inputs: {
      grid: { columns: [{ field: 'label', header: 'Name' }], rows: options },
      height: '320px',
    },
  },
  {
    name: 'chart',
    type: IChart,
    inputs: {
      charts: [
        {
          chartId: 'loading-test',
          chartType: 'line',
          labels: ['One'],
          dataSets: [{ label: 'Count', data: [1], backgroundColors: ['--blue-500'] }],
        },
      ],
    },
  },
  { name: 'listbox', type: IListbox, inputs: { options, optionLabel: 'label' } },
  { name: 'select', type: ISelect, inputs: { options, optionLabel: 'label' } },
  { name: 'multi-select', type: IMultiSelect, inputs: { options, optionLabel: 'label' } },
  { name: 'tree', type: ITreeView, inputs: { value: [{ key: 'one', label: 'One' }] } },
  { name: 'chips', type: IChipsComponent, inputs: { chips: [{ label: 'One', value: 1 }] } },
  { name: 'field picker', type: IFieldPicker, inputs: { options: [{ key: 'one', label: 'One' }] } },
  { name: 'ordered list', type: IOrderedList, inputs: { items: ['One', 'Two'] } },
  {
    name: 'rule editor',
    type: IRuleEditor,
    inputs: {
      fields: [{ key: 'one', label: 'One', type: 'text' }],
      operators: [{ key: 'eq', label: 'Equals' }],
      rules: [{ fieldKey: 'one', operator: 'eq', value: 'Saved' }],
    },
  },
];

describe.each(controls)('$name native loading', ({ type, inputs }) => {
  it('owns an accessible skeleton and preserves its content while loading', () => {
    TestBed.configureTestingModule({ imports: [type] });
    const fixture = TestBed.createComponent(type);
    fixture.nativeElement.style.cssText = 'display:block;width:600px;max-width:100%;';
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const shell = fixture.nativeElement.querySelector('.loading-shell') as HTMLElement;
    const content = shell.querySelector('.loading-content') as HTMLElement;
    const retained = content.firstElementChild;
    fixture.componentRef.setInput('loading', true);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(shell.getAttribute('aria-busy')).toBe('true');
    expect(content.inert).toBe(true);
    expect(getComputedStyle(content).visibility).toBe('hidden');
    const status = shell.querySelector('.loading-placeholder[role="status"]') as HTMLElement;
    expect(status.getAttribute('aria-label')).toMatch(/^Loading/);
    expect(status.getBoundingClientRect().height).toBeGreaterThanOrEqual(40);
    expect(shell.querySelector('i-progress-spinner, .pi-spinner')).toBeNull();
    fixture.componentRef.setInput('loading', false);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(shell.getAttribute('aria-busy')).toBe('false');
    expect(shell.querySelector('.loading-placeholder[role="status"]')).toBeNull();
    expect(content.inert).toBe(false);
    expect(content.firstElementChild).toBe(retained);
    expect(getComputedStyle(content).visibility).toBe('visible');
    fixture.destroy();
  });
});

for (const type of [ISelect, IMultiSelect]) {
  describe(type.name + ' loading interactions', () => {
    it('closes its popup, blocks native changes and retains the selected value', () => {
      TestBed.configureTestingModule({ imports: [type] });
      const fixture = TestBed.createComponent<ISelect | IMultiSelect>(type);
      fixture.componentRef.setInput('optionLabel', 'label');
      fixture.componentRef.setInput('options', options);
      const component = fixture.componentInstance;
      const value = type === ISelect ? options[0] : [options[0]];
      if (component instanceof IMultiSelect) component.writeValue([options[0]]);
      else component.writeValue(options[0]);
      const changed = vi.fn();
      component.registerOnChange(changed);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      component.openDropdown();
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      fixture.componentRef.setInput('loading', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.isOpen).toBe(false);
      const native = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
      expect(native.disabled).toBe(true);
      native.value = '1';
      native.dispatchEvent(new Event('change'));
      component.openDropdown();
      expect(component.isOpen).toBe(false);
      expect(component.value).toEqual(value);
      expect(changed).not.toHaveBeenCalled();
      fixture.componentRef.setInput('loading', false);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(native.disabled).toBe(false);
      expect(component.value).toEqual(value);
      fixture.destroy();
    });
  });
}

it('keeps legacy boolean loading assignments compatible for tables and trees', () => {
  TestBed.configureTestingModule({ imports: [ITable, ITreeView] });
  const table = TestBed.createComponent(ITable);
  table.componentInstance.loading = true;
  table.detectChanges();
  expect(table.componentInstance.loadingState()).toBe(true);
  expect(table.nativeElement.querySelector('[role="status"]')).not.toBeNull();
  const tree = TestBed.createComponent(ITreeView);
  tree.componentInstance.loading = true;
  tree.detectChanges();
  expect(tree.componentInstance.loadingState()).toBe(true);
  expect(tree.nativeElement.querySelector('[role="status"]')).not.toBeNull();
  table.destroy();
  tree.destroy();
});
