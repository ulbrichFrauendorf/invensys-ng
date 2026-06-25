import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { ICard } from '../../../../../invensys-ng/src/lib/components/card/card.component';
import { IDialogActions } from '@shared/components/dialog/inner/dialog-actions/dialog-actions.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'i-cards',
  imports: [ICard, IDialogActions, DemoCardComponent, FeaturesListComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export class CardsComponent {
  private cdr = inject(ChangeDetectorRef);

  onSubmit() {
    throw new Error('Method not implemented.');
  }
  onCancel() {
    throw new Error('Method not implemented.');
  }
  showClosableCard = true;

  // Code examples organized by category
  codeExamples = {
    basic: `<i-card [title]="'Card Title'">
  <p>This is the card content in the body section.</p>
</i-card>`,

    withFooter: `<i-card [title]="'Card with Actions'">
  <p>This card includes footer content.</p>
  <div slot="footer">
    <i-dialog-actions
      (submitEvent)="onSubmit()"
      (cancelEvent)="onCancel()"
    />
  </div>
</i-card>`,

    customHeader: `<i-card>
  <div slot="header">
    <h3>Custom Header Content</h3>
  </div>
  <p>Using the header slot for custom content.</p>
</i-card>`,

    contentOnly: `<i-card>
  <p>Simple card with just content, no title or footer.</p>
</i-card>`,

    closable: `<i-card
  [title]="'Closable Card'"
  [closable]="true"
  (closeCard)="onCardClosed()">
  <p>This card can be closed using the X button.</p>
</i-card>`,

    fullHeight: `<!-- Container with fixed height -->
<div class="full-height-container">
  <i-card [title]="'Full Height Card'" [fullHeight]="true">
    <p>This card fills the height of its container.</p>
    <p>The body area becomes scrollable if content overflows.</p>
  </i-card>
</div>`,

    scrollable: `<!-- Container with fixed height -->
<div style="height: 300px;">
  <i-card [fullHeight]="true">
    <div>
      @for (paragraph of scrollableContent; track $index) {
        <p>{{ paragraph }}</p>
      }
    </div>
  </i-card>
</div>`,
  };

  // TypeScript code examples
  tsExamples = {
    closable: `import { ICard } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ICard],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  showCard = true;

  onCardClosed() {
    this.showCard = false;
  }
}`,
  };

  // SCSS code examples
  scssExamples = {
    fullHeight: `.full-height-container {
  height: 250px;
  border: 2px dashed var(--surface-400);
  border-radius: 8px;
  padding: 8px;
}`,

    scrollable: `.scrollable-card {
  .scrollable-content {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 8px;

    p {
      margin-bottom: 1rem;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}`,
  };

  // Sample content for scrollable demo
  scrollableContent = [
    "This card demonstrates scrollable content with the application's custom scrollbar styling.",
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.',
    'Sed non mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra.',
    'Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis.',
    'Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet.',
    'Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit.',
  ];

  features: Feature[] = [
    {
      title: 'Flexible Content',
      description:
        'Support for title, subtitle, body, header, and footer slots',
    },
    {
      title: 'Full Height Mode',
      description:
        'Set fullHeight to fill parent container height with scrollable body',
    },
    {
      title: 'Closable Cards',
      description: 'Optional close button with custom close event handling',
    },
    {
      title: 'Custom Headers',
      description: 'Use header slot for custom header content and layouts',
    },
    {
      title: 'Footer Actions',
      description: 'Footer slot for buttons and action elements',
    },
    {
      title: 'Minimal Design',
      description: 'Clean card design that fits any content',
    },
    {
      title: 'Responsive',
      description: 'Adapts to different screen sizes and containers',
    },
    {
      title: 'Theme Integration',
      description: 'Consistent styling with design system',
    },
    {
      title: 'Accessibility',
      description: 'Proper semantic structure and ARIA support',
    },
  ];

  onCardClosed() {
    this.showClosableCard = false;
    this.cdr.detectChanges();
    console.log('Card closed, will reappear in 3 seconds');

    // Reset after 3 seconds for demo purposes
    setTimeout(() => {
      this.showClosableCard = true;
      this.cdr.detectChanges();
      console.log('Card reshown');
    }, 3000);
  }
}
