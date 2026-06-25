import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ISeverity } from '../../enums/IButtonSeverity';

@Component({
  selector: 'i-progress-spinner',
  imports: [NgClass],
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss'],
})
export class IProgressSpinner {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() strokeWidth = 4;
  @Input() ariaLabel = 'Loading';
  @Input() severity?: ISeverity;
  @Input() colorMode: 'accent' | 'text' = 'accent';

  get sizeClass(): string {
    return `spinner-${this.size}`;
  }

  get severityClass(): string {
    if (!this.severity) return '';
    if (this.colorMode === 'text') return `spinner--${this.severity}--text`;
    return `spinner--${this.severity}`;
  }
}
