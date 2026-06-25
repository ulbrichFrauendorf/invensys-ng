import { Component, signal, OnInit } from '@angular/core';
import {
  IDynamicDialogConfig,
  IDynamicDialogRef,
} from '../dialog/services/dialog.interfaces';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { IDialogActions } from '../dialog/inner/dialog-actions/dialog-actions.component';
import { ISeverity } from '@shared/enums/IButtonSeverity';

/**
 * Confirmation Dialog Component
 *
 * A pre-built dialog component for confirmation prompts.
 * Uses signals for reactive state management and is typically opened via the dialog service.
 *
 * @example
 * ```typescript
 * // In your component:
 * constructor(private confirmationService: ConfirmationDialogService) {}
 *
 * deleteItem() {
 *   this.confirmationService.confirm({
 *     message: 'Are you sure you want to delete this item?',
 *     header: 'Confirm Delete',
 *     severity: 'danger',
 *     acceptLabel: 'Delete',
 *     rejectLabel: 'Cancel',
 *     accept: () => {
 *       // User confirmed
 *       this.performDelete();
 *     },
 *     reject: () => {
 *       // User cancelled
 *     }
 *   });
 * }
 * ```
 *
 * @remarks
 * This component is designed to be used with the dialog service
 * and should not typically be instantiated directly.
 * Uses Angular signals for efficient change detection.
 */
@Component({
  selector: 'i-confirmation-dialog',
  standalone: true,
  imports: [IDialogActions],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent implements OnInit {
  /**
   * Reference to the dialog instance
   * Injected by the dialog service
   * @internal
   */
  public dialogRef?: IDynamicDialogRef;

  /**
   * Dialog configuration containing data passed from the service
   * @internal
   */
  public config: IDynamicDialogConfig = {};

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-confirmation-dialog-');

  /**
   * Visual severity/style of the dialog
   * @default 'primary'
   */
  severity = signal<ISeverity>('primary');

  /**
   * Main message text displayed in the dialog body
   * @default ''
   */
  message = signal('');

  /**
   * Dialog header text
   * @default 'Are you sure?'
   */
  header = signal('Are you sure?');

  /**
   * Label for the accept/confirm button
   * @default 'Confirm'
   */
  acceptLabel: string = 'Confirm';

  /**
   * Label for the reject/cancel button
   * @default 'Cancel'
   */
  rejectLabel: string = 'Cancel';

  ngOnInit(): void {
    this.message.set(this.config.data?.message || '');
    this.header.set(this.config.data?.header || 'Are you sure?');
    this.severity.set(this.config.data?.severity || 'primary');
  }

  /**
   * Handles confirm button click
   * Closes dialog with true result
   * @internal
   */
  onConfirm(): void {
    this.dialogRef?.close(true);
  }

  /**
   * Handles cancel button click
   * Closes dialog with false result
   * @internal
   */
  onCancel(): void {
    this.dialogRef?.close(false);
  }
}
