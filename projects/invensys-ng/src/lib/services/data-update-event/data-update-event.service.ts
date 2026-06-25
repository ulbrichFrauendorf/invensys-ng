import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for broadcasting data update events across the application.
 *
 * This service provides a centralized mechanism for components to notify other parts
 * of the application when data has been updated, enabling reactive UI updates without
 * tight coupling between components.
 *
 * @example
 * ```typescript
 * // In a component that updates data
 * constructor(private dataUpdateService: DataUpdateEventService) {}
 *
 * saveData() {
 *   this.apiService.save(this.data).subscribe(() => {
 *     this.dataUpdateService.notifyDataUpdated();
 *   });
 * }
 *
 * // In a component that needs to react to updates
 * ngOnInit() {
 *   this.dataUpdateService.dataUpdated$.subscribe(() => {
 *     this.loadFreshData();
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class DataUpdateEventService {
  /**
   * Internal subject for managing data update events.
   * @internal
   */
  private dataUpdatedSource = new BehaviorSubject<void>(undefined);

  /**
   * Observable stream that emits when data has been updated.
   * Subscribe to this observable to react to data changes in the application.
   */
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  /**
   * Notifies all subscribers that data has been updated.
   * Call this method after performing any data modification operation
   * to trigger reactive updates across the application.
   *
   * @example
   * ```typescript
   * this.dataUpdateService.notifyDataUpdated();
   * ```
   */
  notifyDataUpdated() {
    this.dataUpdatedSource.next();
  }
}
