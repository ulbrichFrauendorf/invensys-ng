import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  effect,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutService } from './services/layout.service';
import { LayoutConfig } from './models/layout-config.model';
import { MenuModel } from './models/menu.model';

@Component({
  selector: 'i-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgClass, TopbarComponent, SidebarComponent, RouterOutlet],
})
export class LayoutComponent implements OnInit, OnDestroy {
  @Input() config!: LayoutConfig;
  @Input() menuModel: MenuModel[] = [];
  private routerSubscription: Subscription;

  constructor(
    public layoutService: LayoutService,
    public router: Router,
  ) {
    effect(() => {
      if (typeof document === 'undefined') {
        return;
      }

      const state = this.layoutService.state();
      const shouldBlockScroll = state.isMobileViewport && state.isSidebarOpen;
      document.body.classList.toggle('blocked-scroll', shouldBlockScroll);
    });

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const state = this.layoutService.state();
        if (state.isMobileViewport) {
          this.layoutService.closeSidebar();
        }
      });
  }

  ngOnInit(): void {
    this.syncViewportToCurrentWindow();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.syncViewportToCurrentWindow();
  }

  hideMenu() {
    this.layoutService.closeSidebar();
  }

  private syncViewportToCurrentWindow() {
    if (typeof window === 'undefined') {
      return;
    }

    this.layoutService.syncViewport(window.innerWidth);
  }

  containerClass = computed(() => {
    const layoutConfig = this.layoutService.config();
    const state = this.layoutService.state();
    return {
      'layout-static': true,
      'layout-static-inactive': !state.isMobileViewport && !state.isSidebarOpen,
      'layout-mobile-active': state.isMobileViewport && state.isSidebarOpen,
      'p-input-filled': layoutConfig.inputStyle === 'filled',
      'p-ripple-disabled': !layoutConfig.ripple,
    };
  });

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (typeof document !== 'undefined') {
      document.body.classList.remove('blocked-scroll');
    }
  }
}
