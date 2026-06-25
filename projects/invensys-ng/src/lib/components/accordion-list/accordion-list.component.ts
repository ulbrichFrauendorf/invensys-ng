import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IAccordion } from '../accordion/accordion.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Accordion List Component
 *
 * A container component that groups multiple accordion components.
 * Supports single or multiple expansion modes.
 *
 * @example
 * ```html
 * <!-- Single expansion mode (only one open at a time) -->
 * <i-accordion-list [multiple]="false">
 *   <i-accordion header="Section 1">
 *     <p>Content 1</p>
 *   </i-accordion>
 *   <i-accordion header="Section 2">
 *     <p>Content 2</p>
 *   </i-accordion>
 * </i-accordion-list>
 *
 * <!-- Multiple expansion mode -->
 * <i-accordion-list [multiple]="true">
 *   <i-accordion header="Section 1">
 *     <p>Content 1</p>
 *   </i-accordion>
 *   <i-accordion header="Section 2">
 *     <p>Content 2</p>
 *   </i-accordion>
 * </i-accordion-list>
 * ```
 *
 * @remarks
 * When multiple is false (default), expanding one accordion will collapse others.
 * When multiple is true, any number of accordions can be expanded simultaneously.
 */
@Component({
  selector: 'i-accordion-list',
  templateUrl: './accordion-list.component.html',
  styleUrl: './accordion-list.component.scss',
})
export class IAccordionList implements AfterContentInit, OnDestroy {
  /**
   * Whether multiple accordions can be expanded at the same time
   * @default false
   */
  @Input() multiple: boolean = false;

  /**
   * Query list of child accordion components
   * @internal
   */
  @ContentChildren(IAccordion) accordions!: QueryList<IAccordion>;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-accordion-list-');

  /**
   * Subscriptions for cleanup
   * @internal
   */
  private subscriptions: Subscription[] = [];

  /**
   * Subscription for accordion list changes
   * @internal
   */
  private accordionsChangesSub?: Subscription;

  ngAfterContentInit(): void {
    this.setupAccordionListeners();

    // Listen for changes to the accordion list
    this.accordionsChangesSub = this.accordions.changes.subscribe(() => {
      this.cleanupSubscriptions();
      this.setupAccordionListeners();
    });
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
    this.accordionsChangesSub?.unsubscribe();
  }

  /**
   * Cleans up all accordion toggle subscriptions
   * @internal
   */
  private cleanupSubscriptions(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  /**
   * Sets up toggle listeners for all child accordions
   * @internal
   */
  private setupAccordionListeners(): void {
    this.accordions.forEach((accordion) => {
      // Subscribe to toggle events
      const sub = accordion.onToggle.subscribe((expanded: boolean) => {
        if (expanded && !this.multiple) {
          this.collapseOthers(accordion);
        }
      });
      this.subscriptions.push(sub);
    });
  }

  /**
   * Collapses all accordions except the specified one
   * @internal
   */
  private collapseOthers(expandedAccordion: IAccordion): void {
    this.accordions.forEach((accordion) => {
      if (accordion !== expandedAccordion && accordion.expanded) {
        accordion.expanded = false;
        accordion.expandedChange.emit(false);
      }
    });
  }
}
