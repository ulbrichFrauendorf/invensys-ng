import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICard } from '../card/card.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { AbstractDialog } from './dialog-base';

/**
 * Dialog Component
 *
 * A modal dialog component for displaying content in an overlay.
 * Supports customizable header, dimensions, and close behavior.
 *
 * @example
 * ```html
 * <!-- Basic dialog -->
 * <i-dialog
 *   [(visible)]="displayDialog"
 *   header="Dialog Title">
 *   <p>Dialog content goes here</p>
 * </i-dialog>
 *
 * <!-- Dialog with custom width -->
 * <i-dialog
 *   [(visible)]="showDialog"
 *   header="Custom Size"
 *   width="480px"
 *   height="320px">
 *   <p>Content</p>
 * </i-dialog>
 *
 * <!-- Non-modal dialog -->
 * <i-dialog
 *   [(visible)]="displayDialog"
 *   [modal]="false"
 *   header="Non-Modal">
 *   <p>Click outside won't close this</p>
 * </i-dialog>
 *
 * <!-- Non-closable dialog -->
 * <i-dialog
 *   [(visible)]="displayDialog"
 *   [closable]="false"
 *   header="Cannot Close">
 *   <p>Must interact with dialog to close</p>
 *   <button (click)="displayDialog = false">OK</button>
 * </i-dialog>
 * ```
 *
 * @remarks
 * The dialog automatically manages body scroll lock when visible.
 * Press Escape to close if closable is true.
 */
@Component({
  selector: 'i-dialog',
  imports: [CommonModule, ICard],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class IDialog extends AbstractDialog implements OnInit, OnDestroy {
  /**
   * Reference to the dialog element for positioning and styling
   * @internal
   */
  @ViewChild('dialogElement', { static: false }) dialogElement?: ElementRef;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-dialog-');

  /**
   * Current applied width from breakpoints
   * @internal
   */
  currentWidth: string = '';

  /**
   * Current applied height from breakpoints
   * @internal
   */
  currentHeight: string = '';

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    if (this.visible) {
      this.show();
    }
    this.applyBreakpoints();
  }

  ngOnDestroy(): void {
    this.hide();
  }

  /**
   * Shows the dialog and locks body scroll
   */
  show(): void {
    this.visible = true;
    this.visibleChange.emit(true);
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }

  /**
   * Hides the dialog and unlocks body scroll
   */
  hide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    document.body.style.overflow = '';
  }

  /**
   * Handles Escape key press to close dialog
   * @internal
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.closable && this.visible) {
      this.hide();
    }
  }

  /**
   * Handles overlay click to close modal dialog.
   * Only fires when [dismissableMask]="true" is set — by default dialogs
   * are not closed by clicking the backdrop.
   * @internal
   */
  onOverlayClick(event: Event): void {
    // Check if click was directly on overlay (not on dialog container or its children)
    const target = event.target as HTMLElement;
    const overlay = event.currentTarget as HTMLElement;

    if (
      this.modal &&
      this.closable &&
      this.dismissableMask &&
      target === overlay
    ) {
      this.hide();
    }
  }

  /**
   * Handles close button click
   * @internal
   */
  onCloseClick(): void {
    if (this.closable) {
      this.hide();
    }
  }

  /**
   * Handles window resize to apply responsive breakpoints
   * @internal
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this.applyBreakpoints();
  }

  /**
   * Applies responsive breakpoints based on current window width
   * @internal
   */
  private applyBreakpoints(): void {
    if (!this.breakpoints) {
      this.currentWidth = this.width;
      this.currentHeight = this.height || '';
      return;
    }

    const windowWidth = window.innerWidth;
    const sortedBreakpoints = Object.keys(this.breakpoints)
      .map((key) => ({
        breakpoint: parseInt(key),
        value: this.breakpoints![key],
      }))
      .sort((a, b) => b.breakpoint - a.breakpoint);

    // Find the first matching breakpoint
    const match = sortedBreakpoints.find((bp) => windowWidth <= bp.breakpoint);

    if (match) {
      // Object format with width and/or height
      this.currentWidth = match.value.width || this.width;
      this.currentHeight = match.value.height || this.height || '';
    } else {
      // No breakpoint matched, use default values
      this.currentWidth = this.width;
      this.currentHeight = this.height || '';
    }

    this.cdr.detectChanges();
  }
}
