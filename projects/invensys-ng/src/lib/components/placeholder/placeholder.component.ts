import { Component, Input } from '@angular/core';


/**
 * Arrow direction options for the placeholder icon
 */
export type PlaceholderArrowDirection =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'none';

/**
 * Placeholder Component
 *
 * Displays a centered placeholder area with an optional arrow icon and custom content.
 * Useful for empty selection states, drop zones, or instructional placeholders.
 *
 * @example
 * ```html
 * <!-- Basic placeholder with left arrow -->
 * <i-placeholder arrowDirection="left">
 *   Select an item from the list
 * </i-placeholder>
 *
 * <!-- Placeholder with no icon -->
 * <i-placeholder arrowDirection="none">
 *   <h3>No items found</h3>
 *   <p>Try adjusting your search criteria</p>
 * </i-placeholder>
 *
 * <!-- Placeholder with custom icon -->
 * <i-placeholder [customIcon]="'pi pi-inbox'">
 *   Your inbox is empty
 * </i-placeholder>
 * ```
 */
@Component({
  selector: 'i-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss',
})
export class IPlaceholder {
  /**
   * Direction of the arrow icon.
   * Use 'none' to hide the icon completely.
   * @default 'left'
   */
  @Input() arrowDirection: PlaceholderArrowDirection = 'left';

  /**
   * Custom icon class to use instead of an arrow.
   * When set, this overrides arrowDirection.
   * @example 'pi pi-inbox', 'pi pi-search'
   */
  @Input() customIcon: string | null = null;

  /**
   * Whether to show a subtle background pattern
   * @default false
   */
  @Input() showPattern: boolean = false;

  /**
   * Gets the icon class based on configuration
   */
  get iconClass(): string | null {
    if (this.customIcon) {
      return this.customIcon;
    }

    if (this.arrowDirection === 'none') {
      return null;
    }

    const arrowMap: Record<PlaceholderArrowDirection, string> = {
      left: 'pi pi-arrow-left',
      right: 'pi pi-arrow-right',
      up: 'pi pi-arrow-up',
      down: 'pi pi-arrow-down',
      none: '',
    };

    return arrowMap[this.arrowDirection];
  }
}
