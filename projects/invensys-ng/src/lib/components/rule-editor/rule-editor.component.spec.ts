import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { EditorRule, IRuleEditor } from './rule-editor.component';

describe('IRuleEditor', () => {
  it('reorders complete rules through dragging and keyboard input without changing caller data', () => {
    const fixture = TestBed.createComponent(IRuleEditor);
    const original: EditorRule[] = [
      { fieldKey: 'name', operator: 'eq', value: 'Alice' },
      { fieldKey: 'amount', operator: 'gt', value: '10' },
      { fieldKey: 'date', operator: 'after', value: '2026-01-01' },
    ];
    fixture.componentRef.setInput('rules', original);
    fixture.detectChanges();
    const changed = vi.fn();
    fixture.componentInstance.rulesChange.subscribe(changed);
    const list = fixture.debugElement.query(By.directive(CdkDropList));
    list.triggerEventHandler('cdkDropListDropped', { previousIndex: 2, currentIndex: 0 });
    expect(changed).toHaveBeenCalledWith([original[2], original[0], original[1]]);
    expect(original.map(rule => rule.fieldKey)).toEqual(['name', 'amount', 'date']);
    fixture.nativeElement.querySelector('.i-rule-editor__drag-handle').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    expect(changed).toHaveBeenLastCalledWith([original[1], original[0], original[2]]);
    changed.mockClear();
    for (const state of ['readonly', 'disabled']) {
      fixture.componentRef.setInput(state, true);
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.directive(CdkDrag)).every(row => row.injector.get(CdkDrag).disabled)).toBe(true);
      list.triggerEventHandler('cdkDropListDropped', { previousIndex: 0, currentIndex: 2 });
      expect(changed).not.toHaveBeenCalled();
      fixture.componentRef.setInput(state, false);
    }
  });

  it('resets values and incompatible operators when the field changes', () => {
    const fixture = TestBed.createComponent(IRuleEditor);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('fields', [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'amount', label: 'Amount', type: 'number' },
    ]);
    fixture.componentRef.setInput('operators', [
      { key: 'contains', label: 'Contains', fieldTypes: ['text'] },
      { key: 'eq', label: 'Equals' },
    ]);
    const original: EditorRule[] = [
      { fieldKey: 'name', operator: 'contains', value: 'Alice' },
    ];
    fixture.componentRef.setInput('rules', original);
    const changed = vi.fn().mockName('changed');
    component.rulesChange.subscribe(changed);
    component.changeField(0, component.fields[1]);
    expect(changed).toHaveBeenCalledWith([
      { fieldKey: 'amount', operator: 'eq', value: '' },
    ]);
    expect(original[0].value).toBe('Alice');
  });

  it('supports valueless sort directions and blocks readonly changes', () => {
    const fixture = TestBed.createComponent(IRuleEditor);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('fields', [
      { key: 'date', label: 'Date', type: 'date' },
    ]);
    fixture.componentRef.setInput('operators', [
      { key: 'asc', label: 'Ascending', requiresValue: false },
    ]);
    fixture.componentRef.setInput('rules', [
      { fieldKey: 'date', operator: 'asc' },
    ]);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.i-rule-editor__row > i-input-text'),
    ).toBeNull();
    const changed = vi.fn().mockName('changed');
    component.rulesChange.subscribe(changed);
    fixture.componentRef.setInput('readonly', true);
    component.add();
    component.remove(0);
    component.update(0, { value: '2026-01-01' });
    expect(changed).not.toHaveBeenCalled();
  });

  it('uses a native date input for a date rule', () => {
    const fixture = TestBed.createComponent(IRuleEditor);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('fields', [
      { key: 'date', label: 'Date', type: 'date' },
    ]);
    fixture.componentRef.setInput('operators', [
      { key: 'after', label: 'After' },
    ]);
    fixture.componentRef.setInput('rules', [
      { fieldKey: 'date', operator: 'after', value: '2026-01-01' },
    ]);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('input[type="date"]'),
    ).not.toBeNull();
  });
});
