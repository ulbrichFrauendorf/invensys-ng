import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Accordion Component
 *
 * An expandable/collapsible container component that displays content with a header.
 * Supports animations and can be controlled programmatically.
 *
 * @example
 * ```html
 * <!-- Basic accordion -->
 * <i-accordion header="Section Title">
 *   <p>Content goes here</p>
 * </i-accordion>
 *
 * <!-- Accordion with icon -->
 * <i-accordion header="Info Section" icon="pi pi-info-circle">
 *   <p>Informational content</p>
 * </i-accordion>
 *
 * <!-- Initially expanded accordion -->
 * <i-accordion header="Expanded Section" [expanded]="true">
 *   <p>This section starts expanded</p>
 * </i-accordion>
 *
 * <!-- Disabled accordion -->
 * <i-accordion header="Disabled Section" [disabled]="true">
 *   <p>Cannot be toggled</p>
 * </i-accordion>
 * ```
 *
 * @remarks
 * Use content projection to add any content inside the accordion body.
 * The accordion can be used standalone or within an i-accordion-list for group behavior.
 */
@Component({
  selector: 'i-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class IAccordion {
  /**
   * The header/title text displayed in the accordion
   */
  @Input() header: string = '';

  /**
   * Whether the accordion is expanded
   * @default false
   */
  @Input() expanded: boolean = false;

  /**
   * Whether the accordion is disabled
   * @default false
   */
  @Input() disabled: boolean = false;

  /**
   * Optional icon class (PrimeIcons format like 'pi pi-info-circle')
   */
  @Input() icon?: string;

  /**
   * Event emitted when expanded state changes
   */
  @Output() expandedChange = new EventEmitter<boolean>();

  /**
   * Event emitted when accordion is toggled
   */
  @Output() onToggle = new EventEmitter<boolean>();

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-accordion-');

  /**
   * Toggles the accordion expanded state
   * @internal
   */
  toggle(): void {
    if (this.disabled) {
      return;
    }
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
    this.onToggle.emit(this.expanded);
  }
}
