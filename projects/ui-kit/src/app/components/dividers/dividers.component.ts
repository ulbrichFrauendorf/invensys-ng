import { Component } from '@angular/core';
import { IDivider } from '@shared/components/divider/divider.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-dividers',
  standalone: true,
  imports: [IDivider, DemoCardComponent, FeaturesListComponent],
  templateUrl: './dividers.component.html',
  styleUrl: './dividers.component.scss',
})
export class DividersComponent {
  codeExamples = {
    basic: `<i-divider />`,

    withContent: `<i-divider>Details</i-divider>
<i-divider align="start">Start</i-divider>
<i-divider align="center">Center</i-divider>
<i-divider align="end">End</i-divider>`,

    vertical: `<div class="vertical-example">
  <span>Left</span>
  <i-divider layout="vertical" />
  <span>Right</span>
</div>`,

    usage: `<section>
  <h3>Profile</h3>
  <p>Basic account information.</p>

  <i-divider>Permissions</i-divider>

  <p>Role and access settings.</p>
</section>`,
  };

  features: Feature[] = [
    {
      title: 'Horizontal Divider',
      description: 'Separates sections with a full-width horizontal rule',
    },
    {
      title: 'Content Projection',
      description: 'Optional label content can be projected into the divider',
    },
    {
      title: 'Alignment Options',
      description: 'Supports start, center, and end label alignment',
    },
    {
      title: 'Vertical Divider',
      description: 'Separates inline or flex content vertically',
    },
    {
      title: 'Accessible Separator',
      description: 'Uses separator semantics with matching aria orientation',
    },
    {
      title: 'Theme Aware',
      description: 'Uses design-system text and border colour variables',
    },
  ];
}
