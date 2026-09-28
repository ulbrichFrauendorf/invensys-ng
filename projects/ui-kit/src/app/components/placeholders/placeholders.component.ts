import { Component } from '@angular/core';

import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import {
  IPlaceholder,
  PlaceholderArrowDirection,
} from '@shared/components/placeholder/placeholder.component';
import { IButton } from '@shared/components/button/button.component';

@Component({
  selector: 'app-placeholders',
  standalone: true,
  imports: [DemoCardComponent, FeaturesListComponent, IPlaceholder, IButton],
  templateUrl: './placeholders.component.html',
  styleUrls: ['./placeholders.component.scss', '../shared-demo-styles.scss'],
})
export class PlaceholdersComponent {
  // Arrow directions for demo
  arrowDirections: PlaceholderArrowDirection[] = [
    'left',
    'right',
    'up',
    'down',
    'none',
  ];

  selectedDirection: PlaceholderArrowDirection = 'left';

  // Features list for the component
  features: Feature[] = [
    {
      title: 'Arrow Icons',
      description:
        'Built-in support for directional arrows (left, right, up, down) to guide users.',
    },
    {
      title: 'Custom Icons',
      description:
        'Use any PrimeIcons icon instead of arrows using the customIcon property.',
    },
    {
      title: 'Flexible Content',
      description:
        'Accepts any content via ng-content - text, HTML, or other components.',
    },
    {
      title: 'Pattern Background',
      description: 'Optional dotted pattern background for visual distinction.',
    },
    {
      title: 'Theme Integration',
      description:
        'Fully integrated with light and dark themes using CSS variables.',
    },
    {
      title: 'Smooth Animation',
      description: 'Subtle fade-in animation when the placeholder appears.',
    },
  ];

  // Code examples for demo cards
  codeExamples = {
    basic: `<!-- Basic placeholder with left arrow -->
<i-placeholder arrowDirection="left">
  Select an item from the list
</i-placeholder>`,

    directions: `<!-- Different arrow directions -->
<i-placeholder arrowDirection="left">Point left</i-placeholder>
<i-placeholder arrowDirection="right">Point right</i-placeholder>
<i-placeholder arrowDirection="up">Point up</i-placeholder>
<i-placeholder arrowDirection="down">Point down</i-placeholder>
<i-placeholder arrowDirection="none">No icon</i-placeholder>`,

    customIcon: `<!-- Custom icon instead of arrow -->
<i-placeholder [customIcon]="'pi pi-inbox'">
  Your inbox is empty
</i-placeholder>

<i-placeholder [customIcon]="'pi pi-search'">
  No search results found
</i-placeholder>`,

    richContent: `<!-- Rich content with HTML -->
<i-placeholder arrowDirection="left">
  <h3>Select a Conversation</h3>
  <p>Choose a conversation from the list to view messages</p>
</i-placeholder>`,

    withButton: `<!-- Placeholder with action button -->
<i-placeholder [customIcon]="'pi pi-folder-open'">
  <h3>No Projects Yet</h3>
  <p>Create your first project to get started</p>
  <i-button label="Create Project" icon="pi pi-plus"></i-button>
</i-placeholder>`,

    pattern: `<!-- With pattern background -->
<i-placeholder arrowDirection="left" [showPattern]="true">
  Drop files here to upload
</i-placeholder>`,

    splitView: `<!-- Common split-view pattern -->
<div class="split-layout">
  <div class="list-panel">
    <!-- Your list component here -->
  </div>
  <div class="detail-panel">
    <i-placeholder arrowDirection="left">
      <h3>Select an Item</h3>
      <p>Choose an item from the list to view details</p>
    </i-placeholder>
  </div>
</div>`,
  };

  onCreateProject(): void {
    alert('Create project clicked!');
  }
}
