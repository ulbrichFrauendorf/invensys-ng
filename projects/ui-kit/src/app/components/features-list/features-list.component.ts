import { Component, Input } from '@angular/core';

export interface Feature {
  title: string;
  description: string;
}

@Component({
  selector: 'app-features-list',
  imports: [],
  template: `
    <div class="features-grid">
      @for (feature of features; track feature.title) {
        <div class="feature-item">
          <strong>{{ feature.title }}:</strong>
          <span>{{ feature.description }}</span>
        </div>
      }
    </div>
  `,
  styleUrls: ['./features-list.component.scss'],
})
export class FeaturesListComponent {
  @Input() features: Feature[] = [];
}
