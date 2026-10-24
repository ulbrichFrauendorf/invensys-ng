import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import {
  PageHeaderActionsDirective,
  PageHeaderContentDirective,
  PageSidebarDirective,
} from '@shared/components/page-layout/page-layout-slots.directive';
import { CodeDisplayComponent } from '../code-display/code-display.component';
import { IButton } from '@shared/components/button/button.component';
import { IListbox } from '@shared/components/listbox/listbox.component';

@Component({
  selector: 'app-page-layouts',
  imports: [
    FormsModule,
    CodeDisplayComponent,
    PageLayoutComponent,
    PageSidebarDirective,
    PageHeaderActionsDirective,
    PageHeaderContentDirective,
    IButton,
    IListbox,
  ],
  templateUrl: './page-layouts.component.html',
  styleUrl: './page-layouts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutsComponent {
  readonly sidebarPosition = signal<'left' | 'right'>('right');
  readonly showCode = signal(false);
  readonly showSidebar = signal(true);
  readonly showHeader = signal(true);
  readonly spacing = signal('');
  readonly rowCount = signal(80);
  readonly saved = signal(false);
  readonly organizations = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: i === 0 ? 'Thomas Tyres' : 'Organization ' + String(i + 1).padStart(2, '0'),
  }));
  readonly selectedOrganization = signal<{ id: number; name: string } | null>(
    this.organizations[0],
  );
  readonly organizationName = computed(
    () => this.selectedOrganization()?.name ?? 'No organization selected',
  );
  readonly rows = computed(() =>
    Array.from({ length: this.rowCount() }, (_, i) => ({
      id: i + 1,
      name: ['Month-end payroll pack', 'Employee audit', 'Payment register', 'Leave balances'][
        i % 4
      ],
      status: i % 5 === 0 ? 'Paused' : 'Active',
      reports: (i % 6) + 1,
    })),
  );
  readonly sourceCode = `import {
  PageLayoutComponent, PageSidebarDirective,
  PageHeaderActionsDirective, PageHeaderContentDirective
} from 'invensys-ng';

<i-page-layout headerText="Report automations" eyebrowText="Thomas Tyres" sidebarPosition="right"
  style="--page-layout-padding: 16px; --page-layout-sidebar-width: 240px">
  <nav iPageSidebar>Organization selector</nav>
  <div iPageHeaderActions>Page actions</div>
  <p iPageHeaderContent>Optional heading description</p>
  <section>Page content</section>
</i-page-layout>`;
}
