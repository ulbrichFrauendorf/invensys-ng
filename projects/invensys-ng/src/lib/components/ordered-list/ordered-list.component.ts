import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { IButton } from '../button/button.component';
import { NoContentComponent } from '../no-content/no-content.component';

/** Context supplied to an ordered list's custom row settings template. */
export interface OrderedListItemContext<T> {
  $implicit: T;
  index: number;
  readonly: boolean;
}
/** Describes a user-initiated reordering. */
export interface OrderedListMoveEvent<T> {
  item: T;
  previousIndex: number;
  index: number;
}

/**
 * Controlled ordered list with accessible move/remove actions and optional row content.
 * Emits new arrays and never mutates the caller's items or their properties.
 * @example
 * ```html
 * <i-ordered-list [(items)]="columns" [itemLabel]="columnLabel" [itemTemplate]="settings" />
 * <ng-template #settings let-column let-index="index" let-readonly="readonly">
 *   <!-- Domain-specific settings are owned by the consumer. -->
 * </ng-template>
 * ```
 */
@Component({
  selector: 'i-ordered-list',
  standalone: true,
  imports: [NgTemplateOutlet, IButton, NoContentComponent],
  templateUrl: './ordered-list.component.html',
  styleUrl: './ordered-list.component.scss',
})
export class IOrderedList<T> {
  /** Items in display order. Bind itemsChange or use two-way binding. */
  @Input() items: T[] = [];
  /** Accessible row labels. */
  @Input() itemLabel: (item: T) => string = (item) => String(item);
  /** Stable identity for rows, particularly when immutable item objects are used. */
  @Input() itemKey: (item: T) => unknown = (item) => item;
  /** Optional content below each item's label. */
  @Input() itemTemplate?: TemplateRef<OrderedListItemContext<T>>;
  /** Accessible name of the ordered list. */
  @Input() ariaLabel = 'Selected items';
  /** Empty-list message. */
  @Input() emptyMessage = 'No items selected.';
  /** Prevents reordering and removal. The same state is passed into the row template. */
  @Input() readonly = false;
  /** Disables all list actions. */
  @Input() disabled = false;
  /** Controls whether remove actions are shown. */
  @Input() removable = true;
  /** New ordered array after a move or removal. */
  @Output() itemsChange = new EventEmitter<T[]>();
  /** Additional move details for consumers that need them. */
  @Output() onMove = new EventEmitter<OrderedListMoveEvent<T>>();
  /** Removed item and its former index. */
  @Output() onRemove = new EventEmitter<{ item: T; index: number }>();
  announcement = '';

  move(index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (
      this.readonly ||
      this.disabled ||
      index < 0 ||
      index >= this.items.length ||
      target < 0 ||
      target >= this.items.length
    )
      return;
    const items = [...this.items];
    const item = items[index];
    [items[index], items[target]] = [items[target], items[index]];
    this.announcement = `${this.itemLabel(item)} moved to position ${target + 1}.`;
    this.itemsChange.emit(items);
    this.onMove.emit({ item, previousIndex: index, index: target });
  }

  remove(index: number): void {
    if (
      this.readonly ||
      this.disabled ||
      !this.removable ||
      index < 0 ||
      index >= this.items.length
    )
      return;
    const item = this.items[index];
    this.announcement = `${this.itemLabel(item)} removed.`;
    this.itemsChange.emit(this.items.filter((_, i) => i !== index));
    this.onRemove.emit({ item, index });
  }
}
