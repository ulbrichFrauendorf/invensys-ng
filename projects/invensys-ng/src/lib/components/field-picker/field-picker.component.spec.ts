import { TestBed } from '@angular/core/testing';
import { IFieldPicker } from './field-picker.component';

describe('IFieldPicker', () => {
  it('keeps hidden selections and updates the form without mutating its value', async () => {
    const fixture = TestBed.createComponent(IFieldPicker);
    const component = fixture.componentInstance;
    component.options = [{ key: 'name', label: 'Name', group: 'Identity' }, { key: 'amount', label: 'Amount', group: 'Pay' }];
    const original = ['name'];
    const change = jasmine.createSpy('change');
    const touched = jasmine.createSpy('touched');
    component.registerOnChange(change);
    component.registerOnTouched(touched);
    component.writeValue(original);
    expect(change).not.toHaveBeenCalled();
    component.search = 'pay';
    fixture.detectChanges();
    const checkbox = fixture.nativeElement.querySelector('[role="checkbox"]') as HTMLElement;
    checkbox.click();
    await fixture.whenStable();
    expect(change).toHaveBeenCalledWith(['name', 'amount']);
    expect(original).toEqual(['name']);
    expect(touched).toHaveBeenCalled();
  });

  it('honors readonly, disabled, and disabled options and handles form reset', () => {
    const component = TestBed.createComponent(IFieldPicker).componentInstance;
    const option = { key: 'a', label: 'A' };
    const change = jasmine.createSpy('change');
    component.registerOnChange(change);
    component.readonly = true;
    component.select(option, true);
    component.readonly = false;
    component.setDisabledState(true);
    component.select(option, true);
    component.setDisabledState(false);
    component.select({ ...option, disabled: true }, true);
    expect(change).not.toHaveBeenCalled();
    component.writeValue(null);
    expect(component.value).toEqual([]);
  });
});
