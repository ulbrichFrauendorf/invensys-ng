import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { DialogService } from '../../dialog/services/dialog.service';
import { IDynamicDialogRef } from '../../dialog/services/dialog.interfaces';
import { ISeverity } from '@shared/enums/IButtonSeverity';

/**
 * Configuration options for confirmation dialogs.
 */
export interface ConfirmationDialogConfig {
  /** The visual severity/style of the confirmation dialog (e.g., 'primary', 'danger', 'warning'). Defaults to 'primary' */
  severity?: ISeverity;

  /** The confirmation message to display to the user */
  message: string;

  /** Optional header text for the dialog title bar */
  header?: string;

  /** Custom label for the accept/confirm button. Defaults to 'Confirm' */
  acceptLabel?: string;

  /** Custom label for the reject/cancel button. Defaults to 'Cancel' */
  rejectLabel?: string;

  /** Callback function executed when the user accepts/confirms the dialog */
  accept?: () => void;

  /** Callback function executed when the user rejects/cancels the dialog */
  reject?: () => void;
}

/**
 * Service for displaying confirmation dialogs to users.
 *
 * This service provides a simplified API for showing confirmation dialogs with
 * accept/reject actions. It automatically handles dialog creation, button labels,
 * and callback execution based on user choice.
 *
 * @example
 * ```typescript
 * constructor(private confirmationService: ConfirmationDialogService) {}
 *
 * deleteItem() {
 *   this.confirmationService.confirm({
 *     header: 'Delete Confirmation',
 *     message: 'Are you sure you want to delete this item?',
 *     severity: 'danger',
 *     acceptLabel: 'Delete',
 *     rejectLabel: 'Cancel',
 *     accept: () => {
 *       this.performDelete();
 *     },
 *     reject: () => {
 *       console.log('Delete cancelled');
 *     }
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Simple confirmation without callbacks
 * async confirmAction() {
 *   const ref = await this.confirmationService.confirm({
 *     message: 'Proceed with this action?',
 *     header: 'Confirm Action'
 *   });
 *
 *   ref.onClose.subscribe(result => {
 *     if (result === true) {
 *       // User accepted
 *       this.performAction();
 *     }
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(private dialogService: DialogService) {}

  /** Label for the accept button. Set internally based on config */
  acceptLabel?: string;

  /** Label for the reject button. Set internally based on config */
  rejectLabel?: string;

  /**
   * Displays a confirmation dialog and handles user response.
   *
   * Opens a modal confirmation dialog with the specified message and options.
   * The dialog shows two buttons (accept and reject) and executes the appropriate
   * callback based on user choice. The confirmation component is lazy-loaded for
   * better performance.
   *
   * @param config Configuration object defining the dialog appearance and behavior
   * @returns A Promise that resolves to a dialog reference for programmatic control
   *
   * @example
   * ```typescript
   * // Basic confirmation
   * this.confirmationService.confirm({
   *   message: 'Delete this record?',
   *   header: 'Confirm Delete',
   *   accept: () => this.delete()
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Confirmation with custom styling and labels
   * await this.confirmationService.confirm({
   *   header: 'Warning',
   *   message: 'This action cannot be undone. Continue?',
   *   severity: 'danger',
   *   acceptLabel: 'Yes, Continue',
   *   rejectLabel: 'No, Go Back',
   *   accept: () => {
   *     this.performIrreversibleAction();
   *   },
   *   reject: () => {
   *     this.logCancellation();
   *   }
   * });
   * ```
   */
  async confirm(config: ConfirmationDialogConfig): Promise<IDynamicDialogRef> {
    const { ConfirmationDialogComponent } =
      await import('../confirmation-dialog.component');

    this.acceptLabel = config.acceptLabel || 'Confirm';
    this.rejectLabel = config.rejectLabel || 'Cancel';

    const ref = this.dialogService.open(ConfirmationDialogComponent, {
      header: config.header,
      width: '400px',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': { width: '720px' },
        '640px': { width: '576px' },
      },
      data: {
        message: config.message,
        header: config.header,
        severity: config.severity || 'primary',
      },
    });

    // Subscribe to dialog close event to execute callbacks
    ref.onClose.pipe(take(1)).subscribe((result: boolean) => {
      if (result === true && config.accept) {
        config.accept();
      } else if (result === false && config.reject) {
        config.reject();
      }
    });

    return ref;
  }
}
