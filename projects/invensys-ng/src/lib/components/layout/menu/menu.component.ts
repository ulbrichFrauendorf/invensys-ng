import { Component, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MenuModel, MenuItem } from '../models/menu.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CLAIMS_CHECKER, ClaimsChecker } from '../services/claims-checker.token';
import { Subject, BehaviorSubject, forkJoin, of, Observable } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'i-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [RouterLink, RouterLinkActive],
})
export class MenuComponent implements OnInit, OnDestroy {
  private readonly claimsChecker = inject(CLAIMS_CHECKER, { optional: true });
  private readonly destroy$ = new Subject<void>();
  private readonly modelSubject$ = new BehaviorSubject<MenuModel[]>([]);
  
  filteredModel = signal<MenuModel[]>([]);

  @Input() set model(value: MenuModel[]) {
    this.modelSubject$.next(value);
  }

  ngOnInit(): void {
    this.modelSubject$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((model) => this.filterModelByClaims(model))
      )
      .subscribe((filteredModel) => {
        this.filteredModel.set(filteredModel);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private filterModelByClaims(model: MenuModel[]): Observable<MenuModel[]> {
    // If no claims checker is provided, return all menu items (backward compatible)
    if (!this.claimsChecker) {
      return of(model);
    }

    // Collect all unique claims from the model
    const claims = this.collectClaims(model);
    
    if (claims.size === 0) {
      return of(model);
    }

    // Check all claims in parallel using forkJoin
    const claimChecks: { [key: string]: Observable<boolean> } = {};
    claims.forEach((claim) => {
      claimChecks[claim] = this.claimsChecker!.hasClaim(claim);
    });

    if (Object.keys(claimChecks).length === 0) {
      return of(model);
    }

    return forkJoin(claimChecks).pipe(
      map((claimsMap) => this.filterModel(model, claimsMap))
    );
  }

  private collectClaims(model: MenuModel[]): Set<string> {
    const claims = new Set<string>();

    model.forEach((group) => {
      if (group.claim) {
        claims.add(group.claim);
      }
      
      group.items.forEach((item) => {
        this.collectItemClaims(item, claims);
      });
    });

    return claims;
  }

  private collectItemClaims(item: MenuItem, claims: Set<string>): void {
    if (item.claim) {
      claims.add(item.claim);
    }

    if (item.items) {
      item.items.forEach((subItem) => {
        this.collectItemClaims(subItem, claims);
      });
    }
  }

  private filterModel(model: MenuModel[], claimsMap: { [key: string]: boolean }): MenuModel[] {
    return model
      .filter((group) => {
        // If group has a claim, check if user has access
        if (group.claim && !claimsMap[group.claim]) {
          return false;
        }
        return true;
      })
      .map((group) => ({
        ...group,
        items: this.filterItems(group.items, claimsMap),
      }))
      .filter((group) => group.items.length > 0); // Remove groups with no visible items
  }

  private filterItems(items: MenuItem[], claimsMap: { [key: string]: boolean }): MenuItem[] {
    return items
      .filter((item) => {
        // If item has a claim, check if user has access
        if (item.claim && !claimsMap[item.claim]) {
          return false;
        }
        return true;
      })
      .map((item) => {
        // If item has nested items, filter them recursively
        if (item.items) {
          return {
            ...item,
            items: this.filterItems(item.items, claimsMap),
          };
        }
        return item;
      })
      .filter((item) => {
        // If item has nested items, keep it only if it has visible nested items
        if (item.items) {
          return item.items.length > 0;
        }
        return true;
      });
  }
}
