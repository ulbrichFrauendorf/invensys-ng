import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IButton } from '../../../button/button.component';
import { ISeverity } from '../../../../enums/IButtonSeverity';

@Component({
  selector: 'i-dialog-actions',
  imports: [IButton],
  templateUrl: './dialog-actions.component.html',
  styleUrl: './dialog-actions.component.scss',
})
export class IDialogActions {
  @Input() submitLabel = 'Submit';
  @Input() cancelLabel = 'Cancel';
  @Input() severity: ISeverity = 'primary';
  @Input() showCancel = true;
  @Input() showSubmit = true;
  @Input() submitDisabled = false;
  /** Show progress and prevent repeated submission while a request is pending. */
  @Input() submitLoading = false;
  /** Use an outlined action when the dialog is secondary to another workflow. */
  @Input() submitOutlined = false;
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();

  onCancel() {
    this.cancelEvent.emit();
  }

  onSubmit() {
    if (!this.submitDisabled && !this.submitLoading) this.submitEvent.emit();
  }
}
