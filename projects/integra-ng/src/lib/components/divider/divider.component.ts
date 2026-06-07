import { Component, Input } from '@angular/core';

export type IDividerAlign = 'start' | 'center' | 'end';
export type IDividerLayout = 'horizontal' | 'vertical';

/**
 * Divider Component
 *
 * A visual separator used to group related content. Supports horizontal and
 * vertical layouts, optional projected content, and content alignment.
 *
 * @example
 * ```html
 * <!-- Basic divider -->
 * <i-divider />
 *
 * <!-- Divider with label -->
 * <i-divider>Details</i-divider>
 *
 * <!-- End-aligned label -->
 * <i-divider align="end">Actions</i-divider>
 *
 * <!-- Vertical divider -->
 * <i-divider layout="vertical" />
 * ```
 */
@Component({
  selector: 'i-divider',
  standalone: true,
  imports: [],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
})
export class IDivider {
  /**
   * Divider layout orientation.
   * @default 'horizontal'
   */
  @Input() layout: IDividerLayout = 'horizontal';

  /**
   * Alignment for projected divider content.
   * @default 'center'
   */
  @Input() align: IDividerAlign = 'center';
}
