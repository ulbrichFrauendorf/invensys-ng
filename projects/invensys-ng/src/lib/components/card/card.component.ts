import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { IButton } from '../button/button.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Card Component
 *
 * A container component that displays content in a styled card layout.
 * Optionally includes a header title and a close button.
 *
 * @example
 * ```html
 * <!-- Basic card with content -->
 * <i-card>
 *   <p>Card content goes here</p>
 * </i-card>
 *
 * <!-- Card with title -->
 * <i-card title="My Card Title">
 *   <p>Card content</p>
 * </i-card>
 *
 * <!-- Closable card -->
 * <i-card
 *   title="Closable Card"
 *   [closable]="true"
 *   (closeCard)="onCardClose()">
 *   <p>This card can be closed</p>
 * </i-card>
 * ```
 *
 * @remarks
 * Use content projection to add any content inside the card body.
 * The card automatically handles header rendering when a title is provided.
 */
@Component({
  selector: 'i-card',
  imports: [IButton],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class ICard {
  /**
   * Optional title displayed in the card header
   */
  @Input() title?: string;

  /**
   * Whether the card can be closed (shows close button)
   * @default false
   */
  @Input() closable: boolean = false;

  /**
   * Whether the card should fill the height of its container
   * @default false
   */
  @Input() fullHeight: boolean = false;

  /**
   * Host binding for full-height class
   * @internal
   */
  @HostBinding('class.i-card--full-height') get isFullHeight() {
    return this.fullHeight;
  }

  /**
   * Event emitted when the close button is clicked
   */
  @Output() closeCard = new EventEmitter<void>();

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-card-');

  /**
   * Handles the close button click event
   * @internal
   */
  onCloseCard(): void {
    this.closeCard.emit();
  }
}
