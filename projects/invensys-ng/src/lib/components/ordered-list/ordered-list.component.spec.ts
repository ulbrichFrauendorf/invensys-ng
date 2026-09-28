import { TestBed } from '@angular/core/testing';
import { IOrderedList } from './ordered-list.component';

describe('IOrderedList', () => {
  it('emits reordered items while preserving caller data', () => {
    const fixture = TestBed.createComponent(IOrderedList<string>);
    const component = fixture.componentInstance;
    const original = ['A', 'B'];
    component.items = original;
    const changed = jasmine.createSpy('changed');
    component.itemsChange.subscribe(changed);
    component.move(0, 1);
    expect(changed).toHaveBeenCalledWith(['B', 'A']);
    expect(original).toEqual(['A', 'B']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('A moved to position 2');
  });

  it('blocks out-of-range and readonly actions', () => {
    const component = TestBed.createComponent(IOrderedList<string>).componentInstance;
    component.items = ['A'];
    const changed = jasmine.createSpy('changed');
    component.itemsChange.subscribe(changed);
    component.move(0, -1);
    component.move(0, 1);
    component.remove(2);
    component.readonly = true;
    component.remove(0);
    expect(changed).not.toHaveBeenCalled();
    component.readonly = false;
    component.remove(0);
    expect(changed).toHaveBeenCalledWith([]);
  });
});
