import { TestBed } from '@angular/core/testing';
import { IChipsComponent } from './chips/chips.component';
import { IMultiSelect } from './multi-select/multi-select.component';
import { ISelect } from './select/select.component';
import { ICheckbox } from './checkbox/checkbox.component';
import { IToggle } from './toggle/toggle.component';
import { IRadioButton } from './radio-button/radio-button.component';

describe('Frontend layout and interaction consistency', () => {
  beforeAll(() =>
    console.info(
      'Pointer profile',
      innerWidth,
      matchMedia('(pointer: coarse)').matches,
    ),
  );
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        IChipsComponent,
        IMultiSelect,
        ISelect,
        ICheckbox,
        IToggle,
        IRadioButton,
      ],
    }),
  );

  function setup<T>(
    type: new (...args: any[]) => T,
    inputs: Record<string, unknown> = {},
  ) {
    const fixture = TestBed.createComponent(type);
    fixture.nativeElement.style.cssText = 'display:block;width:220px;';
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    return fixture;
  }
  const options = [
    { label: 'One', id: 1 },
    { label: 'Two', id: 2 },
  ];
  const chips = options.map((option) => ({
    label: option.label,
    value: option.id,
  }));

  it('keeps the chip collection plain, with no field label, select or caret', () => {
    const fixture = setup(IChipsComponent, {
      chips,
      boxed: true,
      label: 'Legacy label',
      useFloatLabel: true,
    });
    expect(
      fixture.nativeElement.querySelector('label, select, .pi-chevron-down'),
    ).toBeNull();
    expect(
      fixture.nativeElement
        .querySelector('[role="group"]')
        .getAttribute('aria-label'),
    ).toBe('Legacy label');
  });

  it('keeps clear-all inside the collection and prevents clearing while disabled', () => {
    const fixture = setup(IChipsComponent, {
      chips,
      boxed: true,
      allowCloseAll: true,
    });
    const button = fixture.nativeElement.querySelector(
      '.i-chips-clear',
    ) as HTMLButtonElement;
    const container = fixture.nativeElement
      .querySelector('.i-chips-container')
      .getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(container.left);
    expect(rect.right).toBeLessThanOrEqual(container.right);
    expect(rect.bottom).toBeLessThanOrEqual(container.bottom);
    const clear = vi.fn().mockName('clear');
    fixture.componentInstance.closedAll.subscribe(clear);
    fixture.componentRef.setInput('disabled', true);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    button.click();
    fixture.componentInstance.onCloseAllClicked(new Event('click'));
    expect(clear).not.toHaveBeenCalled();
  });

  it('collapses only when chip content exceeds its own available space', async () => {
    const fixture = setup(IChipsComponent, {
      chips,
      collapseOnOverflow: true,
      allowCloseAll: true,
    });
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.componentInstance.chipsOverflow).toBe(false);
    fixture.componentRef.setInput(
      'chips',
      Array.from({ length: 8 }, (_, i) => ({
        label: 'Long item ' + i,
        value: i,
      })),
    );
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.componentInstance.chipsOverflow).toBe(true);
    expect(
      fixture.nativeElement.querySelector('.i-chips-summary').textContent,
    ).toContain('8 items selected');
    expect(
      fixture.nativeElement
        .querySelector('.i-chips-clear')
        .getBoundingClientRect().width,
    ).toBeGreaterThan(0);
  });

  for (const type of [ISelect, IMultiSelect]) {
    it(`${type.name} uses one field and bounds its clear action in both pointer modes`, () => {
      const fixture = setup(type as typeof ISelect, {
        options,
        optionLabel: 'label',
        showClear: true,
      });
      fixture.componentInstance.writeValue(
        type === ISelect ? options[0] : [options[0]],
      );
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const field = fixture.nativeElement.querySelector(
        '.i-option-control',
      ) as HTMLElement;
      const clear = fixture.nativeElement.querySelector(
        '.i-option-clear',
      ) as HTMLButtonElement;
      const picker = fixture.nativeElement.querySelector(
        '.i-native-select',
      ) as HTMLElement;
      const trigger = fixture.nativeElement.querySelector(
        '.i-option-trigger',
      ) as HTMLElement;
      const native = matchMedia(
        '(max-width: 991px) and (pointer: coarse)',
      ).matches;
      expect(picker.getClientRects().length > 0).toBe(native);
      expect(trigger.getClientRects().length > 0).toBe(!native);
      const rect = clear.getBoundingClientRect();
      const fieldRect = field.getBoundingClientRect();
      expect(rect.right).toBeLessThanOrEqual(fieldRect.right);
      expect(rect.bottom).toBeLessThanOrEqual(fieldRect.bottom);
      expect(
        document
          .elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
          ?.closest('button'),
      ).toBe(clear);
      clear.click();
      expect(fixture.componentInstance.isOpen).toBe(false);
      expect(fixture.componentInstance.value).toEqual(
        type === ISelect ? null : [],
      );
    });
  }

  it('removes a chip without opening the picker or changing other selections', async () => {
    const fixture = setup(IMultiSelect, { options, optionLabel: 'label' });
    fixture.componentInstance.writeValue([options[0]]);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const remove = fixture.nativeElement.querySelector(
      '.i-chip-remove-icon',
    ) as HTMLButtonElement;
    const rect = remove.getBoundingClientRect();
    expect(
      document
        .elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
        ?.closest('button'),
    ).toBe(remove);
    remove.click();
    expect(fixture.componentInstance.value).toEqual([]);
    expect(fixture.componentInstance.isOpen).toBe(false);
  });

  it('keeps the custom multi-select open for repeated choices and closes on Escape', async () => {
    const fixture = setup(IMultiSelect, {
      options,
      optionLabel: 'label',
      nativeOnMobile: false,
    });
    const trigger = fixture.nativeElement.querySelector(
      '.i-option-trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('.i-option-panel') as HTMLElement;
    expect(panel).not.toBeNull();
    expect(fixture.nativeElement.contains(panel)).toBe(false);
    const buttons =
      panel.querySelectorAll<HTMLButtonElement>('[role="option"]');
    buttons[0].click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    buttons[1].click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toEqual(options);
    expect(fixture.componentInstance.isOpen).toBe(true);
    buttons[1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('makes the entire bounded checkbox target clickable exactly once', () => {
    const fixture = setup(ICheckbox, { label: 'Enabled' });
    const wrapper = fixture.nativeElement.querySelector(
      '[role="checkbox"]',
    ) as HTMLElement;
    wrapper.click();
    expect(fixture.componentInstance.checked).toBe(true);
    (fixture.nativeElement.querySelector('label') as HTMLElement).click();
    expect(fixture.componentInstance.checked).toBe(false);
    expect(
      getComputedStyle(
        fixture.nativeElement.querySelector('.i-checkbox'),
        '::after',
      ).content,
    ).toBe('none');
  });
});
