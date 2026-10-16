import { TestBed } from '@angular/core/testing';
import { ISelect } from './select/select.component';
import { IMultiSelect } from './multi-select/multi-select.component';

describe('Native mobile option controls', () => {
  const options = [{ id: 1, label: 'Same label' }, { id: 2, label: 'Same label' }];

  beforeEach(() => TestBed.configureTestingModule({ imports: [ISelect, IMultiSelect] }));

  function setup<T extends ISelect | IMultiSelect>(type: new (...args: any[]) => T) {
    const fixture = TestBed.createComponent(type);
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('optionLabel', 'label');
    fixture.detectChanges();
    const picker = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    return { fixture, component: fixture.componentInstance, picker };
  }

  it('keeps an empty select on its placeholder', () => {
    const { picker } = setup(ISelect);
    expect(picker.value).toBe('-1');
  });

  it('preserves object values even when labels are identical', () => {
    const { picker, component } = setup(ISelect);
    const changed = jasmine.createSpy('changed');
    component.registerOnChange(changed);
    picker.value = '1';
    picker.dispatchEvent(new Event('change'));
    expect(component.value).toBe(options[1]);
    expect(changed).toHaveBeenCalledOnceWith(options[1]);
  });

  it('reflects external form writes and resets without emitting a change', () => {
    const { picker, component, fixture } = setup(ISelect);
    const changed = jasmine.createSpy('changed');
    component.registerOnChange(changed);
    component.writeValue({ ...options[1] });
    fixture.detectChanges();
    expect(picker.value).toBe('1');
    component.writeValue(null);
    fixture.detectChanges();
    expect(picker.value).toBe('-1');
    expect(changed).not.toHaveBeenCalled();
  });

  it('marks native controls touched on blur', () => {
    const { picker, component } = setup(ISelect);
    const touched = jasmine.createSpy('touched');
    component.registerOnTouched(touched);
    picker.dispatchEvent(new Event('blur'));
    expect(touched).toHaveBeenCalled();
  });

  it('disables both picker and custom interactions', () => {
    const { picker, component, fixture } = setup(ISelect);
    component.setDisabledState!(true);
    fixture.detectChanges();
    component.toggleDropdown();
    component.selectOption(options[0]);
    expect(picker.disabled).toBeTrue();
    expect(component.isOpen).toBeFalse();
    expect(component.value).toBeNull();
  });

  it('writes multiple native selections to the form and supports clearing', () => {
    const { picker, component } = setup(IMultiSelect);
    const changed = jasmine.createSpy('changed');
    component.registerOnChange(changed);
    picker.options[0].selected = true;
    picker.options[1].selected = true;
    picker.dispatchEvent(new Event('change'));
    expect(component.value).toEqual(options);
    expect(changed).toHaveBeenCalledWith(options);
    component.clearSelection();
    expect(changed).toHaveBeenCalledWith([]);
  });

  it('reflects external multiple selections and disabled state', () => {
    const { picker, component, fixture } = setup(IMultiSelect);
    component.writeValue([options[1]]);
    component.setDisabledState!(true);
    fixture.detectChanges();
    expect(Array.from(picker.selectedOptions).map(option => option.value)).toEqual(['1']);
    component.toggleDropdown();
    component.toggleOption(options[0]);
    component.clearSelection();
    expect(picker.disabled).toBeTrue();
    expect(component.isOpen).toBeFalse();
    expect(component.value).toEqual([options[1]]);
  });

  it('allows consumers to opt out of native controls', () => {
    const { fixture } = setup(ISelect);
    fixture.componentRef.setInput('nativeOnMobile', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('select')).toBeNull();
  });
});
