import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { PageHeaderActionsDirective, PageSidebarDirective } from './page-layout-slots.directive';

/**
 * Page-owned spacing, a sticky content header, and an optional sidebar.
 * In i-layout, desktop content scrolls below the app bar; on mobile the
 * sidebar scrolls away and the content header snaps over the app bar on contact.
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
  /** Side on which the optional sidebar appears; existing consumers default to the left. */
  readonly sidebarPosition = input<'left' | 'right'>('left');

  protected readonly sidebar = contentChild(PageSidebarDirective);
  protected readonly headerActions = contentChild(PageHeaderActionsDirective);
  private readonly header = viewChild<ElementRef<HTMLElement>>('header');
  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');

  constructor() {
    afterRenderEffect((onCleanup) => {
      // Slot changes can move the heading without resizing its body.
      this.sidebar();
      const header = this.header()?.nativeElement;
      const body = this.body().nativeElement;
      const scrollport = body.closest<HTMLElement>('.layout-wrapper');
      const topbar = scrollport?.querySelector<HTMLElement>(':scope > i-topbar');
      if (!header || !scrollport || !topbar) return;

      const mobile = window.matchMedia('(max-width: 991px)');
      const update = () => {
        let offset = 0;
        if (mobile.matches) {
          const top = scrollport.getBoundingClientRect().top + scrollport.clientTop;
          const bodyTop = body.getBoundingClientRect().top;
          // Snap the whole heading to the sticky edge on first contact with the app bar.
          // Measure its untransformed parent so the offset cannot feed back into itself.
          if (bodyTop < topbar.getBoundingClientRect().bottom) {
            offset = Math.max(0, bodyTop - top);
          }
        }
        header.style.setProperty('--page-header-snap-offset', `${-offset}px`);
      };
      const observer = new ResizeObserver(update);
      observer.observe(body);
      observer.observe(topbar);
      scrollport.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
      onCleanup(() => {
        observer.disconnect();
        scrollport.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
        header.style.removeProperty('--page-header-snap-offset');
      });
    });
  }
}
