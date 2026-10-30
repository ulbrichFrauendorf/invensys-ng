import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './services/layout.service';

@Component({ template: '' })
class TestPage {}

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;
  let service: LayoutService;
  let previousFontSize: string;

  beforeEach(async () => {
    previousFontSize = document.documentElement.style.fontSize;
    vi.stubGlobal('innerWidth', 390);
    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([{ path: 'test', component: TestPage }])],
    });
    fixture = TestBed.createComponent(LayoutComponent);
    service = TestBed.inject(LayoutService);
    fixture.componentRef.setInput('config', {
      websiteName: 'Test App',
    });
    fixture.componentRef.setInput('menuModel', []);
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.nativeElement.remove();
    fixture.destroy();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.classList.remove('blocked-scroll');
    document.documentElement.style.fontSize = previousFontSize;
  });

  it('renders the configured title and mobile layout', () => {
    expect(fixture.nativeElement.textContent).toContain('Test App');
    expect(service.state().isMobileViewport).toBe(true);
  });

  it('closes the sidebar through its mask', async () => {
    service.toggleSidebar();
    await fixture.whenStable();
    expect(document.body.classList.contains('blocked-scroll')).toBe(true);
    fixture.nativeElement.querySelector('.layout-mask').click();
    await fixture.whenStable();
    expect(service.state().isSidebarOpen).toBe(false);
    expect(document.body.classList.contains('blocked-scroll')).toBe(false);
  });

  it('closes the mobile topbar menu only when clicking outside it', async () => {
    document.body.appendChild(fixture.nativeElement);
    const trigger: HTMLElement = fixture.nativeElement.querySelector(
      '.layout-topbar-menu-button button',
    );
    const menu: HTMLElement = fixture.nativeElement.querySelector(
      '.layout-topbar-menu',
    );

    trigger.click();
    await fixture.whenStable();
    expect(service.state().profileSidebarVisible).toBe(true);

    menu.click();
    expect(service.state().profileSidebarVisible).toBe(true);

    document.body.click();
    expect(service.state().profileSidebarVisible).toBe(false);
  });

  it('updates the viewport state on resize', async () => {
    vi.stubGlobal('innerWidth', 1280);
    window.dispatchEvent(new Event('resize'));
    await fixture.whenStable();
    expect(service.state().isMobileViewport).toBe(false);
    expect(service.state().isSidebarOpen).toBe(true);
  });

  it('closes mobile navigation after a real router navigation', async () => {
    service.toggleSidebar();
    await TestBed.inject(Router).navigateByUrl('/test');
    await fixture.whenStable();
    expect(service.state().isSidebarOpen).toBe(false);
  });

  it('does not cancel a mobile downward touch gesture', () => {
    const container: HTMLElement = fixture.nativeElement.querySelector(
      '.layout-main-container',
    );
    const start = new Touch({
      identifier: 1,
      target: container,
      clientX: 50,
      clientY: 100,
    });
    const move = new Touch({
      identifier: 1,
      target: container,
      clientX: 50,
      clientY: 200,
    });
    container.dispatchEvent(
      new TouchEvent('touchstart', { touches: [start], bubbles: true }),
    );
    const event = new TouchEvent('touchmove', {
      touches: [move],
      bubbles: true,
      cancelable: true,
    });
    expect(container.dispatchEvent(event)).toBe(true);
    expect(event.defaultPrevented).toBe(false);
    expect(
      fixture.nativeElement.querySelector('.pull-to-refresh-indicator'),
    ).toBeNull();
  });
});
