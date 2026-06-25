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
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();

  onCancel() {
    this.cancelEvent.emit();
  }

  onSubmit() {
    this.submitEvent.emit();
  }
}
