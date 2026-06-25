import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Chip Component
 *
 * A component for displaying removable tags, labels, or compact information.
 * Supports icons, images, and removal functionality.
 *
 * @example
 * ```html
 * <!-- Basic chip -->
 * <i-chip label="Angular"></i-chip>
 *
 * <!-- Chip with icon -->
 * <i-chip label="John Doe" icon="pi pi-user"></i-chip>
 *
 * <!-- Chip with image -->
 * <i-chip label="Jane Smith" image="assets/avatar.jpg"></i-chip>
 *
 * <!-- Removable chip -->
 * <i-chip
 *   label="TypeScript"
 *   [removable]="true"
 *   (onRemove)="handleRemove($event)">
 * </i-chip>
 *
 * <!-- Custom style -->
 * <i-chip
 *   label="Premium"
 *   styleClass="chip-premium">
 * </i-chip>
 * ```
 *
 * @remarks
 * This component uses OnPush change detection for optimal performance.
 */
@Component({
  selector: 'i-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IChip {
  /**
   * Text label displayed on the chip
   */
  @Input() label?: string;

  /**
   * Icon class name to display (e.g., 'pi pi-user')
   */
  @Input() icon?: string;

  /**
   * Image URL to display (e.g., avatar)
   */
  @Input() image?: string;

  /**
   * Whether the chip can be removed
   * @default false
   */
  @Input() removable = false;

  /**
   * Icon class for the remove button
   * @default 'pi pi-times-circle'
   */
  @Input() removeIcon = 'pi pi-times-circle';

  /**
   * Additional CSS classes to apply
   */
  @Input() styleClass?: string;

  /**
   * Whether the chip is disabled (prevents removal)
   * @default false
   */
  @Input() disabled = false;

  /**
   * Event emitted when the remove icon is clicked
   */
  @Output() onRemove = new EventEmitter<Event>();

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-chip-');

  /**
   * Handles remove icon click
   * @internal
   */
  onRemoveClick(event: Event): void {
    if (!this.disabled) {
      this.onRemove.emit(event);
    }
  }
}
