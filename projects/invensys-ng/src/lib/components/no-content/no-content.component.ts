import { Component, Input } from '@angular/core';
import { IPlaceholder } from '../placeholder/placeholder.component';

/**
 * No Content Component
 *
 * A versatile empty state component that can be used anywhere in the application
 * when there is no data to display. Perfect for tables, lists, search results, etc.
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <i-no-content></i-no-content>
 *
 * <!-- With custom message -->
 * <i-no-content [message]="'No products found'"></i-no-content>
 *
 * <!-- With custom icon -->
 * <i-no-content
 *   [icon]="'pi pi-search'"
 *   [message]="'No search results'">
 * </i-no-content>
 *
 * <!-- In a table when no data -->
 * <table>
 *   <tbody>
 *     @if (data.length === 0) {
 *       <tr>
 *         <td colspan="100%">
 *           <i-no-content></i-no-content>
 *         </td>
 *       </tr>
 *     }
 *   </tbody>
 * </table>
 * ```
 *
 * @remarks
 * This component provides a consistent empty state experience across the application.
 */
@Component({
  selector: 'i-no-content',
  standalone: true,
  imports: [IPlaceholder],
  templateUrl: './no-content.component.html',
  styleUrl: './no-content.component.scss',
})
export class NoContentComponent {
  /**
   * Icon class to display (PrimeIcons format)
   * @default 'pi pi-inbox'
   */
  @Input() icon: string = 'pi pi-inbox';

  /**
   * Message to display below the icon
   * @default 'No content available'
   */
  @Input() message: string = 'No content available';
}
