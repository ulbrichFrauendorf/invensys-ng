import { Component } from '@angular/core';

import { IMessage } from '../../../../../invensys-ng/src/lib/components/message/message.component';
import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [DemoPlaygroundComponent, DemoOptionDirective, IMessage],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  showClosableInfo = true;
  showClosableWarning = true;
  showClosableDanger = true;

  codeExamples = {
    severities: `<i-message severity="success">Operation completed successfully!</i-message>
<i-message severity="info">Here's some helpful information.</i-message>
<i-message severity="warning">Please review before proceeding.</i-message>
<i-message severity="danger">An error occurred. Please try again.</i-message>`,

    sizes: `<i-message severity="info" size="small">Small message</i-message>
<i-message severity="info" size="medium">Medium message (default)</i-message>
<i-message severity="info" size="large">Large message</i-message>`,

    closable: `<i-message severity="info" [closable]="true" [(visible)]="showMessage">
  This message can be dismissed.
</i-message>`,

    customIcon: `<i-message severity="primary" icon="pi pi-star">Featured content</i-message>
<i-message severity="info" icon="pi pi-bolt">Quick tip</i-message>`,

    richContent: `<i-message severity="warning">
  <strong>Action Required:</strong> Please update your payment method
  before <em>December 1st</em> to avoid service interruption.
</i-message>`,
  };

  resetClosableMessages(): void {
    this.showClosableInfo = true;
    this.showClosableWarning = true;
    this.showClosableDanger = true;
  }
}
