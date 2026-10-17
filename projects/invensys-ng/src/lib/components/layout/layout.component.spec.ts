import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './services/layout.service';

@Component({ template: '' })
class TestPage {}

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;
  let component: LayoutComponent;
  let service: LayoutService;
  let container: HTMLElement;
  let previousFontSize: string;

  beforeEach(async () => {
    previousFontSize = document.documentElement.style.fontSize;
    vi.stubGlobal('innerWidth', 390);
    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([{ path: 'test', component: TestPage }])],
    });
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(LayoutService);
    fixture.componentRef.setInput('config', {
      websiteName: 'Test App',
      enablePullToRefresh: true,
    });
    fixture.componentRef.setInput('menuModel', []);
    await fixture.whenStable();
    container = fixture.nativeElement.querySelector('.layout-main-container');
  });

  afterEach(() => {
    fixture.destroy();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.classList.remove('blocked-scroll');
    document.documentElement.style.fontSize = previousFontSize;
  });

  function touch(
    type: string,
    x: number,
    y: number,
    target: HTMLElement = container,
  ) {
    const touches =
      type === 'touchend'
        ? []
        : [new Touch({ identifier: 1, target, clientX: x, clientY: y })];
    target.dispatchEvent(
      new TouchEvent(type, { touches, bubbles: true, cancelable: true }),
    );
  }

  it('renders the configured title and mobile layout', () => {
    expect(fixture.nativeElement.textContent).toContain('Test App');
    expect(service.state().isMobileViewport).toBe(true);
    expect(component.pullDistance()).toBe(0);
    expect(component.isRefreshing()).toBe(false);
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

  it('tracks a downward pull and resets when released below the threshold', () => {
    touch('touchstart', 50, 100);
    touch('touchmove', 50, 150);
    expect(component.pullDistance()).toBe(50);
    touch('touchend', 50, 150);
    expect(component.pullDistance()).toBe(0);
    expect(component.isRefreshing()).toBe(false);
  });

  it('caps pull distance and shows the refreshing state after release', async () => {
    vi.useFakeTimers();
    touch('touchstart', 50, 100);
    touch('touchmove', 50, 500);
    expect(component.pullDistance()).toBe(150);
    touch('touchend', 50, 500);
    expect(component.isRefreshing()).toBe(true);
    expect(component.pullDistance()).toBe(0);
    await vi.advanceTimersByTimeAsync(16);
    expect(fixture.nativeElement.textContent).toContain('Refreshing...');
    fixture.destroy();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('leaves horizontal gestures to the content', () => {
    touch('touchstart', 50, 100);
    touch('touchmove', 200, 120);
    expect(component.pullDistance()).toBe(0);
    touch('touchend', 200, 120);
    expect(component.isRefreshing()).toBe(false);
  });

  it('leaves form control gestures to the control', () => {
    const button = document.createElement('button');
    container.appendChild(button);
    touch('touchstart', 50, 100, button);
    touch('touchmove', 50, 200, button);
    expect(component.pullDistance()).toBe(0);
  });

  it('does not pull while the content is scrolled', () => {
    Object.defineProperty(container, 'scrollTop', {
      value: 20,
      configurable: true,
    });
    touch('touchstart', 50, 100);
    touch('touchmove', 50, 200);
    expect(component.pullDistance()).toBe(0);
  });

  it('does not activate pull to refresh on desktop', async () => {
    vi.stubGlobal('innerWidth', 1280);
    window.dispatchEvent(new Event('resize'));
    await fixture.whenStable();
    touch('touchstart', 50, 100);
    touch('touchmove', 50, 200);
    expect(component.pullDistance()).toBe(0);
  });

  it('removes gesture listeners when destroyed', () => {
    fixture.destroy();
    touch('touchstart', 50, 100);
    touch('touchmove', 50, 200);
    expect(component.pullDistance()).toBe(0);
  });
});
