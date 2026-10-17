import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NoContentComponent as INoContent } from '../../../../../invensys-ng/src/lib/components/no-content/no-content.component';

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-no-content',
  standalone: true,
  imports: [DemoPlaygroundComponent, DemoOptionDirective, INoContent],
  templateUrl: './no-content.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

}
