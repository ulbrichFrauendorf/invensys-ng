import { Component } from '@angular/core';
import { ITag } from '@shared/components/tag/tag.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import { ISeverity } from '@shared/enums/IButtonSeverity';

interface TagExample {
  value: string;
  severity?: ISeverity;
  icon?: string;
  rounded?: boolean;
}

const ALL_SEVERITIES: ISeverity[] = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'info',
  'warning',
  'danger',
  'contrast',
];

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [ITag, DemoCardComponent, FeaturesListComponent],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent {
  severities = ALL_SEVERITIES;

  // Rounded severity examples
  roundedExamples: TagExample[] = ALL_SEVERITIES.map((s) => ({
    value: s.charAt(0).toUpperCase() + s.slice(1),
    severity: s,
    rounded: true,
  }));

  // Icon examples
  iconExamples: TagExample[] = [
    { value: 'Saved', severity: 'success', icon: 'pi pi-check', rounded: true },
    {
      value: 'Pending',
      severity: 'warning',
      icon: 'pi pi-clock',
      rounded: true,
    },
    { value: 'Error', severity: 'danger', icon: 'pi pi-times', rounded: true },
    { value: 'New', severity: 'info', icon: 'pi pi-sparkles', rounded: true },
    { value: 'Beta', severity: 'secondary', icon: 'pi pi-tag', rounded: true },
    {
      value: 'Live',
      severity: 'primary',
      icon: 'pi pi-circle-fill',
      rounded: true,
    },
  ];

  codeExamples = {
    basic: `<i-tag value="Default" />
<i-tag value="Primary" severity="primary" />
<i-tag value="Success" severity="success" />
<i-tag value="Warning" severity="warning" />
<i-tag value="Danger" severity="danger" />
<i-tag value="Info" severity="info" />`,

    rounded: `<i-tag value="Primary" severity="primary" [rounded]="true" />
<i-tag value="Success" severity="success" [rounded]="true" />
<i-tag value="Warning" severity="warning" [rounded]="true" />
<i-tag value="Danger" severity="danger" [rounded]="true" />`,

    withIcon: `<i-tag value="Saved" severity="success" icon="pi pi-check" [rounded]="true" />
<i-tag value="Pending" severity="warning" icon="pi pi-clock" [rounded]="true" />
<i-tag value="Error" severity="danger" icon="pi pi-times" [rounded]="true" />
<i-tag value="Beta" severity="info" icon="pi pi-tag" [rounded]="true" />`,

    sizes: `<i-tag value="Small" severity="primary" size="sm" />
<i-tag value="Medium" severity="primary" />
<i-tag value="Large" severity="primary" size="lg" />`,

    usage: `<!-- Status badges in a table row -->
<span>Order #1042</span>
<i-tag value="Shipped" severity="info" [rounded]="true" />

<!-- Feature flags -->
<i-tag value="Beta" severity="warning" icon="pi pi-flask" [rounded]="true" />

<!-- Saved/unsaved indicator -->
<i-tag value="Saved" severity="success" icon="pi pi-check" [rounded]="true" />`,
  };

  features: Feature[] = [
    {
      title: 'Severity Colours',
      description:
        'All 8 design-system severities: primary, secondary, tertiary, success, info, warning, danger, contrast',
    },
    {
      title: 'Rounded Pill',
      description: 'Optional pill shape for a softer look',
    },
    {
      title: 'Icon Support',
      description: 'Optional PrimeNg icon displayed before the value text',
    },
    {
      title: 'Three Sizes',
      description: 'sm, md (default), and lg sizes',
    },
    {
      title: 'Dark Mode',
      description: 'Translucent severity backgrounds adapt automatically',
    },
    {
      title: 'Lightweight',
      description: 'Pure CSS, no animations or dependencies beyond the theme',
    },
  ];
}
