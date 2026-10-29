import { Directive } from '@angular/core';

/** Legacy single sidebar; use the left/right slots to compose a page with both. */
@Directive({ selector: '[iPageSidebar]' })
export class PageSidebarDirective {}

export { PageLeftSidebarDirective } from './page-left-sidebar.directive';
export { PageRightSidebarDirective } from './page-right-sidebar.directive';

@Directive({ selector: '[iPageHeaderActions]' })
export class PageHeaderActionsDirective {}

@Directive({ selector: '[iPageHeaderContent]' })
export class PageHeaderContentDirective {}
