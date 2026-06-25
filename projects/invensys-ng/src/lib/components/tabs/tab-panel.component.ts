import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

/**
 * Tab Panel Component
 *
 * Individual tab panel used inside the ITabs container.
 * Supports text-only, icon-only, and combined icon + text labels.
 *
 * @example
 * ```html
 * <!-- Text only -->
 * <i-tab-panel header="Home">Content here</i-tab-panel>
 *
 * <!-- Icon only -->
 * <i-tab-panel icon="pi pi-home">Content here</i-tab-panel>
 *
 * <!-- Icon and text -->
 * <i-tab-panel header="Home" icon="pi pi-home">Content here</i-tab-panel>
 * ```
 */
@Component({
  selector: 'i-tab-panel',
  standalone: true,
  template: `
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class ITabPanel {
  /**
   * Text label for the tab header
   */
  @Input() header?: string;

  /**
   * Icon class for the tab header (e.g., 'pi pi-home')
   */
  @Input() icon?: string;

  /**
   * Whether the tab is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Whether the tab can be closed
   * @default false
   */
  @Input() closable = false;

  /**
   * Reference to the content template
   * @internal
   */
  @ViewChild('contentTemplate', { static: true })
  contentTemplate!: TemplateRef<unknown>;
}
