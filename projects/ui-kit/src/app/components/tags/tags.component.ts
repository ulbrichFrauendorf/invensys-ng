import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ITag } from '@shared/components/tag/tag.component';
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

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [DemoPlaygroundComponent, DemoOptionDirective, ITag],
  templateUrl: './tags.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

}
