import { Component } from '@angular/core';
import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';
import { WhisperService } from '../../../../../invensys-ng/src/lib/components/whisper/services/whisper.service';
import { IWhisper } from '../../../../../invensys-ng/src/lib/components/whisper/whisper.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import { IWhisperMessage } from '../../../../../invensys-ng/src/lib/components/whisper/services/whisper.interfaces';
import { ISeverity } from '@shared/enums/IButtonSeverity';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-whispers',
  imports: [IButton, IWhisper, DemoCardComponent, FeaturesListComponent],
  templateUrl: './whispers.component.html',
  styleUrl: './whispers.component.scss',
})
export class WhispersComponent {
  constructor(private whisperService: WhisperService) {}

  // Example messages for different severities
  messageExamples = {
    success: {
      severity: 'success' as ISeverity,
      summary: 'Success',
      detail: 'Your action was completed successfully.',
      key: 'global',
      closable: false,
      life: 30000,
    },
    info: {
      severity: 'info' as ISeverity,
      summary: 'Information',
      detail: 'Here is some helpful information for you.',
      key: 'global',
      life: 30000,
    },
    warning: {
      severity: 'warning' as ISeverity,
      summary: 'Warning',
      detail: 'Please review your input before proceeding.',
      key: 'global',
      life: 30000,
    },
    error: {
      severity: 'danger' as ISeverity,
      summary: 'Error',
      detail: 'Something went wrong. Please try again.',
      key: 'global',
      life: 5000,
    },
  };

  showSuccessMessage(): void {
    this.whisperService.add(this.messageExamples.success);
  }

  showInfoMessage(): void {
    this.whisperService.add(this.messageExamples.info);
  }

  showWarningMessage(): void {
    this.whisperService.add(this.messageExamples.warning);
  }

  showErrorMessage(): void {
    this.whisperService.add(this.messageExamples.error);
  }

  showStickyMessage(): void {
    this.whisperService.add({
      severity: 'info',
      summary: 'Sticky Message',
      detail: 'This message will stay until manually closed.',
      key: 'global',
      sticky: true,
    });
  }

  showMultipleMessages(): void {
    const messages: IWhisperMessage[] = [
      {
        severity: 'success',
        summary: 'First Success',
        detail: 'This is the first message.',
        key: 'left',
        life: 2000,
      },
      {
        severity: 'info',
        summary: 'Second Info',
        detail: 'This is the second message.',
        key: 'right',
        life: 30000,
      },
      {
        severity: 'warning',
        summary: 'Third Warning',
        detail: 'This is the third message.',
        key: 'global',
        life: 4000,
      },
    ];
    this.whisperService.addAll(messages);
  }

  clearAllMessages(): void {
    this.whisperService.clear();
  }

  showLeftMessage(): void {
    this.whisperService.add({
      severity: 'info',
      summary: 'Left Side Message',
      detail: 'This message appears on the left side.',
      key: 'left',
      life: 5000,
    });
  }

  showRightMessage(): void {
    this.whisperService.add({
      severity: 'success',
      summary: 'Right Side Message',
      detail: 'This message appears on the right side.',
      key: 'right',
      life: 5000,
    });
  }

  showGlobalMessage(): void {
    this.whisperService.add({
      severity: 'info',
      summary: 'Global Message',
      detail: 'This message appears in the center container.',
      key: 'global',
      life: 5000,
    });
  }

  showStackingDemo(): void {
    // Show multiple messages without keys to demonstrate stacking
    setTimeout(() => {
      this.whisperService.add({
        severity: 'info',
        summary: 'First Message',
        detail: 'This is the first message in the stack.',
        key: 'global',
        life: 8000,
      });
    }, 0);

    setTimeout(() => {
      this.whisperService.add({
        severity: 'success',
        summary: 'Second Message',
        detail: 'This is the second message in the stack.',
        key: 'global',
        life: 8000,
      });
    }, 500);

    setTimeout(() => {
      this.whisperService.add({
        severity: 'warning',
        summary: 'Third Message',
        detail: 'This is the third message in the stack.',
        key: 'global',
        life: 8000,
      });
    }, 1000);
  }

