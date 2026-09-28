import { TestBed } from '@angular/core/testing';
import { EditorRule, IRuleEditor } from './rule-editor.component';

describe('IRuleEditor', () => {
  it('resets values and incompatible operators when the field changes', () => {
    const component = TestBed.createComponent(IRuleEditor).componentInstance;
    component.fields = [{ key: 'name', label: 'Name', type: 'text' }, { key: 'amount', label: 'Amount', type: 'number' }];
    component.operators = [{ key: 'contains', label: 'Contains', fieldTypes: ['text'] }, { key: 'eq', label: 'Equals' }];
    const original: EditorRule[] = [{ fieldKey: 'name', operator: 'contains', value: 'Alice' }];
    component.rules = original;
    const changed = jasmine.createSpy('changed');
    component.rulesChange.subscribe(changed);
    component.changeField(0, component.fields[1]);
    expect(changed).toHaveBeenCalledWith([{ fieldKey: 'amount', operator: 'eq', value: '' }]);
    expect(original[0].value).toBe('Alice');
  });

  it('supports valueless sort directions and blocks readonly changes', () => {
    const fixture = TestBed.createComponent(IRuleEditor);
    const component = fixture.componentInstance;
    component.fields = [{ key: 'date', label: 'Date', type: 'date' }];
    component.operators = [{ key: 'asc', label: 'Ascending', requiresValue: false }];
    component.rules = [{ fieldKey: 'date', operator: 'asc' }];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.i-rule-editor__row > i-input-text')).toBeNull();
    const changed = jasmine.createSpy('changed');
    component.rulesChange.subscribe(changed);
    component.readonly = true;
    component.add();
    component.remove(0);
    component.update(0, { value: '2026-01-01' });
    expect(changed).not.toHaveBeenCalled();
  });

  it('uses a native date input for a date rule', () => {
    const fixture = TestBed.createComponent(IRuleEditor);
    const component = fixture.componentInstance;
    component.fields = [{ key: 'date', label: 'Date', type: 'date' }];
    component.operators = [{ key: 'after', label: 'After' }];
    component.rules = [{ fieldKey: 'date', operator: 'after', value: '2026-01-01' }];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[type="date"]')).not.toBeNull();
  });
});
