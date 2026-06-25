import { Component } from '@angular/core';

import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import { ITabs } from '@shared/components/tabs/tabs.component';
import { ITabPanel } from '@shared/components/tabs/tab-panel.component';

@Component({
  selector: 'app-tabs',
  imports: [ITabs, ITabPanel, DemoCardComponent, FeaturesListComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  // Active tab indices for each demo
  textOnlyActiveIndex = 0;
  iconOnlyActiveIndex = 0;
  iconTextActiveIndex = 0;
  disabledActiveIndex = 0;
  closableActiveIndex = 0;

  // Closable tabs data
  closableTabs = [
    { header: 'Document 1', icon: 'pi pi-file' },
    { header: 'Document 2', icon: 'pi pi-file' },
    { header: 'Document 3', icon: 'pi pi-file' },
  ];

  // Code examples
  codeExamples = {
    textOnly: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel header="Home">Home content</i-tab-panel>
  <i-tab-panel header="Profile">Profile content</i-tab-panel>
  <i-tab-panel header="Settings">Settings content</i-tab-panel>
</i-tabs>`,

    iconOnly: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel icon="pi pi-home">
    <!-- Panel content shown when tab is selected -->
    Home panel content
  </i-tab-panel>
  <i-tab-panel icon="pi pi-user">User panel content</i-tab-panel>
  <i-tab-panel icon="pi pi-cog">Settings panel content</i-tab-panel>
</i-tabs>`,

    iconText: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel header="Home" icon="pi pi-home">Home content</i-tab-panel>
  <i-tab-panel header="Profile" icon="pi pi-user">Profile content</i-tab-panel>
  <i-tab-panel header="Settings" icon="pi pi-cog">Settings content</i-tab-panel>
</i-tabs>`,

    disabled: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel header="Active" icon="pi pi-check">Active content</i-tab-panel>
  <i-tab-panel header="Disabled" icon="pi pi-ban" [disabled]="true">
    This content won't be visible
  </i-tab-panel>
  <i-tab-panel header="Another" icon="pi pi-star">Another content</i-tab-panel>
</i-tabs>`,

    closable: `<i-tabs [(activeIndex)]="activeTab" (onClose)="onTabClose($event)">
  <i-tab-panel header="Document 1" icon="pi pi-file" [closable]="true">
    Document 1 content
  </i-tab-panel>
  <i-tab-panel header="Document 2" icon="pi pi-file" [closable]="true">
    Document 2 content
  </i-tab-panel>
</i-tabs>`,
  };

  // TypeScript examples
  tsExamples = {
    basic: `import { ITabs, ITabPanel } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ITabs, ITabPanel],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  activeTab = 0;
}`,

    closable: `import { ITabs, ITabPanel } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ITabs, ITabPanel],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  activeTab = 0;

  onTabClose(event: { originalEvent: Event; index: number }) {
    // Handle tab close - remove from array, etc.
    console.log('Tab closed at index:', event.index);
  }
}`,
  };

  features: Feature[] = [
    {
      title: 'Text-Only Tabs',
      description: 'Display tabs with text labels only',
    },
    {
      title: 'Icon-Only Tabs',
      description: 'Display compact tabs with icons only',
    },
    {
      title: 'Icon + Text Tabs',
      description: 'Combine icons and text for enhanced clarity',
    },
    {
      title: 'Disabled Tabs',
      description: 'Support for disabling individual tabs',
    },
    {
      title: 'Closable Tabs',
      description: 'Allow users to close tabs dynamically',
    },
    {
      title: 'Two-Way Binding',
      description: 'Support for [(activeIndex)] two-way binding',
    },
    {
      title: 'Keyboard Navigation',
      description:
        'Full keyboard support with Arrow keys, Home, End, Enter, and Space',
    },
    {
      title: 'Accessibility',
      description:
        'ARIA attributes for screen readers (role, aria-selected, etc.)',
    },
  ];

  onTabClose(event: { originalEvent: Event; index: number }): void {
    this.closableTabs.splice(event.index, 1);
    if (this.closableActiveIndex >= this.closableTabs.length) {
      this.closableActiveIndex = Math.max(0, this.closableTabs.length - 1);
    }
  }
}
