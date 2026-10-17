import { TestBed } from '@angular/core/testing';
import { IOrderedList } from './ordered-list.component';

describe('IOrderedList', () => {
  it('emits reordered items while preserving caller data', () => {
    const fixture = TestBed.createComponent(IOrderedList<string>);
    const component = fixture.componentInstance;
    const original = ['A', 'B'];
    fixture.componentRef.setInput('items', original);
    const changed = vi.fn().mockName('changed');
    component.itemsChange.subscribe(changed);
    component.move(0, 1);
    expect(changed).toHaveBeenCalledWith(['B', 'A']);
    expect(original).toEqual(['A', 'B']);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[role="status"]').textContent,
    ).toContain('A moved to position 2');
  });

  it('blocks out-of-range and readonly actions', () => {
    const fixture = TestBed.createComponent(IOrderedList<string>);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('items', ['A']);
    const changed = vi.fn().mockName('changed');
    component.itemsChange.subscribe(changed);
    component.move(0, -1);
    component.move(0, 1);
    component.remove(2);
    fixture.componentRef.setInput('readonly', true);
    component.remove(0);
    expect(changed).not.toHaveBeenCalled();
    fixture.componentRef.setInput('readonly', false);
    component.remove(0);
    expect(changed).toHaveBeenCalledWith([]);
  });
});
