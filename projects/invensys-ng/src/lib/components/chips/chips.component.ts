
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { IChip } from '../chip/chip.component';
import { IButton } from '../button/button.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

export interface ChipItem {
  label: string;
  value: unknown;
  icon?: string;
  removable?: boolean;
  disabled?: boolean;
}

export interface ChipRemoveEvent {
  chip: ChipItem;
  originalEvent: Event;
}

@Component({
  selector: 'i-chips',
  standalone: true,
  imports: [IChip, IButton],
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IChipsComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() chips: ChipItem[] = [];
  @Input() removable = true;
  @Input() disabled = false;
  @Input() collapseOnOverflow = false;
  @Input() overflowLabel?: string;
  /** Render chips inside a boxed input-like container */
  @Input() boxed = false;
  @Input() allowCloseAll = false;

  /** Label text for float label */
  @Input() label?: string;
  /** Whether to use floating label style */
  @Input() useFloatLabel = false;
  /** Show error state styling */
  @Input() showError = false;

  @Output() closedAll = new EventEmitter<void>();

  @Output() removeChip = new EventEmitter<ChipRemoveEvent>();

  @ViewChild('chipsViewport', { static: false })
  chipsViewportRef?: ElementRef<HTMLDivElement>;

  @ViewChild('chipsList', { static: false })
  chipsListRef?: ElementRef<HTMLDivElement>;

  chipsOverflow = false;
  private resizeObserver?: ResizeObserver;
  private overflowRafId?: number;

  /** Unique component identifier */
  componentId = UniqueComponentId('i-chips-');

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collapseOnOverflow']) {
      if (this.collapseOnOverflow) {
        this.setupOverflowHandling();
      } else {
        this.teardownOverflowHandling();
      }
    }

    if (changes['chips']) {
      this.queueOverflowCheck();
    }
  }

  ngAfterViewInit(): void {
    if (this.collapseOnOverflow) {
      this.setupOverflowHandling();
    }
  }

  ngOnDestroy(): void {
    this.teardownOverflowHandling();
  }

  trackByValue(index: number, chip: ChipItem): unknown {
    return chip.value ?? index;
  }

  onChipRemove(chip: ChipItem, event: Event): void {
    if (this.disabled || chip.disabled || !(chip.removable ?? this.removable)) {
      return;
    }

    event.stopPropagation();
    this.removeChip.emit({ chip, originalEvent: event });
  }

  get overflowText(): string {
    if (this.overflowLabel && this.overflowLabel.trim().length) {
      return this.overflowLabel;
    }

    const count = this.chips?.length ?? 0;
    return count === 1 ? '1 item selected' : `${count} items selected`;
  }

  private setupOverflowHandling(): void {
    if (!this.collapseOnOverflow) return;
    if (!this.chipsViewportRef?.nativeElement) return;

    this.resizeObserver?.disconnect();
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => this.queueOverflowCheck());
      this.resizeObserver.observe(this.chipsViewportRef!.nativeElement);
    });

    this.queueOverflowCheck();
  }

  private teardownOverflowHandling(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;

    if (this.overflowRafId) {
      cancelAnimationFrame(this.overflowRafId);
      this.overflowRafId = undefined;
    }

    if (this.chipsOverflow) {
      this.chipsOverflow = false;
      this.cdr.markForCheck();
    }
  }

  private queueOverflowCheck(): void {
    if (!this.collapseOnOverflow) return;
    if (!this.chipsViewportRef?.nativeElement) return;

    if (this.overflowRafId) {
      cancelAnimationFrame(this.overflowRafId);
    }

    this.ngZone.runOutsideAngular(() => {
      this.overflowRafId = requestAnimationFrame(() => {
        this.overflowRafId = undefined;
        this.checkOverflow();
      });
    });
  }

  private checkOverflow(): void {
    if (!this.collapseOnOverflow) return;
    if (!this.chipsViewportRef?.nativeElement) return;
    if (!this.chipsListRef?.nativeElement) return;

    const viewport = this.chipsViewportRef.nativeElement;
    const chipsList = this.chipsListRef.nativeElement;

    // Compare the chips list scroll width against the viewport's client width
    const isOverflowing = chipsList.scrollWidth > viewport.clientWidth + 1;

    if (this.chipsOverflow !== isOverflowing) {
      this.ngZone.run(() => {
        this.chipsOverflow = isOverflowing;
        this.cdr.markForCheck();
      });
    }
  }

  // NOTE: removal of all chips is handled by parent via the `closedAll` event.

  /** Handle click on the internal close-all button. */
  onCloseAllClicked(event: Event): void {
    event.stopPropagation();
    // Emit a single event for parents to clear their data source
    this.closedAll.emit();
  }
}
