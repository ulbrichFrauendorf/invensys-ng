import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IButton } from '@shared/components/button/button.component';
import { IOverlayPanel } from '@shared/components/overlay-panel/overlay-panel.component';

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-overlay-panels',
  imports: [DemoPlaygroundComponent, DemoOptionDirective, IButton, IOverlayPanel],
  templateUrl: './overlay-panels.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./overlay-panels.component.scss', '../shared-demo-styles.scss'],
})
export class OverlayPanelsComponent {
  selectedProduct = 'Product A';
  notificationCount = 3;

  // Code examples organized by category
  codeExamples = {
    basic: `<!-- Basic overlay panel -->
<i-button (clicked)="panel.toggle($event)">Show Info</i-button>
<i-overlay-panel #panel>
  <div class="info-content">
    <h4>Quick Information</h4>
    <p>This panel automatically positions itself relative to the trigger button.</p>
    <p>Try scrolling the page - the panel follows the button!</p>
  </div>
</i-overlay-panel>`,

    userMenu: `<!-- User account menu -->
<i-button (clicked)="userPanel.toggle($event)" icon="pi pi-user" [text]="true">
  John Doe
</i-button>
<i-overlay-panel #userPanel>
  <div class="user-menu">
    <div class="user-header">
      <i class="pi pi-user-circle"></i>
      <div>
        <strong>John Doe</strong>
        <div class="user-email">john.doe@example.com</div>
      </div>
    </div>
    <div class="menu-items">
      <i-button [text]="true" [fluid]="true" icon="pi pi-user">Profile</i-button>
      <i-button [text]="true" [fluid]="true" icon="pi pi-cog">Settings</i-button>
      <i-button [text]="true" [fluid]="true" icon="pi pi-sign-out" severity="danger">
        Logout
      </i-button>
    </div>
  </div>
</i-overlay-panel>`,

    notifications: `<!-- Notifications panel -->
<i-button (clicked)="notifPanel.toggle($event)" icon="pi pi-bell" [text]="true" severity="secondary">
  @if (notificationCount > 0) {
    <span class="badge">{{ notificationCount }}</span>
  }
</i-button>
<i-overlay-panel #notifPanel>
  <div class="notifications-panel">
    <h4>Notifications</h4>
    <div class="notification-item">
      <i class="pi pi-info-circle"></i>
      <div>
        <strong>System Update</strong>
        <p>New version available</p>
        <small>2 hours ago</small>
      </div>
    </div>
    <div class="notification-item">
      <i class="pi pi-check-circle"></i>
      <div>
        <strong>Task Completed</strong>
        <p>Your report has been generated</p>
        <small>1 day ago</small>
      </div>
    </div>
  </div>
</i-overlay-panel>`,

    actions: `<!-- Action menu with icons -->
<i-button (clicked)="actionsPanel.toggle($event)" icon="pi pi-ellipsis-v" [text]="true" />
<i-overlay-panel #actionsPanel>
  <div class="actions-menu">
    <i-button [text]="true" [fluid]="true" icon="pi pi-pencil">Edit</i-button>
    <i-button [text]="true" [fluid]="true" icon="pi pi-copy">Duplicate</i-button>
    <i-button [text]="true" [fluid]="true" icon="pi pi-download">Export</i-button>
    <i-button [text]="true" [fluid]="true" icon="pi pi-trash" severity="danger">
      Delete
    </i-button>
  </div>
</i-overlay-panel>`,

    filters: `<!-- Filters panel -->
<i-button (clicked)="filtersPanel.toggle($event)" icon="pi pi-filter">
  Filters
</i-button>
<i-overlay-panel #filtersPanel>
  <div class="filters-content">
    <h4>Filter Options</h4>
    <div class="filter-group">
      <label>Status</label>
      <i-select [(value)]="selectedStatus" [options]="statusOptions" />
    </div>
    <div class="filter-group">
      <label>Date Range</label>
      <i-calendar [(value)]="dateRange" selectionMode="range" />
    </div>
    <div class="filter-actions">
      <i-button [text]="true" (clicked)="clearFilters()">Clear</i-button>
      <i-button (clicked)="applyFilters(); filtersPanel.hide()">Apply</i-button>
    </div>
  </div>
</i-overlay-panel>`,

    persistent: `<!-- Non-dismissable panel -->
<i-button (clicked)="persistentPanel.toggle($event)">Important Info</i-button>
<i-overlay-panel #persistentPanel [dismissable]="false">
  <div class="important-info">
    <i class="pi pi-exclamation-triangle"></i>
    <h4>Important Notice</h4>
    <p>This panel won't close when clicking outside.</p>
    <p>You must explicitly close it.</p>
    <i-button (clicked)="persistentPanel.hide()" [fluid]="true">
      I Understand
    </i-button>
  </div>
</i-overlay-panel>`,
  };
}
