import { TestBed } from '@angular/core/testing';
import { ICheckbox } from './checkbox/checkbox.component';
import { LayoutService } from './layout/services/layout.service';
import { ITable } from './table/table.component';
import { RootSizeService } from '../themes/root-size.service';

describe('Root-relative component sizing', () => {
  const initialFont = document.documentElement.style.fontSize;
  const initialScale =
    document.documentElement.style.getPropertyValue('--i-ui-scale');

  afterEach(() => {
    TestBed.resetTestingModule();
    document.documentElement.style.fontSize = initialFont;
    if (initialScale)
      document.documentElement.style.setProperty('--i-ui-scale', initialScale);
    else document.documentElement.style.removeProperty('--i-ui-scale');
  });

  it.each([13.6, 16, 20])(
    'sizes all checkbox variants at a %spx root',
    async (fontSize) => {
      document.documentElement.style.fontSize = `${fontSize}px`;
      const fixture = TestBed.createComponent(ICheckbox);
      for (const [size, ratio] of [
        ['small', 0.75],
        ['medium', 0.875],
        ['large', 1],
      ] as const) {
        fixture.componentRef.setInput('size', size);
        await fixture.whenStable();
        const box: HTMLElement =
          fixture.nativeElement.querySelector('.i-checkbox');
        expect(box.getBoundingClientRect().width).toBeCloseTo(
          fontSize * ratio,
          1,
        );
      }
      fixture.destroy();
    },
  );

  it('exposes a single optional scale without setting a fixed root font', () => {
    document.documentElement.style.fontSize = '';
    const service = TestBed.inject(LayoutService);
    TestBed.tick();
    expect(document.documentElement.style.fontSize).toBe('');
    service.changeScale(0.85);
    expect(
      document.documentElement.style.getPropertyValue('--i-ui-scale'),
    ).toBe('0.85');
    expect(document.documentElement.style.fontSize).toBe('');
  });

  it('updates shared pixel geometry after the root font changes', async () => {
    document.documentElement.style.fontSize = '16px';
    const service = TestBed.inject(RootSizeService);
    expect(service.pixels()).toBe(16);
    document.documentElement.style.fontSize = '20px';
    await vi.waitFor(() => expect(service.pixels()).toBe(20));
  });

  it('keeps virtual row pixel size proportional to rem dimensions', async () => {
    document.documentElement.style.fontSize = '20px';
    const fixture = TestBed.createComponent(ITable);
    fixture.componentRef.setInput('grid', { columns: [], rows: [] });
    fixture.componentRef.setInput('virtualScrollItemSize', 48);
    await fixture.whenStable();
    expect(fixture.componentInstance.scaledRowSize()).toBe(60);
    document.documentElement.style.fontSize = '16px';
    await vi.waitFor(() =>
      expect(fixture.componentInstance.scaledRowSize()).toBe(48),
    );
    fixture.destroy();
  });
});
