import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { CLAIMS_CHECKER, ClaimsChecker } from '../services/claims-checker.token';
import { MenuModel } from '../models/menu.model';
import { Observable, of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  const mockMenuModel: MenuModel[] = [
    {
      label: 'Group 1',
      items: [
        { label: 'Item 1', routerLink: ['/item1'] },
        { label: 'Item 2', routerLink: ['/item2'], claim: 'view-item2' },
      ],
    },
    {
      label: 'Group 2',
      claim: 'view-group2',
      items: [{ label: 'Item 3', routerLink: ['/item3'] }],
    },
    {
      label: 'Group 3',
      items: [
        {
          label: 'Parent Item',
          routerLink: ['/parent'],
          items: [
            { label: 'Sub Item 1', routerLink: ['/sub1'] },
            { label: 'Sub Item 2', routerLink: ['/sub2'], claim: 'view-sub2' },
          ],
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function createComponent() {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  describe('Without Claims Checker', () => {
    beforeEach(() => createComponent());
    it('should show all menu items when no claims checker is provided', async () => {
      fixture.componentRef.setInput('model', mockMenuModel);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.filteredModel().length).toBe(3);
      expect(component.filteredModel()[0].items.length).toBe(2);
      expect(component.filteredModel()[1].items.length).toBe(1);
      expect(component.filteredModel()[2].items.length).toBe(1);
    });

    it('should handle empty model', async () => {
      fixture.componentRef.setInput('model', []);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.filteredModel().length).toBe(0);
    });
  });

  describe('With Claims Checker', () => {
    let mockClaimsChecker: MockedObject<ClaimsChecker>;

    beforeEach(async () => {
      mockClaimsChecker = {
        hasClaim: vi.fn().mockName('ClaimsChecker.hasClaim'),
      };

      await TestBed.configureTestingModule({
        imports: [MenuComponent],
        providers: [provideRouter([]), { provide: CLAIMS_CHECKER, useValue: mockClaimsChecker }],
      }).compileComponents();

      fixture = TestBed.createComponent(MenuComponent);
      component = fixture.componentInstance;
    });

    it('should filter menu items based on claims', async () => {
      // Setup: User has view-item2 claim but not view-group2 or view-sub2
      mockClaimsChecker.hasClaim.mockImplementation((claim: string) => {
        if (claim === 'view-item2') return of(true);
        if (claim === 'view-group2') return of(false);
        if (claim === 'view-sub2') return of(false);
        return of(false);
      });

      fixture.componentRef.setInput('model', mockMenuModel);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const filtered = component.filteredModel();

      // Group 1 should have 2 items (both visible)
      expect(filtered[0].label).toBe('Group 1');
      expect(filtered[0].items.length).toBe(2);

      // Group 2 should be filtered out (claim failed)
      expect(filtered.find((g) => g.label === 'Group 2')).toBeUndefined();

      // Group 3 should have 1 parent item with 1 sub item (view-sub2 filtered out)
      expect(filtered[1].label).toBe('Group 3');
      expect(filtered[1].items[0].items?.length).toBe(1);
      expect(filtered[1].items[0].items?.[0].label).toBe('Sub Item 1');
    });

    it('should show all items when all claims are granted', async () => {
      mockClaimsChecker.hasClaim.mockReturnValue(of(true));

      fixture.componentRef.setInput('model', mockMenuModel);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const filtered = component.filteredModel();

      expect(filtered.length).toBe(3);
      expect(filtered[0].items.length).toBe(2);
      expect(filtered[1].items.length).toBe(1);
      expect(filtered[2].items[0].items?.length).toBe(2);
    });

    it('should hide all items when no claims are granted', async () => {
      mockClaimsChecker.hasClaim.mockReturnValue(of(false));

      fixture.componentRef.setInput('model', mockMenuModel);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const filtered = component.filteredModel();

      // Group 1 should only have Item 1 (Item 2 filtered out)
      expect(filtered[0].items.length).toBe(1);
      expect(filtered[0].items[0].label).toBe('Item 1');

      // Group 2 should be filtered out entirely
      expect(filtered.find((g) => g.label === 'Group 2')).toBeUndefined();

      // Group 3 should have parent with only Sub Item 1
      expect(filtered[1].items[0].items?.length).toBe(1);
      expect(filtered[1].items[0].items?.[0].label).toBe('Sub Item 1');
    });

    it('should hide groups with no visible items', async () => {
      mockClaimsChecker.hasClaim.mockReturnValue(of(false));

      const modelWithClaimsOnAllItems: MenuModel[] = [
        {
          label: 'Restricted Group',
          items: [
            { label: 'Item 1', routerLink: ['/item1'], claim: 'claim1' },
            { label: 'Item 2', routerLink: ['/item2'], claim: 'claim2' },
          ],
        },
      ];

      fixture.componentRef.setInput('model', modelWithClaimsOnAllItems);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const filtered = component.filteredModel();

      // Group should be completely hidden since no items are visible
      expect(filtered.length).toBe(0);
    });

    it('keeps unrestricted children alongside children with granted claims', async () => {
      mockClaimsChecker.hasClaim.mockImplementation((claim: string) => {
        return of(claim === 'view-sub2');
      });

      fixture.componentRef.setInput('model', mockMenuModel);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const filtered = component.filteredModel();
      const group3 = filtered.find((g) => g.label === 'Group 3');

      expect(group3).toBeDefined();
      expect(group3?.items[0].items?.map((item) => item.label)).toEqual([
        'Sub Item 1',
        'Sub Item 2',
      ]);
    });

    it('should hide parent items with no visible sub-items', async () => {
      mockClaimsChecker.hasClaim.mockReturnValue(of(false));

      const modelWithNestedClaims: MenuModel[] = [
        {
          label: 'Group',
          items: [
            {
              label: 'Parent',
              routerLink: ['/parent'],
              items: [
                { label: 'Sub 1', routerLink: ['/sub1'], claim: 'claim1' },
                { label: 'Sub 2', routerLink: ['/sub2'], claim: 'claim2' },
              ],
            },
          ],
        },
      ];

      fixture.componentRef.setInput('model', modelWithNestedClaims);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const filtered = component.filteredModel();

      // Parent should be hidden since all sub-items are filtered out
      expect(filtered.length).toBe(0);
    });

    it('should update filtered model when model input changes', async () => {
      mockClaimsChecker.hasClaim.mockReturnValue(of(true));

      // Set initial model
      fixture.componentRef.setInput('model', [mockMenuModel[0]]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.filteredModel().length).toBe(1);

      // Update model
      fixture.componentRef.setInput('model', mockMenuModel);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.filteredModel().length).toBe(3);
    });

    it('should call hasClaim only once per unique claim', async () => {
      mockClaimsChecker.hasClaim.mockReturnValue(of(true));

      const modelWithDuplicateClaims: MenuModel[] = [
        {
          label: 'Group 1',
          items: [
            {
              label: 'Item 1',
              routerLink: ['/item1'],
              claim: 'duplicate-claim',
            },
            {
              label: 'Item 2',
              routerLink: ['/item2'],
              claim: 'duplicate-claim',
            },
          ],
        },
      ];

      fixture.componentRef.setInput('model', modelWithDuplicateClaims);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      // Should only check 'duplicate-claim' once
      expect(mockClaimsChecker.hasClaim).toHaveBeenCalledTimes(1);
      expect(mockClaimsChecker.hasClaim).toHaveBeenCalledWith('duplicate-claim');
    });
  });

  describe('Cleanup', () => {
    it('should cleanup subscriptions on destroy', () => {
      createComponent();
      const destroySpy = vi.fn().mockName('destroy');
      (component as any).destroy$.subscribe({
        next: destroySpy,
      });

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
