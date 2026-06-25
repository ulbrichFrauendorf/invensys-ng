import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ISeverity } from '@shared/enums/IButtonSeverity';

export type MessageSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'i-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class IMessage {
  /**
   * Severity type of the message
   * @default 'info'
   */
  @Input() severity: ISeverity = 'info';

  /**
   * Size of the message
   * @default 'medium'
   */
  @Input() size: MessageSize = 'medium';

  /**
   * Icon to display (Material Icons)
   * If not provided, default icons based on severity will be used
   */
  @Input() icon?: string;

  /**
   * Whether the message can be closed
   * @default false
   */
  @Input() closable: boolean = false;

  /**
   * Whether the message is visible
   * @default true
   */
  @Input() visible: boolean = true;

  /**
   * Event emitted when visible changes (for two-way binding)
   */
  @Output() visibleChange = new EventEmitter<boolean>();

  /**
   * Get the default icon based on severity
   */
  getDefaultIcon(): string {
    if (this.icon) return this.icon;

    const iconMap: Record<ISeverity, string> = {
      success: 'pi pi-check-circle',
      info: 'pi pi-lightbulb',
      warning: 'pi pi-exclamation-triangle',
      danger: 'pi pi-times-circle',
      primary: 'pi pi-info-circle',
      secondary: 'pi pi-info-circle',
      tertiary: 'pi pi-info-circle',
      contrast: 'pi pi-info-circle',
    };

    return iconMap[this.severity] || 'pi pi-info-circle';
  }

  /**
   * Close the message
   */
  close(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
