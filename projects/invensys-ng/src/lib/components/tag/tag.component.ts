import { Component, Input, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISeverity } from '../../enums/IButtonSeverity';

export type ITagSize = 'sm' | 'md' | 'lg';

/**
 * Tag Component
 *
 * A compact badge/label component for categorisation, status indicators,
 * and metadata display. Supports all design-system severity colours,
 * optional icons, pill shape, and three sizes.
 *
 * @example
 * ```html
 * <!-- Basic tag -->
 * <i-tag value="New" />
 *
 * <!-- Severity tag -->
 * <i-tag value="Saved" severity="success" />
 *
 * <!-- Rounded pill -->
 * <i-tag value="Beta" severity="info" [rounded]="true" />
 *
 * <!-- With icon -->
 * <i-tag value="Error" severity="danger" icon="pi pi-times-circle" />
 *
 * <!-- Different sizes -->
 * <i-tag value="Small" severity="warning" size="sm" />
 * <i-tag value="Large" severity="primary" size="lg" />
 * ```
 */
@Component({
  selector: 'i-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ITag {
  /**
   * Text content of the tag
   */
  @Input() value = '';

  /**
   * Colour severity following the design-system palette.
   * When omitted the tag renders with a neutral surface style.
   */
  @Input() severity?: ISeverity;

  /**
   * Renders the tag as a pill (fully rounded corners)
   * @default false
   */
  @Input({ transform: booleanAttribute }) rounded = false;

  /**
   * Icon class name to display before the value (e.g. 'pi pi-check')
   */
  @Input() icon?: string;

  /**
   * Visual size of the tag
   * @default 'md'
   */
  @Input() size: ITagSize = 'md';
}
