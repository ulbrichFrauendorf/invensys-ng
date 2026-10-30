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
  PageLeftSidebarDirective,
  PageRightSidebarDirective,
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
          <button style="display:block;height:44px">
            Organization {{ item }}
          </button>
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
  imports: [
    PageLayoutComponent,
    PageSidebarDirective,
    PageHeaderContentDirective,
  ],
  template: `
    <i-page-layout
      headerText="Onboarding"
      [showHeader]="outerHeader()"
      [(sidebarVisible)]="leftVisible"
    >
      <nav iPageSidebar><button>Company</button></nav>
      <div iPageHeaderContent [style.height.px]="extraHeight()"></div>
      <i-page-layout
        headerText="Employee"
        sidebarPosition="right"
        [showHeader]="innerHeader()"
        [sidebarCollapsible]="false"
      >
        <nav iPageSidebar>
          @for (item of items; track item) {
            <button style="display:block;height:44px">
              Outstanding {{ item }}
            </button>
          }
        </nav>
        <section>
          @for (item of items; track item) {
            <p style="height:88px">Employee field {{ item }}</p>
          }
        </section>
      </i-page-layout>
    </i-page-layout>
  `,
})
class NestedTestPage {
  readonly items = Array.from({ length: 40 }, (_, i) => i + 1);
  readonly outerHeader = signal(true);
  readonly innerHeader = signal(false);
  readonly leftVisible = signal(true);
  readonly extraHeight = signal(0);
}

@Component({
  imports: [
    PageLayoutComponent,
    PageLeftSidebarDirective,
    PageRightSidebarDirective,
    PageHeaderActionsDirective,
  ],
  template: `
    <i-page-layout
      headerText="Employee onboarding"
      [showHeader]="showHeader()"
      style="--page-layout-left-sidebar-width:260px;--page-layout-right-sidebar-width:280px"
    >
      @if (showLeft()) {
        <nav
          iPageLeftSidebar
          [(visible)]="leftVisible"
          [collapsible]="leftCollapsible()"
          label="Company selection"
        >
          <input aria-label="Company" value="Selected company" />
        </nav>
      }
      @if (showRight()) {
        <section
          iPageRightSidebar
          [(visible)]="rightVisible"
          label="Outstanding fields"
        >
          @for (item of items; track item) {
            <button style="display:block;height:44px">Field {{ item }}</button>
          }
        </section>
      }
      <button iPageHeaderActions>Save draft</button>
      <input class="employee-input" aria-label="Employee" value="Alice" />
      @for (item of items; track item) {
        <p style="height:88px">Employee field {{ item }}</p>
      }
    </i-page-layout>
  `,
})
class ComposedTestPage {
  readonly items = Array.from({ length: 40 }, (_, i) => i + 1);
  readonly leftVisible = signal(true);
  readonly rightVisible = signal(true);
  readonly leftCollapsible = signal(true);
  readonly showLeft = signal(true);
  readonly showRight = signal(true);
  readonly showHeader = signal(true);
}

@Component({
  imports: [LayoutComponent],
  template: '<i-layout [config]="config" />',
})
class TestShell {
  readonly config = { websiteName: 'Layout test' };
}

