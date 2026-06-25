import { Component } from '@angular/core';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-layouts',
  imports: [DemoCardComponent, FeaturesListComponent],
  templateUrl: './layouts.component.html',
  styleUrl: './layouts.component.scss',
})
export class LayoutsComponent {
  // Code examples
  codeExamples = {
    basic: `import { Component } from '@angular/core';
import { LayoutComponent, MenuModel, LayoutConfig } from 'invensys-ng';

@Component({
  selector: 'app-root',
  template: \`
    <i-layout [config]="layoutConfig" [menuModel]="menuModel">
      <div topbarActions>
        <i-button [icon]="'pi pi-user'" />
      </div>
    </i-layout>
  \`,
  imports: [LayoutComponent]
})
export class AppComponent {
  layoutConfig: LayoutConfig = {
    websiteName: 'My Application',
    logoLight: 'assets/logo-light.png',
    logoDark: 'assets/logo-dark.png',
    showThemeToggle: true
  };

  menuModel: MenuModel[] = [
    {
      label: 'Main Menu',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: ['/dashboard']
        }
      ]
    }
  ];
}`,

    config: `interface LayoutConfig {
  websiteName: string;        // Required: Application name
  logoLight?: string;         // Logo for light theme
  logoDark?: string;          // Logo for dark theme
  showThemeToggle?: boolean;  // Show theme toggle (default: true)
}`,

    menu: `interface MenuItem {
  label: string;              // Menu item label
  icon?: string;              // PrimeIcons class name
  routerLink?: string[];      // Angular router link
  items?: MenuItem[];         // Nested menu items
  claim?: string;             // Optional claim for access control
}

interface MenuModel {
  label: string;              // Menu group label
  items: MenuItem[];          // Menu items in group
  separator?: boolean;        // Add separator after group
  claim?: string;             // Optional claim for group access control
}`,

    customTopbar: `<i-layout [config]="layoutConfig" [menuModel]="menuModel">
  <div topbarActions>
    <!-- Custom buttons and actions -->
    <i-button [icon]="'pi pi-bell'" [text]="true" />
    <i-button [icon]="'pi pi-user'" [text]="true" />
    <i-button severity="primary" size="small">Logout</i-button>
  </div>
</i-layout>`,

    nestedMenu: `menuModel: MenuModel[] = [
  {
    label: 'Getting Started',
    items: [
      {
        label: 'Installation',
        icon: 'pi pi-download',
        routerLink: ['/installation']
      },
      {
        label: 'Configuration',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Basic Setup',
            routerLink: ['/config/basic']
          },
          {
            label: 'Advanced Options',
            routerLink: ['/config/advanced']
          }
        ]
      }
    ],
    separator: true
  },
  {
    label: 'Components',
    items: [
      {
        label: 'Buttons',
        icon: 'pi pi-check-square',
        routerLink: ['/components/buttons']
      }
    ]
  }
]`,

    installation: `// Install the library
npm install invensys-ng

// Import in your component
import { LayoutComponent, MenuModel, LayoutConfig } from 'invensys-ng';

// Use in your template
<i-layout [config]="layoutConfig" [menuModel]="menuModel" />`,

    // Claims-based access control examples
    claimsService: `import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClaimsChecker } from 'invensys-ng';

@Injectable({ providedIn: 'root' })
export class ClaimsService implements ClaimsChecker {
  // In a real app, these would come from your authentication system
  private userClaims = ['view-dashboard', 'view-reports', 'admin-access'];

  hasClaim(claim: string): Observable<boolean> {
    // Check if the user has the specified claim
    return of(this.userClaims.includes(claim));
  }
}`,

    claimsProvider: `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideMenuClaimsChecker } from 'invensys-ng';
import { ClaimsService } from './services/claims.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // Use the provider function (recommended)
    provideMenuClaimsChecker(ClaimsService),
    
    // ... other providers
    provideRouter(routes),
    provideAnimationsAsync()
  ]
};`,

    claimsMenu: `// Menu with claims-based access control
menuModel: MenuModel[] = [
  {
    label: 'General',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/dashboard'],
        claim: 'view-dashboard'  // Only visible if user has this claim
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-line',
        routerLink: ['/reports'],
        claim: 'view-reports'
      }
    ]
  },
  {
    label: 'Administration',
    claim: 'admin-access',  // Entire group requires this claim
    items: [
      {
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: ['/admin/users']
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: ['/admin/settings'],
        claim: 'admin-settings'  // Additional claim on specific item
      }
    ]
  }
];

// Result: Only items the user has claims for will be visible
// If a group has no visible items, the entire group is hidden`,

    claimsManual: `// Manual provider configuration (alternative)
import { CLAIMS_CHECKER } from 'invensys-ng';
import { ClaimsService } from './services/claims.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: CLAIMS_CHECKER,
      useExisting: ClaimsService
    }
  ]
};`,

    claimsFeatures: `Key Features:
• Backward compatible - no claims checker = all items visible
• Performance optimized - claims checked in parallel
• Hierarchical support - claims at group, item, and nested levels
• Automatic cleanup - proper RxJS subscription management
• Smart filtering - empty groups automatically hidden`,
  };

  features: Feature[] = [
    {
      title: 'Responsive Design',
      description:
        'Automatically adapts to mobile and desktop with collapsible sidebar',
    },
    {
      title: 'Theme Support',
      description:
        'Built-in light/dark theme toggle with localStorage persistence',
    },
    {
      title: 'Router Integration',
      description:
        'Full Angular router support with active state highlighting',
    },
    {
      title: 'Customizable Topbar',
      description:
        'Add custom actions to the top-right section via ng-content',
    },
    {
      title: 'Nested Menus',
      description: 'Support for multi-level menu items with icons',
    },
    {
      title: 'Logo Theming',
      description:
        'Different logos for light and dark themes automatically switch',
    },
    {
      title: 'Mobile-Friendly',
      description:
        'Touch-optimized sidebar with overlay mode on mobile devices',
    },
    {
      title: 'State Management',
      description:
        'Built-in LayoutService for managing sidebar and viewport state',
    },
  ];

  components = [
    {
      name: 'i-layout',
      description: 'Main layout wrapper with sidebar, topbar, and content area',
    },
    {
      name: 'i-topbar',
      description: 'Top navigation bar with logo, menu toggle, and actions',
    },
    {
      name: 'i-sidebar',
      description: 'Sidebar container with menu navigation',
    },
    {
      name: 'i-menu',
      description: 'Recursive menu component with router integration',
    },
  ];
}
