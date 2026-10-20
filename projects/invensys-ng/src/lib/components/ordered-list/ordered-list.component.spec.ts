import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { cdp } from 'vitest/browser';
import type { CDPSession } from '@vitest/browser-playwright';
import { IOrderedList } from './ordered-list.component';

describe('IOrderedList', () => {
  it('drags a row by its handle to a non-adjacent position', async () => {
    const fixture = TestBed.createComponent(IOrderedList<string>);
    fixture.componentRef.setInput('items', ['A', 'B', 'C']);
    fixture.detectChanges();
    await fixture.whenStable();
    const changed = vi.fn();
    fixture.componentInstance.itemsChange.subscribe(changed);
    const handles = fixture.nativeElement.querySelectorAll('.i-ordered-list__drag-handle');
    const start = handles[0].getBoundingClientRect();
    const end = handles[2].getBoundingClientRect();
    const x = start.x + start.width / 2;
    const y = start.y + start.height / 2;
    const session: CDPSession = cdp();
    await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await session.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 });
    for (let step = 1; step <= 10; step++) {
      await session.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved', x, y: y + (end.y + end.height / 2 - y) * step / 10, buttons: 1,
      });
    }
    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased', x, y: end.y + end.height / 2, button: 'left', clickCount: 1,
    });
    expect(changed).toHaveBeenCalledWith(['B', 'C', 'A']);
  });

  it('reorders non-adjacent rows through the drop list without mutating caller data', () => {
    const fixture = TestBed.createComponent(IOrderedList<string>);
    const original = ['A', 'B', 'C', 'D'];
    fixture.componentRef.setInput('items', original);
    fixture.detectChanges();
    const changed = vi.fn();
    const moved = vi.fn();
    fixture.componentInstance.itemsChange.subscribe(changed);
    fixture.componentInstance.onMove.subscribe(moved);

    fixture.debugElement.query(By.directive(CdkDropList)).triggerEventHandler(
      'cdkDropListDropped', { previousIndex: 0, currentIndex: 3 },
    );

    expect(changed).toHaveBeenCalledWith(['B', 'C', 'D', 'A']);
    expect(moved).toHaveBeenCalledWith({ item: 'A', previousIndex: 0, index: 3 });
    expect(original).toEqual(['A', 'B', 'C', 'D']);
  });

  it('provides icon-only actions and keyboard reordering, and disables dragging when locked', () => {
    const fixture = TestBed.createComponent(IOrderedList<string>);
    fixture.componentRef.setInput('items', ['A', 'B', 'C']);
    fixture.detectChanges();
    const changed = vi.fn();
    fixture.componentInstance.itemsChange.subscribe(changed);
    const actions: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.i-ordered-list__actions button'));
    expect(actions.every(button => !button.textContent?.trim() && button.getAttribute('aria-label'))).toBe(true);
    expect(fixture.nativeElement.querySelector('.i-ordered-list__position')).toBeNull();
    fixture.nativeElement.querySelector('.i-ordered-list__drag-handle').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    expect(changed).toHaveBeenCalledWith(['B', 'A', 'C']);
    changed.mockClear();

    for (const state of ['readonly', 'disabled']) {
      fixture.componentRef.setInput(state, true);
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.directive(CdkDrag)).every(row => row.injector.get(CdkDrag).disabled)).toBe(true);
      fixture.debugElement.query(By.directive(CdkDropList)).triggerEventHandler(
        'cdkDropListDropped', { previousIndex: 0, currentIndex: 2 },
      );
      expect(changed).not.toHaveBeenCalled();
      fixture.componentRef.setInput(state, false);
    }
  });

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
