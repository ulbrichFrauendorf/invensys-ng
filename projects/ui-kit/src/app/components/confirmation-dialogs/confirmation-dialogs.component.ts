import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ConfirmationDialogConfig,
  ConfirmationDialogService,
} from '@shared/components/confirmation-dialog/services/confirmation-dialog.service';
import { IButton } from '@shared/components/button/button.component';
import { ICheckbox } from '@shared/components/checkbox/checkbox.component';
import { ISeverity } from '@shared/enums/IButtonSeverity';
import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import {
  DemoOptionsDirective,
  DemoPreviewDirective,
  DemoUsageDirective,
} from '../demo-playground/demo-option.directive';

type DialogOption = keyof ConfirmationDialogConfig;

@Component({
  selector: 'app-confirmation-dialogs',
  imports: [
    FormsModule,
    IButton,
    ICheckbox,
    DemoPlaygroundComponent,
    DemoOptionsDirective,
    DemoPreviewDirective,
    DemoUsageDirective,
  ],
  templateUrl: './confirmation-dialogs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './confirmation-dialogs.component.scss',
})
export class ConfirmationDialogsComponent {
  private readonly confirmationService = inject(ConfirmationDialogService);

  readonly options: { key: DialogOption; label: string; hint?: string }[] = [
    { key: 'message', label: 'Message', hint: 'Required confirmation message.' },
    { key: 'header', label: 'Custom header', hint: 'Omit to use the default dialog heading.' },
    { key: 'severity', label: 'Severity', hint: 'Defaults to primary.' },
    { key: 'acceptLabel', label: 'Accept label', hint: 'Defaults to Confirm.' },
    { key: 'rejectLabel', label: 'Reject label', hint: 'Defaults to Cancel.' },
    { key: 'accept', label: 'Accept callback', hint: 'Run a callback when the user confirms.' },
    { key: 'reject', label: 'Reject callback', hint: 'Run a callback when the user cancels.' },
  ];
  readonly severities: ISeverity[] = [
    'primary', 'secondary', 'tertiary', 'success', 'info', 'warning', 'danger', 'contrast',
  ];
  readonly enabled = signal<Record<DialogOption, boolean>>({
    message: true,
    header: true,
    severity: false,
    acceptLabel: false,
    rejectLabel: false,
    accept: false,
    reject: false,
  });
  readonly values = signal({
    message: 'Are you sure you want to delete this item?',
    header: 'Confirm Delete',
    severity: 'danger' as ISeverity,
    acceptLabel: 'Delete item',
    rejectLabel: 'Keep item',
  });
  readonly result = signal('Open the dialog to try your selected options.');
  readonly opening = signal(false);
  readonly showCode = signal(false);

  readonly configuration = computed<ConfirmationDialogConfig>(() => {
    const enabled = this.enabled();
    const values = this.values();
    return {
      message: values.message,
      ...(enabled.header && { header: values.header }),
      ...(enabled.severity && { severity: values.severity }),
      ...(enabled.acceptLabel && { acceptLabel: values.acceptLabel }),
      ...(enabled.rejectLabel && { rejectLabel: values.rejectLabel }),
      ...(enabled.accept && { accept: () => this.result.set('Accepted. Accept callback executed.') }),
      ...(enabled.reject && { reject: () => this.result.set('Cancelled. Reject callback executed.') }),
    };
  });

  readonly code = computed(() => {
    const config = this.configuration();
    const properties = this.options
      .filter(option => this.enabled()[option.key])
      .map(({ key }) => {
        if (key === 'accept' || key === 'reject') {
          const message = key === 'accept' ? 'Accepted' : 'Cancelled';
          return `      ${key}: () => console.log('${message}'),`;
        }
        return `      ${key}: ${JSON.stringify(config[key])},`;
      })
      .join('\n');

    return `import { Component, inject } from '@angular/core';
import { ConfirmationDialogService, IButton } from 'invensys-ng';

@Component({
  selector: 'app-confirmation-example',
  imports: [IButton],
  template: \`<i-button (clicked)="openConfirmation()">Open confirmation</i-button>\`,
})
export class ConfirmationExampleComponent {
  private readonly confirmationService = inject(ConfirmationDialogService);

  async openConfirmation() {
    await this.confirmationService.confirm({
${properties}
    });
  }
}`;
  });

  setEnabled(key: DialogOption, enabled: boolean): void {
    if (key === 'message') return;
    this.enabled.update(options => ({ ...options, [key]: enabled }));
  }

  optionValue(key: DialogOption): string {
    return key === 'accept' || key === 'reject' ? '' : this.values()[key];
  }

  setValue(key: DialogOption, value: string): void {
    if (key === 'accept' || key === 'reject') return;
    if (key === 'severity') {
      const severity = this.severities.find(item => item === value);
      if (severity) this.values.update(values => ({ ...values, severity }));
      return;
    }
    this.values.update(values => ({ ...values, [key]: value }));
  }

  async openConfirmation(): Promise<void> {
    if (this.opening() || !this.values().message.trim()) return;
    this.opening.set(true);
    this.result.set('Waiting for a response…');
    const config = this.configuration();
    try {
      const ref = await this.confirmationService.confirm(config);
      ref.onClose.subscribe(result => {
        this.opening.set(false);
        if (result === true && !config.accept) this.result.set('Accepted. No accept callback selected.');
        else if (result === false && !config.reject) this.result.set('Cancelled. No reject callback selected.');
        else if (result !== true && result !== false) this.result.set('Dismissed without a decision.');
      });
    } catch {
      this.opening.set(false);
      this.result.set('The dialog could not be opened. Please try again.');
    }
  }
}
