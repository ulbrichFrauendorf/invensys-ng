import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { IFieldPicker } from './field-picker.component';

describe('IFieldPicker', () => {
  it('keeps hidden selections and updates the form without mutating its value', async () => {
    const fixture = TestBed.createComponent(IFieldPicker);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('options', [
      { key: 'name', label: 'Name', group: 'Identity' },
      { key: 'amount', label: 'Amount', group: 'Pay' },
    ]);
    const original = ['name'];
    const change = vi.fn().mockName('change');
    const touched = vi.fn().mockName('touched');
    component.registerOnChange(change);
    component.registerOnTouched(touched);
    component.writeValue(original);
    expect(change).not.toHaveBeenCalled();
    component.search = 'pay';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const checkbox = fixture.nativeElement.querySelector('[role="checkbox"]') as HTMLElement;
    const emittedValue = firstValueFrom(component.onChange);
    checkbox.click();
    expect(await emittedValue).toEqual(['name', 'amount']);
    await fixture.whenStable();
    expect(change).toHaveBeenCalledWith(['name', 'amount']);
    expect(original).toEqual(['name']);
    expect(touched).toHaveBeenCalled();
  });

  it('honors readonly, disabled, and disabled options and handles form reset', () => {
    const fixture = TestBed.createComponent(IFieldPicker);
    const component = fixture.componentInstance;
    const option = { key: 'a', label: 'A' };
    const change = vi.fn().mockName('change');
    component.registerOnChange(change);
    fixture.componentRef.setInput('readonly', true);
    component.select(option, true);
    fixture.componentRef.setInput('readonly', false);
    component.setDisabledState(true);
    component.select(option, true);
    component.setDisabledState(false);
    component.select({ ...option, disabled: true }, true);
    expect(change).not.toHaveBeenCalled();
    component.writeValue(null);
    expect(component.value).toEqual([]);
  });
});
