import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { PageLayoutComponent } from './page-layout.component';
import {
  PageHeaderActionsDirective,
  PageHeaderContentDirective,
  PageSidebarDirective,
} from './page-layout-slots.directive';

@Component({
  imports: [
    PageLayoutComponent,
    PageSidebarDirective,
    PageHeaderActionsDirective,
    PageHeaderContentDirective,
  ],
  template: ` <i-page-layout
    headerText="Report automations"
    [showHeader]="showHeader()"
    [sidebarPosition]="sidebarPosition()"
    [sidebarCollapsible]="sidebarCollapsible()"
    [(sidebarVisible)]="sidebarVisible"
  >
    @if (showSidebar()) {
      <nav iPageSidebar>
        <h2>Sidebar start</h2>
        @for (item of items; track item) {
          <button style="display:block;height:44px">Organization {{ item }}</button>
        }
        <p class="sidebar-end">Sidebar end</p>
      </nav>
    }
    <button iPageHeaderActions (click)="saved.set(true)">Save</button>
    <p iPageHeaderContent>Draft notice</p>
    <section class="test-content">
      @for (item of items; track item) {
        <p style="height:88px">Report {{ item }}</p>
      }
    </section>
  </i-page-layout>`,
})
class TestPage {
  readonly items = Array.from({ length: 40 }, (_, i) => i + 1);
  readonly sidebarPosition = signal<'left' | 'right'>('left');
  readonly sidebarCollapsible = signal(true);
  readonly sidebarVisible = signal(true);
  readonly showSidebar = signal(true);
  readonly showHeader = signal(true);
  readonly saved = signal(false);
}

@Component({
  imports: [LayoutComponent],
  template: '<i-layout [config]="config" />',
})
class TestShell {
  readonly config = { websiteName: 'Layout test', enablePullToRefresh: true };
}

