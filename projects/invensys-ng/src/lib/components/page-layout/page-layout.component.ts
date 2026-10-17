import { ChangeDetectionStrategy, Component, contentChild, input } from '@angular/core';
import { PageHeaderActionsDirective, PageSidebarDirective } from './page-layout-slots.directive';

/**
 * Page-owned spacing, a sticky content header, and an optional sidebar.
 * In i-layout, desktop content scrolls below the app bar; on mobile the
 * sidebar scrolls away and the content header covers the app bar.
 * Customize spacing with --page-layout-padding and sidebar width with
 * --page-layout-sidebar-width. The application shell adds no padding.
 */
@Component({
  selector: 'i-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent {
  readonly headerText = input.required<string>();
  readonly eyebrowText = input('');
  readonly showHeader = input(true);

  protected readonly sidebar = contentChild(PageSidebarDirective);
  protected readonly headerActions = contentChild(PageHeaderActionsDirective);
}