  // Usage example similar to your request
  simulateUserLinkAction(): void {
    // Simulate an async action
    setTimeout(() => {
      this.whisperService.add({
        severity: 'success',
        summary: 'User Link Success',
        detail: 'The selected users have been linked.',
        key: 'global',
        life: 30000,
      });
    }, 1000);
  }

  // HTML Code examples
  codeExamples = {
    basic: `<!-- Add whisper container to your app.component.html -->
<i-whisper></i-whisper>

<!-- Different positions -->
<i-whisper position="top-right"></i-whisper>
<i-whisper position="top-left" key="left"></i-whisper>
<i-whisper position="bottom-center"></i-whisper>`,

    buttons: `<i-button (click)="showSuccessMessage()" severity="success">
  Show Success
</i-button>
<i-button (click)="showErrorMessage()" severity="danger">
  Show Error
</i-button>
<i-button (click)="showStickyMessage()" severity="info">
  Show Sticky
</i-button>`,

    positioning: `<!-- Different positions -->
<i-whisper position="top-right"></i-whisper>
<i-whisper position="top-left" key="left"></i-whisper>
<i-whisper position="bottom-center"></i-whisper>

<!-- Key-based filtering -->
<i-whisper key="notifications"></i-whisper>  <!-- Only shows messages with key="notifications" -->
<i-whisper></i-whisper>                       <!-- Only shows messages with no key -->`,

    keyed: `<!-- Key-based filtering -->
<i-whisper key="notifications"></i-whisper>
<i-whisper key="alerts"></i-whisper>
<i-whisper></i-whisper> <!-- Shows unkeyed messages -->`,
  };

  // TypeScript examples
  tsExamples = {
    basic: `import { WhisperService } from 'invensys-ng';
import { IWhisper } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IWhisper],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  constructor(private whisperService: WhisperService) {}
}`,

    usage: `// Show success message
showSuccessMessage() {
  this.whisperService.add({
    severity: 'success',
    summary: 'User Link Success',
    detail: 'The selected users have been linked.',
    key: 'global',
    life: 30000
  });
}

// Show error message
showErrorMessage() {
  this.whisperService.add({
    severity: 'danger',
    summary: 'Error',
    detail: 'Something went wrong. Please try again.',
    life: 5000
  });
}`,

    advanced: `// Messages with keys for specific containers
showKeyedMessages() {
  this.whisperService.add({
    severity: 'info',
    summary: 'Left Message',
    detail: 'Shows in left whisper container',
    key: 'left',
    life: 5000
  });

  // Multiple messages
  const messages = [
    { severity: 'success', summary: 'First', detail: 'Message 1', key: 'left' },
    { severity: 'info', summary: 'Second', detail: 'Message 2', key: 'right' },
    { severity: 'warning', summary: 'Third', detail: 'Global message' }
  ];
  this.whisperService.addAll(messages);
}

// Clear messages by key
clearMessages() {
  this.whisperService.clear('left');  // Clear only left messages
  this.whisperService.clear();        // Clear all messages
}`,
  };

  // Component setup
  initializationCode = `import { WhisperService } from 'invensys-ng';
import { IWhisper } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [IWhisper],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  constructor(private whisperService: WhisperService) {}

  showMessage() {
    this.whisperService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Operation completed successfully'
    });
  }
}`;

  features: Feature[] = [
    {
      title: 'Multiple Severities',
      description: 'Success, info, warning, error, and custom message types',
    },
    {
      title: 'Auto-dismiss',
      description: 'Configurable auto-dismiss timing with life property',
    },
    {
      title: 'Sticky Messages',
      description: 'Messages that stay until manually closed',
    },
    {
      title: 'Positioning',
      description: 'Six different positioning options around the screen',
    },
    {
      title: 'Keyed Messages',
      description:
        'Route messages to specific whisper containers using keys. Keyed containers show only matching messages, unkeyed containers show only unkeyed messages',
    },
    {
      title: 'Custom Icons',
      description: 'Override default icons with Material Icons',
    },
    {
      title: 'Animations',
      description: 'Smooth slide-in and slide-out animations',
    },
    {
      title: 'Responsive',
      description: 'Mobile-friendly responsive design',
    },
  ];
}
