import { Directive, input, model } from '@angular/core';

/** Composes an independent right sidebar within a single i-page-layout. */
@Directive({ selector: '[iPageRightSidebar]' })
export class PageRightSidebarDirective {
  /** Two-way visibility; hiding preserves the projected content and its state. */
  readonly visible = model(true);
  /** Non-collapsible panels stay expanded even when visible is false. */
  readonly collapsible = input(true);
  /** Accessible name used by the panel and its header toggle. */
  readonly label = input('');
}
