import { Component, Input } from '@angular/core';

import { ICard } from '@shared/components/card/card.component';
import { CodeDisplayComponent } from '../code-display/code-display.component';

@Component({
  selector: 'app-demo-card',
  standalone: true,
  imports: [ICard, CodeDisplayComponent],
  template: `
    <i-card [title]="title">
      <div class="demo-card-content">
        <div class="demo-section">
          <ng-content></ng-content>
        </div>
      </div>
    </i-card>
    @if (sourceCode || tsCode || scssCode) {
      <app-code-display
        [sourceCode]="sourceCode || ''"
        [tsCode]="tsCode || ''"
        [scssCode]="scssCode || ''"
        [language]="language"
      ></app-code-display>
    }
  `,
  styles: [
    `
      .demo-card-content {
        padding: 20px 0;
      }

      .demo-section {
        margin-bottom: 20px;
      }
    `,
  ],
})
export class DemoCardComponent {
  @Input() title!: string;
  @Input() sourceCode?: string;
  @Input() tsCode?: string;
  @Input() scssCode?: string;
  @Input() language: 'html' | 'ts' | 'scss' = 'html';
}
