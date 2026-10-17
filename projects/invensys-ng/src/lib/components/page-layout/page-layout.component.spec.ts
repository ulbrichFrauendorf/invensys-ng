import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { PageLayoutComponent } from './page-layout.component';
import { PageHeaderActionsDirective, PageHeaderContentDirective, PageSidebarDirective } from './page-layout-slots.directive';

@Component({
  imports: [PageLayoutComponent, PageSidebarDirective, PageHeaderActionsDirective, PageHeaderContentDirective],
  template: `
    <i-page-layout headerText="Report automations" [showHeader]="showHeader()">
      @if (showSidebar()) {
        <nav iPageSidebar>
          <h2>Sidebar start</h2>
          @for (item of items; track item) { <button style="display:block;height:44px">Organization {{ item }}</button> }
          <p class="sidebar-end">Sidebar end</p>
        </nav>
      }
      <button iPageHeaderActions (click)="saved.set(true)">Save</button>
      <p iPageHeaderContent>Draft notice</p>
      <section class="test-content">
        @for (item of items; track item) { <p style="height:88px">Report {{ item }}</p> }
      </section>
    </i-page-layout>`,
})
class TestPage {
  readonly items = Array.from({ length: 40 }, (_, i) => i + 1);
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
  it('renders a simple page without optional slots', async () => {
    TestBed.configureTestingModule({ imports: [PageLayoutComponent] });
    const fixture = TestBed.createComponent(PageLayoutComponent);
    fixture.componentRef.setInput('headerText', 'Reports');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Reports');
    expect(fixture.nativeElement.querySelector('aside')).toBeNull();
    expect(fixture.nativeElement.querySelector('.header-actions')).toBeNull();
  });

  it('projects slots once, preserves bindings, and supports dynamic composition', async () => {
    TestBed.configureTestingModule({ imports: [TestPage] });
    const fixture = TestBed.createComponent(TestPage);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('nav')).toHaveLength(1);
    expect(root.querySelectorAll('.test-content')).toHaveLength(1);
    expect(root.querySelector('header [iPageHeaderContent]')?.textContent).toBe('Draft notice');
    root.querySelector<HTMLButtonElement>('header button')!.click();
    expect(fixture.componentInstance.saved()).toBe(true);
    fixture.componentInstance.showSidebar.set(false);
    fixture.componentInstance.showHeader.set(false);
    await fixture.whenStable();
    expect(root.querySelector('aside')).toBeNull();
    expect(root.querySelector('header')).toBeNull();
    expect(root.querySelector('.test-content')).not.toBeNull();
  });

  it('owns its padding while the real shell remains unpadded and scrolls back to the sidebar', async () => {
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
      const shell = root.querySelector<HTMLElement>('.layout-main-container')!;
      const wrapper = root.querySelector<HTMLElement>('.layout-wrapper')!;
      const sidebar = root.querySelector<HTMLElement>('i-page-layout .sidebar')!;
      const header = root.querySelector<HTMLElement>('.page-header')!;
      const page = root.querySelector<HTMLElement>('i-page-layout')!;
      const mobile = matchMedia('(max-width: 991px)').matches;
      const scrollOwner = mobile ? wrapper : shell;
      scrollOwner.style.scrollBehavior = 'auto';
      expect(getComputedStyle(shell).padding).toBe('0px');
      page.style.setProperty('--page-layout-padding', '8px');
      expect(getComputedStyle(header).paddingLeft).toBe('8px');
      expect(getComputedStyle(shell).paddingLeft).toBe('0px');
      const initialSidebarTop = sidebar.getBoundingClientRect().top;
      const bodyTop = root.querySelector('.page-body')!.getBoundingClientRect().top;
      scrollOwner.scrollTop = bodyTop - scrollOwner.getBoundingClientRect().top + 100;
      await new Promise(requestAnimationFrame);
      expect(Math.abs(header.getBoundingClientRect().top - scrollOwner.getBoundingClientRect().top)).toBeLessThan(2);
      if (mobile) {
        expect(sidebar.getBoundingClientRect().bottom).toBeLessThanOrEqual(header.getBoundingClientRect().top);
      } else {
        expect(sidebar.scrollHeight).toBeGreaterThan(sidebar.clientHeight);
        expect(Math.abs(sidebar.getBoundingClientRect().top - shell.getBoundingClientRect().top)).toBeLessThan(2);
      }
      if (mobile) {
        const shellComponent = fixture.debugElement.query(By.directive(LayoutComponent)).componentInstance as LayoutComponent;
        header.dispatchEvent(new TouchEvent('touchstart', {
          touches: [new Touch({ identifier: 1, target: header, clientX: 50, clientY: 100 })],
          bubbles: true,
        }));
        header.dispatchEvent(new TouchEvent('touchmove', {
          touches: [new Touch({ identifier: 1, target: header, clientX: 50, clientY: 200 })],
          bubbles: true,
          cancelable: true,
        }));
        expect(shellComponent.pullDistance()).toBe(0);
        header.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }));
      }
      scrollOwner.scrollTop = 0;
      await new Promise(requestAnimationFrame);
      expect(Math.abs(sidebar.getBoundingClientRect().top - initialSidebarTop)).toBeLessThan(2);
    } finally {
      fixture.destroy();
      document.documentElement.style.fontSize = previousFontSize;
    }
  });
});
