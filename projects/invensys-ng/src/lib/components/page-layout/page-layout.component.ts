import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  input,
  inject,
  signal,
  Signal,
  model,
  viewChild,
} from '@angular/core';
import { IButton } from '../button/button.component';
import { PageHeaderActionsDirective, PageSidebarDirective } from './page-layout-slots.directive';

/**
 * Page-owned spacing, a sticky content header, and an optional sidebar.
 * In i-layout, desktop content scrolls below the app bar; on mobile the
 * sidebar scrolls away and the content header snaps over the app bar on contact.
 * Customize spacing with --page-layout-padding and sidebar width with
 * --page-layout-sidebar-width. Nested layouts clear ancestor content headers
 * and sidebar toolbars automatically. The application shell adds no padding.
 */
@Component({
  selector: 'i-page-layout',
  host: { '[style.--page-layout-sticky-offset.px]': 'stickyOffset()' },
  imports: [IButton, NgTemplateOutlet],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent {
  private readonly parentLayout: PageLayoutComponent | null = inject(PageLayoutComponent, {
    optional: true,
    skipSelf: true,
  });
  private readonly stickyHeaderHeight = signal(0);
  protected readonly stickyOffset: Signal<number> = computed(
    () => this.parentLayout?.contentStickyOffset() ?? 0,
  );
  private readonly contentStickyOffset: Signal<number> = computed(
    () => this.stickyOffset() + this.stickyHeaderHeight(),
  );
  readonly headerText = input.required<string>();
  readonly eyebrowText = input('');
  readonly showHeader = input(true);
  /** Side on which the optional sidebar appears; existing consumers default to the left. */
  readonly sidebarPosition = input<'left' | 'right'>('left');
  /** Enables the built-in toggle and programmatic hiding for either sidebar position. */
  readonly sidebarCollapsible = input(true);
  /** Two-way visibility binding; changes also emit sidebarVisibleChange. */
  readonly sidebarVisible = model(true);

  protected readonly sidebarExpanded = computed(
    () => !this.sidebarCollapsible() || this.sidebarVisible(),
  );
  private readonly sidebarElement = viewChild<ElementRef<HTMLElement>>('sidebarElement');
  private readonly sidebarSlot = viewChild<ElementRef<HTMLElement>>('sidebarSlot');
  private readonly sidebarToggle = viewChild<IButton>('sidebarToggle');

  showSidebar(): void {
    this.sidebarVisible.set(true);
  }

  hideSidebar(): void {
    if (this.sidebarCollapsible()) this.sidebarVisible.set(false);
  }

  toggleSidebar(): void {
    if (this.sidebarCollapsible()) this.sidebarVisible.update((visible) => !visible);
  }

  protected readonly sidebar = contentChild(PageSidebarDirective);
  protected readonly headerActions = contentChild(PageHeaderActionsDirective);
  private readonly header = viewChild<ElementRef<HTMLElement>>('header');
  private readonly toolbar = viewChild<ElementRef<HTMLElement>>('toolbar');
  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');

  constructor() {
    afterRenderEffect((onCleanup) => {
      const stickyElement = this.header()?.nativeElement ?? this.toolbar()?.nativeElement;
      if (!stickyElement) {
        this.stickyHeaderHeight.set(0);
        return;
      }
      const update = () =>
        this.stickyHeaderHeight.set(stickyElement.getBoundingClientRect().height);
      const observer = new ResizeObserver(update);
      observer.observe(stickyElement);
      update();
      onCleanup(() => observer.disconnect());
    });
    effect(() => {
      // Return keyboard focus before the collapsed sidebar becomes unreachable.
      if (
        !this.sidebarExpanded() &&
        this.sidebarElement()?.nativeElement.contains(document.activeElement)
      ) {
        this.sidebarToggle()?.focus();
      }
    });
    afterRenderEffect((onCleanup) => {
      // Slot changes can move the heading without resizing its body.
      const stickyOffset = this.stickyOffset();
      this.sidebar();
      const header = this.header()?.nativeElement;
      const sidebarSlot = this.sidebarSlot()?.nativeElement;
      const body = this.body().nativeElement;
      const scrollport = body.closest<HTMLElement>('.layout-wrapper');
      const topbar = scrollport?.querySelector<HTMLElement>(':scope > i-topbar');
      if (!header || !scrollport || !topbar) return;

      const contentScrollport = body.closest<HTMLElement>('.layout-main-container');
      const mobile = window.matchMedia('(max-width: 991px)');
      const update = () => {
        let offset = 0;
        const bodyTop = body.getBoundingClientRect().top;
        const stickyEdge = mobile.matches
          ? topbar.getBoundingClientRect().bottom
          : (contentScrollport ?? scrollport).getBoundingClientRect().top;
        const snapped = bodyTop < stickyEdge + stickyOffset;
        if (mobile.matches) {
          const top = scrollport.getBoundingClientRect().top + scrollport.clientTop;
          // Snap the whole heading to the sticky edge on first contact with the app bar.
          // Measure its untransformed parent so the offset cannot feed back into itself.
          if (snapped) {
            offset = Math.max(0, bodyTop - top - stickyOffset);
          }
        }
        header.classList.toggle('page-header-snapped', snapped);
        header.style.setProperty('--page-header-snap-offset', `${-offset}px`);
      };
      const observer = new ResizeObserver(update);
      observer.observe(body);
      observer.observe(topbar);
      if (sidebarSlot) observer.observe(sidebarSlot);
      scrollport.addEventListener('scroll', update, { passive: true });
      contentScrollport?.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
      onCleanup(() => {
        observer.disconnect();
        scrollport.removeEventListener('scroll', update);
        contentScrollport?.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
        header.classList.remove('page-header-snapped');
        header.style.removeProperty('--page-header-snap-offset');
      });
    });
  }
}
