import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ITabs } from '@shared/components/tabs/tabs.component';
import { ITabPanel } from '@shared/components/tabs/tab-panel.component';

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-tabs',
  imports: [DemoPlaygroundComponent, DemoOptionDirective, ITabs, ITabPanel],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  onTabClose(event: { originalEvent: Event; index: number }): void {
    this.closableTabs.splice(event.index, 1);
    if (this.closableActiveIndex >= this.closableTabs.length) {
      this.closableActiveIndex = Math.max(0, this.closableTabs.length - 1);
    }
  }
}
