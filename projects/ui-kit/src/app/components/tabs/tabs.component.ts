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
  textOnlyActiveIndex = 0;
  iconOnlyActiveIndex = 0;
  iconTextActiveIndex = 0;
  disabledActiveIndex = 0;
  closableActiveIndex = 0;
  closableTabs = [
    { header: 'Document 1', icon: 'pi pi-file' },
    { header: 'Document 2', icon: 'pi pi-file' },
    { header: 'Document 3', icon: 'pi pi-file' },
  ];
  codeExamples = {
    textOnly: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel header="Home">
    <div class="tab-content"><h3>Home</h3></div>
  </i-tab-panel>
  <i-tab-panel header="Profile">
    <div class="tab-content"><h3>Profile</h3></div>
  </i-tab-panel>
  <i-tab-panel header="Settings">
    <div class="tab-content"><h3>Settings</h3></div>
  </i-tab-panel>
</i-tabs>`,
    iconOnly: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel icon="pi pi-home">
    <div class="tab-content"><h3>Home</h3></div>
  </i-tab-panel>
  <i-tab-panel icon="pi pi-user">
    <div class="tab-content"><h3>User</h3></div>
  </i-tab-panel>
  <i-tab-panel icon="pi pi-cog">
    <div class="tab-content"><h3>Settings</h3></div>
  </i-tab-panel>
</i-tabs>`,
    iconText: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel header="Home" icon="pi pi-home">
    <div class="tab-content"><h3>Home</h3></div>
  </i-tab-panel>
  <i-tab-panel header="Profile" icon="pi pi-user">
    <div class="tab-content"><h3>Profile</h3></div>
  </i-tab-panel>
  <i-tab-panel header="Settings" icon="pi pi-cog">
    <div class="tab-content"><h3>Settings</h3></div>
  </i-tab-panel>
</i-tabs>`,
    disabled: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel header="Active" icon="pi pi-check">
    <div class="tab-content"><h3>Active Tab</h3></div>
  </i-tab-panel>
  <i-tab-panel header="Disabled" icon="pi pi-ban" [disabled]="true">
    <div class="tab-content"><h3>Disabled Tab</h3></div>
  </i-tab-panel>
  <i-tab-panel header="Another" icon="pi pi-star">
    <div class="tab-content"><h3>Another Tab</h3></div>
  </i-tab-panel>
</i-tabs>`,
    closable: `<i-tabs [(activeIndex)]="activeTab" (onClose)="onTabClose($event)">
  @for (tab of tabs; track $index) {
    <i-tab-panel [header]="tab.header" [icon]="tab.icon" [closable]="true">
      <div class="tab-content">
        <h3>{{ tab.header }}</h3>
      </div>
    </i-tab-panel>
  }
</i-tabs>`,
  };

  tsExamples = {
    basic: `import { Component } from '@angular/core';
import { ITabs, ITabPanel } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ITabs, ITabPanel],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  activeTab = 0;
}`,

    closable: `import { Component } from '@angular/core';
import { ITabs, ITabPanel } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ITabs, ITabPanel],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  activeTab = 0;

  tabs = [
    { header: 'Document 1', icon: 'pi pi-file' },
    { header: 'Document 2', icon: 'pi pi-file' },
    { header: 'Document 3', icon: 'pi pi-file' },
  ];

  onTabClose(event: { originalEvent: Event; index: number }): void {
    this.tabs.splice(event.index, 1);
    this.activeTab = Math.min(this.activeTab, Math.max(0, this.tabs.length - 1));
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
