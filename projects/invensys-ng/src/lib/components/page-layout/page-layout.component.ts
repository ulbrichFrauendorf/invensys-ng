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
import {
  PageHeaderActionsDirective,
  PageSidebarDirective,
  PageLeftSidebarDirective,
  PageRightSidebarDirective,
} from './page-layout-slots.directive';

/**
 * Page-owned spacing, one sticky content header, and optional left/right sidebars.
 * In i-layout, desktop content scrolls below the app bar; on mobile the
 * sidebar scrolls away and the content header snaps over the app bar on contact.
 * Customize spacing with --page-layout-padding and sidebar width with
 * --page-layout-sidebar-width, or --page-layout-left-sidebar-width and
 * --page-layout-right-sidebar-width. Compose iPageLeftSidebar/iPageRightSidebar
 * inside one layout; do not nest layouts to add a second sidebar.
 * The application shell adds no padding.
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
  private readonly parentLayout: PageLayoutComponent | null = inject(
    PageLayoutComponent,
    {
      optional: true,
      skipSelf: true,
    },
  );
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
  private readonly sidebarElement =
    viewChild<ElementRef<HTMLElement>>('sidebarElement');
  private readonly sidebarSlot =
    viewChild<ElementRef<HTMLElement>>('sidebarSlot');

  protected readonly leftSidebar = contentChild(PageLeftSidebarDirective);
  protected readonly rightSidebar = contentChild(PageRightSidebarDirective);
  private readonly leftSidebarElement =
    viewChild<ElementRef<HTMLElement>>('leftSidebarElement');
  private readonly rightSidebarElement = viewChild<ElementRef<HTMLElement>>(
    'rightSidebarElement',
  );
  private readonly leftToggle = viewChild<IButton>('leftToggle');
  private readonly rightToggle = viewChild<IButton>('rightToggle');
  private readonly leftSlot = viewChild<ElementRef<HTMLElement>>('leftSlot');
  private readonly rightSlot = viewChild<ElementRef<HTMLElement>>('rightSlot');

  protected panel(side: 'left' | 'right') {
    return side === 'left' ? this.leftSidebar() : this.rightSidebar();
  }

  protected hasSidebar(side: 'left' | 'right'): boolean {
    return (
      !!this.panel(side) ||
      (!!this.sidebar() && this.sidebarPosition() === side)
    );
  }

  protected collapsible(side: 'left' | 'right'): boolean {
    return this.panel(side)?.collapsible() ?? this.sidebarCollapsible();
  }

  protected expanded(side: 'left' | 'right'): boolean {
    return (
      !this.collapsible(side) ||
      (this.panel(side)?.visible() ?? this.sidebarVisible())
    );
  }

  protected toggleLabel(side: 'left' | 'right'): string {
    return (
      (this.expanded(side) ? 'Hide ' : 'Show ') +
      (this.panel(side)?.label() || side + ' sidebar')
    );
  }

  /** A side argument targets a composed slot; omitting it preserves the single-sidebar API. */
  showSidebar(side: 'left' | 'right' = this.sidebarPosition()): void {
    (this.panel(side)?.visible ?? this.sidebarVisible).set(true);
  }

  hideSidebar(side: 'left' | 'right' = this.sidebarPosition()): void {
    if (this.collapsible(side))
      (this.panel(side)?.visible ?? this.sidebarVisible).set(false);
  }

  toggleSidebar(side: 'left' | 'right' = this.sidebarPosition()): void {
    if (this.collapsible(side))
      (this.panel(side)?.visible ?? this.sidebarVisible).update(
        (visible) => !visible,
      );
  }

  protected readonly sidebar = contentChild(PageSidebarDirective);
  protected readonly headerActions = contentChild(PageHeaderActionsDirective);
  private readonly header = viewChild<ElementRef<HTMLElement>>('header');
  private readonly toolbar = viewChild<ElementRef<HTMLElement>>('toolbar');
  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');

  constructor() {
    afterRenderEffect((onCleanup) => {
      const stickyElement =
        this.header()?.nativeElement ?? this.toolbar()?.nativeElement;
      if (!stickyElement) {
        this.stickyHeaderHeight.set(0);
        return;
      }
      const update = () =>
        this.stickyHeaderHeight.set(
          stickyElement.getBoundingClientRect().height,
        );
      const observer = new ResizeObserver(update);
      observer.observe(stickyElement);
      update();
      onCleanup(() => observer.disconnect());
    });
    effect(() => {
      // Return focus to the control on the same side before its panel becomes unreachable.
      for (const side of ['left', 'right'] as const) {
        const element =
          side === 'left'
            ? this.leftSidebarElement()
            : this.rightSidebarElement();
        const legacy =
          this.sidebarPosition() === side ? this.sidebarElement() : undefined;
        if (
          !this.expanded(side) &&
          (element ?? legacy)?.nativeElement.contains(document.activeElement)
        ) {
          (side === 'left' ? this.leftToggle() : this.rightToggle())?.focus();
        }
      }
    });
    afterRenderEffect((onCleanup) => {
      // Slot changes can move the heading without resizing its body.
      const stickyOffset = this.stickyOffset();
      this.sidebar();
      const header = this.header()?.nativeElement;
      const sidebarSlots = [
        this.sidebarSlot(),
        this.leftSlot(),
        this.rightSlot(),
      ];
      const body = this.body().nativeElement;
      const scrollport = body.closest<HTMLElement>('.layout-wrapper');
      const topbar =
        scrollport?.querySelector<HTMLElement>(':scope > i-topbar');
      if (!header || !scrollport || !topbar) return;

      const contentScrollport = body.closest<HTMLElement>(
        '.layout-main-container',
      );
      const mobile = window.matchMedia('(max-width: 61.9375rem)');
      const update = () => {
        let offset = 0;
        const bodyTop = body.getBoundingClientRect().top;
        const stickyEdge = mobile.matches
          ? topbar.getBoundingClientRect().bottom
          : (contentScrollport ?? scrollport).getBoundingClientRect().top;
        const snapped = bodyTop < stickyEdge + stickyOffset;
        if (mobile.matches) {
          const top = 0;
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
      for (const slot of sidebarSlots)
        if (slot) observer.observe(slot.nativeElement);
      scrollport.addEventListener('scroll', update, { passive: true });
      contentScrollport?.addEventListener('scroll', update, { passive: true });
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
      onCleanup(() => {
        observer.disconnect();
        scrollport.removeEventListener('scroll', update);
        contentScrollport?.removeEventListener('scroll', update);
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
        header.classList.remove('page-header-snapped');
        header.style.removeProperty('--page-header-snap-offset');
      });
    });
  }
}
