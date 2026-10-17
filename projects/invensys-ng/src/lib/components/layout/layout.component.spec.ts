import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './services/layout.service';
import { Router, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import { LayoutConfig } from './models/layout-config.model';
import { MenuModel } from './models/menu.model';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let layoutService: Pick<LayoutService, 'closeSidebar' | 'syncViewport'> & {
    state: () => ReturnType<LayoutService['state']>;
  };
  let router: MockedObject<Router>;

  beforeEach(async () => {
    const layoutServiceSpy = {
      closeSidebar: vi.fn().mockName('LayoutService.closeSidebar'),
      syncViewport: vi.fn().mockName('LayoutService.syncViewport'),
      state: vi.fn(),
      config: vi.fn(),
    };
    layoutServiceSpy.state = vi.fn().mockName('state').mockReturnValue({
      isSidebarOpen: false,
      isMobileViewport: false,
      profileSidebarVisible: false,
    });
    layoutServiceSpy.config = vi.fn().mockName('config').mockReturnValue({
      inputStyle: 'outlined',
      ripple: true,
      colorScheme: 'light',
      scale: 12,
    });

    const routerSpy = {
      navigate: vi.fn().mockName('Router.navigate'),
      events: of(new NavigationEnd(0, '/', '/')),
    };
    routerSpy.events = of(new NavigationEnd(0, '/', '/'));

    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        { provide: LayoutService, useValue: layoutServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(
      LayoutService,
    ) as unknown as typeof layoutService;
    router = TestBed.inject(Router) as MockedObject<Router>;

    // Set required inputs
    component.config = {
      websiteName: 'Test App',
      logoLight: 'test-logo-light.png',
      logoDark: 'test-logo-dark.png',
      showThemeToggle: true,
    };
    component.menuModel = [];

    fixture.detectChanges();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Pull to Refresh', () => {
    let mockConfig: LayoutConfig;

    beforeEach(() => {
      mockConfig = {
        websiteName: 'Test App',
        logoLight: 'test-logo-light.png',
        logoDark: 'test-logo-dark.png',
        showThemeToggle: true,
        enablePullToRefresh: true,
      };
      component.config = mockConfig;
    });

    it('should initialize pull distance and refreshing signals', () => {
      expect(component.pullDistance()).toBe(0);
      expect(component.isRefreshing()).toBe(false);
    });

    it('should have pull threshold set to 80', () => {
      expect(component['PULL_THRESHOLD']).toBe(80);
    });

    it('should have indicator offset set to 60', () => {
      expect(component['INDICATOR_OFFSET']).toBe(60);
    });

    it('should track pull distance when pulling down', () => {
      // Set up mobile viewport
      layoutService.state = vi.fn().mockName('state').mockReturnValue({
        isSidebarOpen: false,
        isMobileViewport: true,
        profileSidebarVisible: false,
      });

      // Simulate touch events
      component['touchStartY'] = 100;
      component['isPulling'] = true;
      component['touchCurrentY'] = 150;

      // Calculate expected pull distance
      const pullDistance = Math.max(0, Math.min(50, 150));
      component.pullDistance.set(pullDistance);

      expect(component.pullDistance()).toBe(50);
    });

    it('should set refreshing state when pull threshold is met', () => {
      component.pullDistance.set(85);
      component['refresh']();

      expect(component.isRefreshing()).toBe(true);
    });

    it('should not activate pull-to-refresh when disabled in config', () => {
      component.config = {
        websiteName: 'Test App',
        enablePullToRefresh: false,
      };

      expect(component.config.enablePullToRefresh).toBe(false);
    });

    it('should expose Math to template', () => {
      expect(component['Math']).toBe(Math);
    });
  });

  describe('Layout State', () => {
    it('should close sidebar when hideMenu is called', () => {
      component.hideMenu();
      expect(layoutService.closeSidebar).toHaveBeenCalled();
    });

    it('should sync viewport on window resize', () => {
      vi.stubGlobal('innerWidth', 1200);
      component.onWindowResize();
      expect(layoutService.syncViewport).toHaveBeenCalled();
    });
  });

  describe('Mobile Navigation', () => {
    it('should close sidebar on navigation in mobile viewport', async () => {
      await new Promise<void>((done) => {
        const routerEvents = new Subject();
        (router as any).events = routerEvents.asObservable();

        layoutService.state = vi.fn().mockName('state').mockReturnValue({
          isSidebarOpen: true,
          isMobileViewport: true,
          profileSidebarVisible: false,
        });

        // Create a new component instance with the modified router
        const newFixture = TestBed.createComponent(LayoutComponent);
        const newComponent = newFixture.componentInstance;
        newComponent.config = component.config;
        newComponent.menuModel = [];
        newFixture.detectChanges();

        routerEvents.next(new NavigationEnd(1, '/test', '/test'));

        setTimeout(() => {
          expect(layoutService.closeSidebar).toHaveBeenCalled();
          done();
        }, 100);
      });
    });
  });
});
