import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import {
  PageHeaderActionsDirective,
  PageHeaderContentDirective,
  PageSidebarDirective,
} from '@shared/components/page-layout/page-layout-slots.directive';
import { IButton } from '@shared/components/button/button.component';
import { IListbox } from '@shared/components/listbox/listbox.component';

@Component({
  selector: 'app-page-layouts',
  imports: [FormsModule, PageLayoutComponent, PageSidebarDirective,
    PageHeaderActionsDirective, PageHeaderContentDirective, IButton, IListbox],
  templateUrl: './page-layouts.component.html',
  styleUrl: './page-layouts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutsComponent {
  readonly showSidebar = signal(true);
  readonly showHeader = signal(true);
  readonly spacing = signal('');
  readonly rowCount = signal(80);
  readonly longTitle = signal(false);
  readonly saved = signal(false);
  readonly organizations = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: i === 0 ? 'Thomas Tyres' : 'Organization ' + String(i + 1).padStart(2, '0'),
  }));
  readonly selectedOrganization = signal<{ id: number; name: string } | null>(this.organizations[0]);
  readonly organizationName = computed(() => this.selectedOrganization()?.name ?? 'No organization selected');
  readonly header = computed(() => this.longTitle()
    ? 'Report automations for organizations with a very long display name'
    : 'Report automations');
  readonly rows = computed(() => Array.from({ length: this.rowCount() }, (_, i) => ({
    id: i + 1,
    name: ['Month-end payroll pack', 'Employee audit', 'Payment register', 'Leave balances'][i % 4],
    status: i % 5 === 0 ? 'Paused' : 'Active',
    reports: (i % 6) + 1,
  })));
  readonly sourceCode = `import {
  PageLayoutComponent, PageSidebarDirective,
  PageHeaderActionsDirective, PageHeaderContentDirective
} from 'invensys-ng';

// Import these standalone declarations in your component.
<i-page-layout headerText="Report automations" eyebrowText="Thomas Tyres"
  style="--page-layout-padding: 16px; --page-layout-sidebar-width: 20rem">
  <nav iPageSidebar>Organization selector</nav>
  <div iPageHeaderActions>Page actions</div>
  <p iPageHeaderContent>Optional heading description</p>
  <section>Page content</section>
</i-page-layout>`;
}
