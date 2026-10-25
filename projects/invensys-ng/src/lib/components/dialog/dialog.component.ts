import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dialog.component.scss',
})
export class IDialog extends AbstractDialog implements OnInit, OnDestroy, OnChanges {
  private static readonly openDialogs: IDialog[] = [];
  private static readonly scrollLocks = new WeakMap<
    Document,
    { count: number; overflow: string }
  >();
  private readonly document = inject(DOCUMENT);
  private readonly overlayService = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private overlayRef?: OverlayRef;
  private overlay?: HTMLElement;
  private initialized = false;
  private scrollLocked = false;
  private previousFocus?: HTMLElement;

  @ViewChild('dialogTemplate', { static: true }) private dialogTemplate!: TemplateRef<unknown>;

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

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.initialized = true;
    if (this.visible) this.attachOverlay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.initialized) {
      if (this.visible) this.attachOverlay();
      else this.detachOverlay();
    }
    if (changes['modal'] && this.overlay) {
      this.updateScrollLock();
    }
  }

  ngOnDestroy(): void {
    this.detachOverlay();
  }

  private attachOverlay(): void {
    if (this.overlayRef) return;
    this.previousFocus = this.document.activeElement as HTMLElement | undefined;
    // Share the CDK layer with connected dropdowns and escape ancestor stacking contexts.
    this.overlayRef = this.overlayService.create();
    this.overlayRef.attach(new TemplatePortal(this.dialogTemplate, this.viewContainerRef));
    this.overlay = this.overlayRef.overlayElement.querySelector<HTMLElement>('.i-dialog-overlay')!;
    IDialog.openDialogs.push(this);
    this.updateScrollLock();
    this.overlay.querySelector<HTMLElement>('.i-dialog-container')?.focus({ preventScroll: true });
  }

  private detachOverlay(): void {
    if (!this.overlay) return;
    const overlay = this.overlay;
    const restoreFocus = overlay.contains(this.document.activeElement);
    const index = IDialog.openDialogs.indexOf(this);
    if (index !== -1) IDialog.openDialogs.splice(index, 1);
    this.releaseScrollLock();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.overlay = undefined;
    if (restoreFocus && this.previousFocus?.isConnected) {
      this.previousFocus.focus({ preventScroll: true });
    }
    this.previousFocus = undefined;
  }

  private updateScrollLock(): void {
    if (!this.modal) {
      this.releaseScrollLock();
      return;
    }
    if (this.scrollLocked) return;
    const lock = IDialog.scrollLocks.get(this.document) ?? {
      count: 0,
      overflow: this.document.body.style.overflow,
    };
    lock.count++;
    IDialog.scrollLocks.set(this.document, lock);
    this.document.body.style.overflow = 'hidden';
    this.scrollLocked = true;
  }

  private releaseScrollLock(): void {
    if (!this.scrollLocked) return;
    const lock = IDialog.scrollLocks.get(this.document)!;
    if (--lock.count === 0) {
      this.document.body.style.overflow = lock.overflow;
      IDialog.scrollLocks.delete(this.document);
    }
    this.scrollLocked = false;
  }

  /**
   * Shows the dialog and locks body scroll
   */
  show(): void {
    this.visible = true;
    this.cdr.detectChanges();
    this.attachOverlay();
    this.cdr.detectChanges();
    this.visibleChange.emit(true);
  }

  /**
   * Hides the dialog and unlocks body scroll
   */
  hide(): void {
    this.visible = false;
    this.detachOverlay();
    this.cdr.detectChanges();
    this.visibleChange.emit(false);
  }

  /**
   * Handles Escape key press to close dialog
   * @internal
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event?: Event): void {
    const topDialog = IDialog.openDialogs.at(-1);
    if (event?.defaultPrevented || (topDialog && topDialog !== this)) return;
    if (this.visible) {
      event?.preventDefault();
      if (this.closable) this.hide();
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

    if (this.modal && this.closable && this.dismissableMask && target === overlay) {
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
}
