import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Panel Component
 *
 * A collapsible panel container with a header that can be toggled open/closed.
 * Displays a minus/plus icon to indicate the collapsed state.
 *
 * @example
 * ```html
 * <!-- Basic panel -->
 * <i-panel header="Options">
 *   <p>Content goes here</p>
 * </i-panel>
 *
 * <!-- Initially collapsed panel -->
 * <i-panel header="Settings" [collapsed]="true">
 *   <p>Settings content</p>
 * </i-panel>
 *
 * <!-- Panel with toggle event -->
 * <i-panel header="Details" (onToggle)="handleToggle($event)">
 *   <p>Detailed information</p>
 * </i-panel>
 *
 * <!-- Non-toggleable panel -->
 * <i-panel header="Fixed Section" [toggleable]="false">
 *   <p>Always visible content</p>
 * </i-panel>
 * ```
 *
 * @remarks
 * Use content projection to add any content inside the panel body.
 * The panel header shows a minus icon when expanded and plus icon when collapsed.
 */
@Component({
  selector: 'i-panel',
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
})
export class IPanel {
  /**
   * The header/title text displayed in the panel
   */
  @Input() header: string = '';

  /**
   * Whether the panel content is collapsed
   * @default false
   */
  @Input() collapsed: boolean = false;

  /**
   * Whether the panel can be toggled
   * @default true
   */
  @Input() toggleable: boolean = true;

  /**
   * Event emitted when collapsed state changes
   */
  @Output() collapsedChange = new EventEmitter<boolean>();

  /**
   * Event emitted when panel is toggled
   */
  @Output() onToggle = new EventEmitter<boolean>();

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-panel-');

  /**
   * Toggles the panel collapsed state
   * @internal
   */
  toggle(): void {
    if (!this.toggleable) {
      return;
    }
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
    this.onToggle.emit(this.collapsed);
  }
}