describe('PageLayoutComponent', () => {
  async function settleMotion(root: HTMLElement) {
    await new Promise(requestAnimationFrame);
    await Promise.all(root.getAnimations({ subtree: true }).map((animation) => animation.finished));
    await new Promise(requestAnimationFrame);
  }

  it('renders a simple page without optional slots', async () => {
    TestBed.configureTestingModule({ imports: [PageLayoutComponent] });
    const fixture = TestBed.createComponent(PageLayoutComponent);
    fixture.componentRef.setInput('headerText', 'Reports');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Reports');
    expect(fixture.nativeElement.querySelector('aside')).toBeNull();
    expect(fixture.nativeElement.querySelector('.header-actions')).toBeNull();
  });

  it('defaults to the left and places a right sidebar beside or below the main view', async () => {
    TestBed.configureTestingModule({ imports: [TestPage] });
    const fixture = TestBed.createComponent(TestPage);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const layout = fixture.debugElement.query(By.directive(PageLayoutComponent))
      .componentInstance as PageLayoutComponent;
    expect(layout.sidebarPosition()).toBe('left');
    const sidebar = root.querySelector<HTMLElement>('aside')!;
    const body = root.querySelector<HTMLElement>('.page-body')!;
    const mobile = matchMedia('(max-width: 991px)').matches;
    if (!mobile)
      expect(sidebar.getBoundingClientRect().right).toBeLessThanOrEqual(
        body.getBoundingClientRect().left,
      );
    fixture.componentInstance.sidebarPosition.set('right');
    await fixture.whenStable();
    await settleMotion(root);
    expect(root.querySelectorAll('nav')).toHaveLength(1);
    if (mobile)
      expect(sidebar.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        body.getBoundingClientRect().bottom,
      );
    else
      expect(sidebar.getBoundingClientRect().left).toBeGreaterThanOrEqual(
        body.getBoundingClientRect().right,
      );
    root.querySelector<HTMLButtonElement>('header button[iPageHeaderActions]')!.click();
    expect(fixture.componentInstance.saved()).toBe(true);
  });

  it('projects slots once, preserves bindings, and supports dynamic composition', async () => {
    TestBed.configureTestingModule({ imports: [TestPage] });
    const fixture = TestBed.createComponent(TestPage);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('nav')).toHaveLength(1);
    expect(root.querySelectorAll('.test-content')).toHaveLength(1);
    expect(root.querySelector('header [iPageHeaderContent]')?.textContent).toBe('Draft notice');
    root.querySelector<HTMLButtonElement>('header button[iPageHeaderActions]')!.click();
    expect(fixture.componentInstance.saved()).toBe(true);
    fixture.componentInstance.showSidebar.set(false);
    fixture.componentInstance.showHeader.set(false);
    await fixture.whenStable();
    expect(root.querySelector('aside')).toBeNull();
    expect(root.querySelector('header')).toBeNull();
    expect(root.querySelector('.test-content')).not.toBeNull();
  });

  it.each(['left', 'right'] as const)(
    'slides the %s sidebar down and back up using its click control, preserving content',
    async (position) => {
      TestBed.configureTestingModule({ imports: [TestPage] });
      const fixture = TestBed.createComponent(TestPage);
      fixture.componentInstance.sidebarPosition.set(position);
      await fixture.whenStable();
      const root: HTMLElement = fixture.nativeElement;
      const slot = root.querySelector<HTMLElement>('.sidebar-slot')!;
      const sidebar = root.querySelector<HTMLElement>('aside')!;
      const nav = sidebar.querySelector('nav');
      const toggle = root.querySelector<HTMLButtonElement>('.sidebar-toggle button')!;
      const pageBody = root.querySelector<HTMLElement>('.page-body')!;
      const expandedWidth = pageBody.getBoundingClientRect().width;
      const expandedTop = pageBody.getBoundingClientRect().top;
      sidebar.scrollTop = 88;
      const scrollTop = sidebar.scrollTop;
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(toggle.getAttribute('aria-label')).toBe(`Hide ${position} sidebar`);

      toggle.click();
      await fixture.whenStable();
      await settleMotion(root);
      expect(fixture.componentInstance.sidebarVisible()).toBe(false);
      expect(slot.inert).toBe(true);
      expect(slot.getAttribute('aria-hidden')).toBe('true');
      expect(getComputedStyle(sidebar).visibility).toBe('hidden');
      expect(new DOMMatrix(getComputedStyle(sidebar).transform).m42).toBeGreaterThan(0);
      expect(toggle.getAttribute('aria-label')).toBe(`Show ${position} sidebar`);
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(slot.getBoundingClientRect().height).toBeLessThan(1);
      if (!matchMedia('(max-width: 991px)').matches) {
        expect(pageBody.getBoundingClientRect().width).toBeGreaterThan(expandedWidth + 200);
      } else if (position === 'left') {
        expect(pageBody.getBoundingClientRect().top).toBeLessThan(expandedTop);
      }

      toggle.click();
      await fixture.whenStable();
      await settleMotion(root);
      expect(fixture.componentInstance.sidebarVisible()).toBe(true);
      expect(slot.inert).toBe(false);
      expect(getComputedStyle(sidebar).visibility).toBe('visible');
      expect(new DOMMatrix(getComputedStyle(sidebar).transform).m42).toBe(0);
      expect(sidebar.querySelector('nav')).toBe(nav);
      expect(sidebar.scrollTop).toBe(scrollTop);
      expect(root.querySelectorAll('nav')).toHaveLength(1);
      expect(Math.abs(pageBody.getBoundingClientRect().width - expandedWidth)).toBeLessThan(1);
    },
  );

  it('supports external visibility updates, public methods and change notifications', async () => {
    TestBed.configureTestingModule({ imports: [TestPage] });
    const fixture = TestBed.createComponent(TestPage);
    fixture.componentInstance.sidebarVisible.set(false);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const layout = fixture.debugElement.query(By.directive(PageLayoutComponent))
      .componentInstance as PageLayoutComponent;
    const changed = vi.fn();
    layout.sidebarVisible.subscribe(changed);
    expect(root.querySelector<HTMLElement>('.sidebar-slot')!.inert).toBe(true);
    layout.showSidebar();
    await fixture.whenStable();
    expect(fixture.componentInstance.sidebarVisible()).toBe(true);
    expect(changed).toHaveBeenLastCalledWith(true);
    layout.hideSidebar();
    await fixture.whenStable();
    expect(fixture.componentInstance.sidebarVisible()).toBe(false);
    expect(changed).toHaveBeenLastCalledWith(false);
    layout.toggleSidebar();
    await fixture.whenStable();
    expect(fixture.componentInstance.sidebarVisible()).toBe(true);
    expect(changed.mock.calls).toEqual([[true], [false], [true]]);
    fixture.componentInstance.sidebarVisible.set(false);
    await fixture.whenStable();
    expect(root.querySelector<HTMLElement>('.sidebar-slot')!.inert).toBe(true);
    expect(changed).toHaveBeenCalledTimes(3);
  });

  it('keeps the sidebar expanded and removes the control when collapsing is disabled', async () => {
    TestBed.configureTestingModule({ imports: [TestPage] });
    const fixture = TestBed.createComponent(TestPage);
    fixture.componentInstance.sidebarCollapsible.set(false);
    fixture.componentInstance.sidebarVisible.set(false);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const layout = fixture.debugElement.query(By.directive(PageLayoutComponent))
      .componentInstance as PageLayoutComponent;
    expect(root.querySelector('.sidebar-toggle')).toBeNull();
    expect(root.querySelector<HTMLElement>('.sidebar-slot')!.inert).toBe(false);
    layout.showSidebar();
    layout.hideSidebar();
    layout.toggleSidebar();
    expect(layout.sidebarVisible()).toBe(true);
  });

  it('retains a restore control without a page header and returns focus from hidden content', async () => {
    TestBed.configureTestingModule({ imports: [TestPage] });
    const fixture = TestBed.createComponent(TestPage);
    fixture.componentInstance.showHeader.set(false);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const layout = fixture.debugElement.query(By.directive(PageLayoutComponent))
      .componentInstance as PageLayoutComponent;
    const toggle = root.querySelector<HTMLButtonElement>('.sidebar-toolbar button')!;
    root.querySelector<HTMLButtonElement>('aside button')!.focus({ preventScroll: true });
    layout.hideSidebar();
    await fixture.whenStable();
    expect(document.activeElement).toBe(toggle);
    toggle.click();
    await fixture.whenStable();
    expect(layout.sidebarVisible()).toBe(true);
    fixture.componentInstance.showSidebar.set(false);
    await fixture.whenStable();
    expect(root.querySelector('.sidebar-toolbar')).toBeNull();
  });

  it.each([true, false])(
    'owns its padding and snaps across the mobile app bar (sidebar: %s)',
    async (showSidebar) => {
      const previousFontSize = document.documentElement.style.fontSize;
      TestBed.configureTestingModule({
        imports: [TestShell],
        providers: [provideRouter([{ path: 'page', component: TestPage }])],
      });
      const fixture = TestBed.createComponent(TestShell);
      try {
        await TestBed.inject(Router).navigateByUrl('/page');
        await fixture.whenStable();
        const root: HTMLElement = fixture.nativeElement;
        const pageComponent = fixture.debugElement.query(By.directive(TestPage))
          .componentInstance as TestPage;
        pageComponent.showSidebar.set(showSidebar);
        await fixture.whenStable();
        const shell = root.querySelector<HTMLElement>('.layout-main-container')!;
        const wrapper = root.querySelector<HTMLElement>('.layout-wrapper')!;
        const sidebar = root.querySelector<HTMLElement>('i-page-layout .sidebar');
        const header = root.querySelector<HTMLElement>('.page-header')!;
        const page = root.querySelector<HTMLElement>('i-page-layout')!;
        const mobile = matchMedia('(max-width: 991px)').matches;
        const scrollOwner = mobile ? wrapper : shell;
        scrollOwner.style.scrollBehavior = 'auto';
        expect(getComputedStyle(header).boxShadow).toBe('none');
        expect(getComputedStyle(shell).padding).toBe('0px');
        page.style.setProperty('--page-layout-padding', '8px');
        expect(getComputedStyle(header).paddingLeft).toBe('8px');
        expect(getComputedStyle(shell).paddingLeft).toBe('0px');
        const initialSidebarTop = sidebar?.getBoundingClientRect().top;
        const bodyTop = root.querySelector('.page-body')!.getBoundingClientRect().top;
        if (mobile) {
          const topbar = root.querySelector<HTMLElement>('i-topbar')!;
          const edge = wrapper.getBoundingClientRect().top;
          const barBottom = topbar.getBoundingClientRect().bottom;
          const waitForScroll = async () => {
            await new Promise(requestAnimationFrame);
            await new Promise(requestAnimationFrame);
          };
          // Both directions must skip every partially overlapping position.
          for (const remaining of [barBottom - edge - 1, 1, (barBottom - edge) / 2]) {
            wrapper.scrollTop = bodyTop - edge - remaining;
            await waitForScroll();
            expect(Math.abs(header.getBoundingClientRect().top - edge)).toBeLessThan(2);
            expect(header.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(barBottom);
            expect(getComputedStyle(header).boxShadow).not.toBe('none');
          }
          wrapper.scrollTop = 0;
          await waitForScroll();
          expect(Math.abs(header.getBoundingClientRect().top - bodyTop)).toBeLessThan(2);
          expect(getComputedStyle(header).boxShadow).toBe('none');
        }
        scrollOwner.scrollTop = bodyTop - scrollOwner.getBoundingClientRect().top + 100;
        await new Promise(requestAnimationFrame);
        expect(
          Math.abs(header.getBoundingClientRect().top - scrollOwner.getBoundingClientRect().top),
        ).toBeLessThan(2);
        expect(getComputedStyle(header).boxShadow).not.toBe('none');
        if (mobile && sidebar) {
          expect(sidebar.getBoundingClientRect().bottom).toBeLessThanOrEqual(
            header.getBoundingClientRect().top,
          );
        } else if (sidebar) {
          expect(sidebar.scrollHeight).toBeGreaterThan(sidebar.clientHeight);
          expect(
            Math.abs(sidebar.getBoundingClientRect().top - shell.getBoundingClientRect().top),
          ).toBeLessThan(2);
        }
        if (sidebar) {
          const layout = fixture.debugElement.query(By.directive(PageLayoutComponent))
            .componentInstance as PageLayoutComponent;
          layout.hideSidebar();
          await fixture.whenStable();
          await settleMotion(root);
          expect(
            Math.abs(header.getBoundingClientRect().top - scrollOwner.getBoundingClientRect().top),
          ).toBeLessThan(2);
          expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
          layout.showSidebar();
          await fixture.whenStable();
          await settleMotion(root);
        }
        if (mobile) {
          const shellComponent = fixture.debugElement.query(By.directive(LayoutComponent))
            .componentInstance as LayoutComponent;
          header.dispatchEvent(
            new TouchEvent('touchstart', {
              touches: [new Touch({ identifier: 1, target: header, clientX: 50, clientY: 100 })],
              bubbles: true,
            }),
          );
          header.dispatchEvent(
            new TouchEvent('touchmove', {
              touches: [new Touch({ identifier: 1, target: header, clientX: 50, clientY: 200 })],
              bubbles: true,
              cancelable: true,
            }),
          );
          expect(shellComponent.pullDistance()).toBe(0);
          header.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }));
        }
        scrollOwner.scrollTop = 0;
        await new Promise(requestAnimationFrame);
        expect(getComputedStyle(header).boxShadow).toBe('none');
        if (sidebar && initialSidebarTop !== undefined) {
          expect(Math.abs(sidebar.getBoundingClientRect().top - initialSidebarTop)).toBeLessThan(2);
        }
      } finally {
        fixture.destroy();
        document.documentElement.style.fontSize = previousFontSize;
      }
    },
  );
});
