import { Component } from '@angular/core';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import { NoContentComponent as INoContent } from '../../../../../invensys-ng/src/lib/components/no-content/no-content.component';

@Component({
  selector: 'app-no-content',
  standalone: true,
  imports: [DemoCardComponent, FeaturesListComponent, INoContent],
  templateUrl: './no-content.component.html',
  styleUrl: './no-content.component.scss',
})
export class NoContentComponent {
  // Code examples
  codeExamples = {
    basic: `<i-no-content></i-no-content>`,

    customMessage: `<i-no-content
  [message]="'No products found'">
</i-no-content>`,

    customIcon: `<i-no-content
  [icon]="'pi pi-search'"
  [message]="'No search results'">
</i-no-content>`,

    inTable: `<i-table [data]="emptyData" [columns]="columns">
  <!-- Table automatically shows no-content when empty -->
</i-table>`,

    inList: `<div class="list-container">
  @if (items.length === 0) {
    <i-no-content
      [icon]="'pi pi-inbox'"
      [message]="'No items to display'">
    </i-no-content>
  }
</div>`,

    searchResults: `<div class="search-results">
  @if (searchResults.length === 0) {
    <i-no-content
      [icon]="'pi pi-search'"
      [message]="'No results found for your search'">
    </i-no-content>
  }
</div>`,

    notifications: `<div class="notifications-panel">
  @if (notifications.length === 0) {
    <i-no-content
      [icon]="'pi pi-bell'"
      [message]="'No new notifications'">
    </i-no-content>
  }
</div>`,

    cart: `<div class="shopping-cart">
  @if (cartItems.length === 0) {
    <i-no-content
      [icon]="'pi pi-shopping-cart'"
      [message]="'Your cart is empty'">
    </i-no-content>
  }
</div>`,
  };

  // TypeScript initialization example
  initializationCode = `import { NoContentComponent } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [NoContentComponent],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  items: any[] = [];
}`;

  // Features list
  features: Feature[] = [
    {
      title: 'Customizable Icon',
      description:
        'Choose from any PrimeIcons to match your content type (default: pi-inbox)',
    },
    {
      title: 'Custom Message',
      description:
        'Provide a contextual message to guide users (default: "No content available")',
    },
    {
      title: 'Versatile Usage',
      description:
        'Can be used in tables, lists, search results, or any empty state scenario',
    },
    {
      title: 'Consistent Design',
      description:
        'Maintains a consistent empty state experience across your application',
    },
    {
      title: 'Lightweight',
      description: 'Simple, focused component with minimal overhead',
    },
    {
      title: 'Responsive',
      description: 'Adapts to different container sizes and layouts',
    },
  ];
}