describe('PageLayoutComponent', () => {
  async function settleMotion(root: HTMLElement) {
    await new Promise(requestAnimationFrame);
    await Promise.all(
      root
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished),
    );
    await new Promise(requestAnimationFrame);
  }

  it.each([true, false])(
    'keeps the mobile right control at the top right with or without a left control (left: %s)',
    async (showLeft) => {
      if (!matchMedia('(max-width: 991px)').matches) return;
      TestBed.configureTestingModule({ imports: [ComposedTestPage] });
      const fixture = TestBed.createComponent(ComposedTestPage);
      fixture.componentInstance.showLeft.set(showLeft);
      fixture.componentInstance.leftVisible.set(false);
      await fixture.whenStable();
      const root: HTMLElement = fixture.nativeElement;
      const header = root.querySelector<HTMLElement>('.page-header')!;
      header.style.width = '320px';
      const right = header.querySelector<HTMLElement>('.sidebar-toggle-right')!;
      const heading = header.querySelector<HTMLElement>('.page-heading')!;
      const actions = header.querySelector<HTMLElement>('.header-actions')!;
      const rightRect = right.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      expect(
        Math.abs(rightRect.top - heading.getBoundingClientRect().top),
      ).toBeLessThan(1);
      expect(
        Math.abs(
          rightRect.right -
            (headerRect.right -
              parseFloat(getComputedStyle(header).paddingRight)),
        ),
      ).toBeLessThan(1);
      if (showLeft) {
        const left = heading.querySelector<HTMLElement>('.sidebar-toggle')!;
        expect(
          Math.abs(rightRect.top - left.getBoundingClientRect().top),
        ).toBeLessThan(1);
      }
      expect(actions.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        rightRect.bottom,
      );
      right.querySelector('button')!.click();
      await fixture.whenStable();
      expect(
        Math.abs(right.getBoundingClientRect().top - rightRect.top),
      ).toBeLessThan(1);
      fixture.destroy();
    },
  );

  it('composes both sidebars around one body with controls on the matching header sides', async () => {
    TestBed.configureTestingModule({ imports: [ComposedTestPage] });
    const fixture = TestBed.createComponent(ComposedTestPage);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const header = root.querySelector<HTMLElement>('header')!;
    const buttons = header.querySelectorAll<HTMLButtonElement>(
      '.sidebar-toggle button',
    );
    const body = root.querySelector<HTMLElement>('.page-body')!;
    const panels = root.querySelectorAll<HTMLElement>('.sidebar');
    expect(root.querySelectorAll('i-page-layout')).toHaveLength(1);
    expect(root.querySelectorAll('h1')).toHaveLength(1);
    expect(buttons[0].getAttribute('aria-label')).toBe(
      'Hide Company selection',
    );
    expect(buttons[1].getAttribute('aria-label')).toBe(
      'Hide Outstanding fields',
    );
    expect(
      header.querySelector('.page-heading .sidebar-toggle'),
    ).not.toBeNull();
    expect(
      header.lastElementChild?.classList.contains('sidebar-toggle-right'),
    ).toBe(true);
    expect(buttons[0].getBoundingClientRect().left).toBeLessThan(
      buttons[1].getBoundingClientRect().left,
    );
    if (matchMedia('(max-width: 991px)').matches) {
      expect(panels[0].getBoundingClientRect().bottom).toBeLessThanOrEqual(
        body.getBoundingClientRect().top,
      );
      expect(panels[1].getBoundingClientRect().top).toBeGreaterThanOrEqual(
        body.getBoundingClientRect().bottom,
      );
    } else {
      expect(panels[0].getBoundingClientRect().width).toBe(260);
      expect(panels[1].getBoundingClientRect().width).toBe(280);
      expect(panels[0].getBoundingClientRect().right).toBeLessThanOrEqual(
        body.getBoundingClientRect().left,
      );
      expect(panels[1].getBoundingClientRect().left).toBeGreaterThanOrEqual(
        body.getBoundingClientRect().right,
      );
    }
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
  });

  it('collapses either composed sidebar independently, restores focus, and retains form and panel state', async () => {
    TestBed.configureTestingModule({ imports: [ComposedTestPage] });
    const fixture = TestBed.createComponent(ComposedTestPage);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const layout = fixture.debugElement.query(By.directive(PageLayoutComponent))
      .componentInstance as PageLayoutComponent;
    const slots = root.querySelectorAll<HTMLElement>('.sidebar-slot');
    const editor = root.querySelector<HTMLInputElement>('.employee-input')!;
    editor.value = 'Edited Alice';
    const right = slots[1].querySelector<HTMLElement>('.sidebar')!;
    right.scrollTop = 88;
    const scrollTop = right.scrollTop;
    slots[1].querySelector('button')!.focus();
    right.scrollTop = scrollTop;
    layout.hideSidebar('right');
    await fixture.whenStable();
    await settleMotion(root);
    expect(document.activeElement).toBe(
      root.querySelector('.sidebar-toggle-right button'),
    );
    expect(fixture.componentInstance.rightVisible()).toBe(false);
    expect(fixture.componentInstance.leftVisible()).toBe(true);
    expect(slots[0].inert).toBe(false);
    expect(slots[1].inert).toBe(true);
    layout.hideSidebar('left');
    layout.showSidebar('right');
    await fixture.whenStable();
    await settleMotion(root);
    expect(slots[0].inert).toBe(true);
    expect(slots[1].inert).toBe(false);
    expect(right.scrollTop).toBe(scrollTop);
    expect(root.querySelector('.employee-input')).toBe(editor);
    expect(editor.value).toBe('Edited Alice');
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
  });

  it('handles one side, dynamic slots, non-collapsible panels, and a headerless toolbar', async () => {
    TestBed.configureTestingModule({ imports: [ComposedTestPage] });
    const fixture = TestBed.createComponent(ComposedTestPage);
    fixture.componentInstance.showHeader.set(false);
    fixture.componentInstance.showLeft.set(false);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('aside')).toHaveLength(1);
    expect(
      root
        .querySelector('.sidebar-toolbar')
        ?.lastElementChild?.classList.contains('sidebar-toggle-right'),
    ).toBe(true);
    fixture.componentInstance.showLeft.set(true);
    fixture.componentInstance.leftCollapsible.set(false);
    fixture.componentInstance.leftVisible.set(false);
    fixture.componentInstance.showRight.set(false);
    await fixture.whenStable();
    expect(root.querySelectorAll('aside')).toHaveLength(1);
    expect(root.querySelector<HTMLElement>('.sidebar-slot')!.inert).toBe(false);
    expect(root.querySelector('.sidebar-toggle')).toBeNull();
    expect(root.querySelector('.employee-input')).not.toBeNull();
  });

  it('renders a simple page without optional slots', async () => {
    TestBed.configureTestingModule({ imports: [PageLayoutComponent] });
    const fixture = TestBed.createComponent(PageLayoutComponent);
    fixture.componentRef.setInput('headerText', 'Reports');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe(
      'Reports',
    );
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
    root
      .querySelector<HTMLButtonElement>('header button[iPageHeaderActions]')!
      .click();
    expect(fixture.componentInstance.saved()).toBe(true);
  });

  it('projects slots once, preserves bindings, and supports dynamic composition', async () => {
    TestBed.configureTestingModule({ imports: [TestPage] });
    const fixture = TestBed.createComponent(TestPage);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('nav')).toHaveLength(1);
    expect(root.querySelectorAll('.test-content')).toHaveLength(1);
    expect(root.querySelector('header [iPageHeaderContent]')?.textContent).toBe(
      'Draft notice',
    );
    root
      .querySelector<HTMLButtonElement>('header button[iPageHeaderActions]')!
      .click();
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
      const toggle = root.querySelector<HTMLButtonElement>(
        '.sidebar-toggle button',
      )!;
      const pageBody = root.querySelector<HTMLElement>('.page-body')!;
      const expandedWidth = pageBody.getBoundingClientRect().width;
      const expandedTop = pageBody.getBoundingClientRect().top;
      sidebar.scrollTop = 88;
      const scrollTop = sidebar.scrollTop;
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(toggle.getAttribute('aria-label')).toBe(
        `Hide ${position} sidebar`,
      );
      expect(toggle.classList.contains('i-button--xtra-small')).toBe(true);
      expect(
        toggle
          .querySelector('i')
          ?.classList.contains(`pi-angle-double-${position}`),
      ).toBe(true);

      toggle.click();
      await fixture.whenStable();
      await settleMotion(root);
      expect(fixture.componentInstance.sidebarVisible()).toBe(false);
      expect(slot.inert).toBe(true);
      expect(slot.getAttribute('aria-hidden')).toBe('true');
      expect(getComputedStyle(sidebar).visibility).toBe('hidden');
      expect(
        new DOMMatrix(getComputedStyle(sidebar).transform).m42,
      ).toBeGreaterThan(0);
      expect(toggle.getAttribute('aria-label')).toBe(
        `Show ${position} sidebar`,
      );
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(
        toggle
          .querySelector('i')
          ?.classList.contains(
            `pi-angle-double-${position === 'left' ? 'right' : 'left'}`,
          ),
      ).toBe(true);
      expect(slot.getBoundingClientRect().height).toBeLessThan(1);
      if (!matchMedia('(max-width: 991px)').matches) {
        expect(pageBody.getBoundingClientRect().width).toBeGreaterThan(
          expandedWidth + 200,
        );
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
      expect(
        Math.abs(pageBody.getBoundingClientRect().width - expandedWidth),
      ).toBeLessThan(1);
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
    const toggle = root.querySelector<HTMLButtonElement>(
      '.sidebar-toolbar button',
    )!;
    root
      .querySelector<HTMLButtonElement>('aside button')!
      .focus({ preventScroll: true });
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

  it.each([false, true])(
    'keeps nested right sidebars below ancestor headers and toolbars (inner header: %s)',
    async (innerHeader) => {
      TestBed.configureTestingModule({
        imports: [TestShell],
        providers: [
          provideRouter([{ path: 'nested', component: NestedTestPage }]),
        ],
      });
      const fixture = TestBed.createComponent(TestShell);
      await TestBed.inject(Router).navigateByUrl('/nested');
      await fixture.whenStable();
      const page = fixture.debugElement.query(By.directive(NestedTestPage))
        .componentInstance as NestedTestPage;
      page.innerHeader.set(innerHeader);
      page.leftVisible.set(false);
      await fixture.whenStable();
      const root: HTMLElement = fixture.nativeElement;
      await settleMotion(root);
      const layouts = root.querySelectorAll<HTMLElement>('i-page-layout');
      const outer = layouts[0];
      const inner = layouts[1];
      const slot = inner.querySelector<HTMLElement>('.sidebar-slot')!;
      const sidebar = inner.querySelector<HTMLElement>('.sidebar')!;
      const mobile = matchMedia('(max-width: 991px)').matches;
      const scrollport = mobile
        ? (document.scrollingElement as HTMLElement)
        : root.querySelector<HTMLElement>('.layout-main-container')!;
      scrollport.style.scrollBehavior = 'auto';
      scrollport.scrollTop = 500;
      const check = async (selector: string) => {
        await fixture.whenStable();
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        const header = outer.querySelector<HTMLElement>(selector)!;
        expect(getComputedStyle(sidebar).visibility).toBe('visible');
        expect(new DOMMatrix(getComputedStyle(sidebar).transform).m42).toBe(0);
        expect(parseFloat(getComputedStyle(slot).top)).toBeCloseTo(
          header.getBoundingClientRect().height,
          0,
        );
        if (mobile) {
          expect(getComputedStyle(slot).position).toBe('static');
        } else {
          expect(
            Math.abs(
              slot.getBoundingClientRect().top -
                header.getBoundingClientRect().bottom,
            ),
          ).toBeLessThan(2);
          expect(sidebar.getBoundingClientRect().bottom).toBeLessThanOrEqual(
            scrollport.getBoundingClientRect().bottom + 1,
          );
          sidebar.scrollTop = sidebar.scrollHeight;
          expect(
            sidebar.querySelector('button:last-child')!.getBoundingClientRect()
              .bottom,
          ).toBeLessThanOrEqual(sidebar.getBoundingClientRect().bottom);
        }
        if (innerHeader) {
          const innerHeading =
            inner.querySelector<HTMLElement>('.page-header')!;
          expect(
            innerHeading.getBoundingClientRect().top,
          ).toBeGreaterThanOrEqual(header.getBoundingClientRect().bottom - 1);
        }
        expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
      };
      await check('.page-header');
      page.extraHeight.set(100);
      await check('.page-header');
      page.outerHeader.set(false);
      await check('.sidebar-toolbar');
      fixture.destroy();
    },
  );

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
        const shell = root.querySelector<HTMLElement>(
          '.layout-main-container',
        )!;
        const sidebar = root.querySelector<HTMLElement>(
          'i-page-layout .sidebar',
        );
        const header = root.querySelector<HTMLElement>('.page-header')!;
        const page = root.querySelector<HTMLElement>('i-page-layout')!;
        const mobile = matchMedia('(max-width: 991px)').matches;
        const scrollOwner = mobile
          ? (document.scrollingElement as HTMLElement)
          : shell;
        scrollOwner.style.scrollBehavior = 'auto';
        expect(getComputedStyle(header).boxShadow).toBe('none');
        expect(getComputedStyle(shell).padding).toBe('0px');
        page.style.setProperty('--page-layout-padding', '8px');
        expect(getComputedStyle(header).paddingLeft).toBe('8px');
        expect(getComputedStyle(shell).paddingLeft).toBe('0px');
        const initialSidebarTop = sidebar?.getBoundingClientRect().top;
        const bodyTop = root
          .querySelector('.page-body')!
          .getBoundingClientRect().top;
        const bodyDocumentTop = bodyTop + window.scrollY;
        if (mobile) {
          const topbar = root.querySelector<HTMLElement>('i-topbar')!;
          const edge = 0;
          const barBottom = topbar.getBoundingClientRect().bottom;
          const waitForScroll = async () => {
            await new Promise(requestAnimationFrame);
            await new Promise(requestAnimationFrame);
          };
          // Both directions must skip every partially overlapping position.
          for (const remaining of [
            barBottom - edge - 1,
            1,
            (barBottom - edge) / 2,
          ]) {
            scrollOwner.scrollTop = bodyDocumentTop - edge - remaining;
            await waitForScroll();
            expect(
              Math.abs(header.getBoundingClientRect().top - edge),
            ).toBeLessThan(2);
            expect(
              header.getBoundingClientRect().bottom,
            ).toBeGreaterThanOrEqual(barBottom);
            expect(getComputedStyle(header).boxShadow).not.toBe('none');
          }
          scrollOwner.scrollTop = 0;
          await waitForScroll();
          expect(
            Math.abs(header.getBoundingClientRect().top - bodyTop),
          ).toBeLessThan(2);
          expect(getComputedStyle(header).boxShadow).toBe('none');
        }
        scrollOwner.scrollTop = mobile
          ? bodyDocumentTop + 100
          : bodyTop - scrollOwner.getBoundingClientRect().top + 100;
        await new Promise(requestAnimationFrame);
        expect(
          Math.abs(
            header.getBoundingClientRect().top -
              (mobile ? 0 : scrollOwner.getBoundingClientRect().top),
          ),
        ).toBeLessThan(2);
        expect(getComputedStyle(header).boxShadow).not.toBe('none');
        if (mobile && sidebar) {
          expect(sidebar.getBoundingClientRect().bottom).toBeLessThanOrEqual(
            header.getBoundingClientRect().top,
          );
        } else if (sidebar) {
          expect(sidebar.scrollHeight).toBeGreaterThan(sidebar.clientHeight);
          expect(
            Math.abs(
              sidebar.getBoundingClientRect().top -
                shell.getBoundingClientRect().top,
            ),
          ).toBeLessThan(2);
        }
        if (sidebar) {
          const layout = fixture.debugElement.query(
            By.directive(PageLayoutComponent),
          ).componentInstance as PageLayoutComponent;
          layout.hideSidebar();
          await fixture.whenStable();
          await settleMotion(root);
          expect(
            Math.abs(
              header.getBoundingClientRect().top -
                (mobile ? 0 : scrollOwner.getBoundingClientRect().top),
            ),
          ).toBeLessThan(2);
          expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
          layout.showSidebar();
          await fixture.whenStable();
          await settleMotion(root);
        }
        scrollOwner.scrollTop = 0;
        await new Promise(requestAnimationFrame);
        expect(getComputedStyle(header).boxShadow).toBe('none');
        if (sidebar && initialSidebarTop !== undefined) {
          expect(
            Math.abs(sidebar.getBoundingClientRect().top - initialSidebarTop),
          ).toBeLessThan(2);
        }
      } finally {
        fixture.destroy();
        document.documentElement.style.fontSize = previousFontSize;
      }
    },
  );
});
