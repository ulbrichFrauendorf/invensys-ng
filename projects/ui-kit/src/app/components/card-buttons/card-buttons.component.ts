import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ICardButton } from '@shared/components/card-button/card-button.component';
import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-card-buttons',
  imports: [DemoPlaygroundComponent, DemoOptionDirective, ICardButton],
  templateUrl: './card-buttons.component.html',
  styleUrl: './card-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardButtonsComponent {
  readonly activeTool = signal('password');
  readonly cardTools = [
    { key: 'password', title: 'Add password', description: 'Protect your PDFs with a password', icon: 'pi pi-lock' },
    { key: 'watermark', title: 'Add watermark', description: 'Add your text to every page', icon: 'pi pi-pencil' },
  ];

  readonly codeExamples = {
    cardButton: `@for (tool of tools; track tool.key) {
  <i-card-button [fullHeight]="true" [selected]="activeTool() === tool.key"
    ariaControls="tool-panel" (clicked)="activeTool.set(tool.key)">
    <i [class]="tool.icon" aria-hidden="true"></i>
    <h2>{{ tool.title }}</h2>
    <p>{{ tool.description }}</p>
  </i-card-button>
}`,
    cardLink: `<!-- Import ICardButton from 'invensys-ng'. -->
<i-card-button routerLink="/components/file-uploads" [fullHeight]="true">
  <h3>File uploads</h3><p>Browse upload examples.</p>
</i-card-button>
<i-card-button [disabled]="true"><h3>Coming soon</h3></i-card-button>`,
  };
}
