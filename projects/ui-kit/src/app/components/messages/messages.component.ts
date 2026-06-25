import { Component } from '@angular/core';

import { IMessage } from '../../../../../invensys-ng/src/lib/components/message/message.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [IMessage, DemoCardComponent, FeaturesListComponent],
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

  features: Feature[] = [
    {
      title: 'Multiple Severities',
      description:
        'Success, info, warning, danger, and primary message types with semantic colors',
    },
    {
      title: 'Three Sizes',
      description:
        'Small, medium (default), and large sizes for different contexts',
    },
    {
      title: 'Closable Messages',
      description: 'Optional close button with two-way binding support',
    },
    {
      title: 'Custom Icons',
      description: 'Override default severity icons with any PrimeIcon',
    },
    {
      title: 'Rich Content',
      description: 'Supports HTML content including bold, italic, and links',
    },
    {
      title: 'Accessible',
      description: 'ARIA role="alert" for screen reader announcements',
    },
  ];

  resetClosableMessages(): void {
    this.showClosableInfo = true;
    this.showClosableWarning = true;
    this.showClosableDanger = true;
  }
}
