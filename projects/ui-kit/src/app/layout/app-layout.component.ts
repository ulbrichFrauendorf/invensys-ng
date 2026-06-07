import { Component } from '@angular/core';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { LayoutConfig } from '@shared/components/layout/models/layout-config.model';
import { MenuModel } from '@shared/components/layout/models/menu.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    <i-layout [config]="layoutConfig" [menuModel]="menuModel">
      <ng-container topbarActions>
        <!-- Additional topbar actions can be added here if needed -->
      </ng-container>
    </i-layout>
  `,
})
export class AppLayoutComponent {
  layoutConfig: LayoutConfig = {
    websiteName: 'Integra-NG',
    logoLight: 'assets/layout/images/invensys-icon-light.png',
    logoDark: 'assets/layout/images/invensys-icon-dark.png',
    showThemeToggle: true,
    enablePullToRefresh: true,
  };

  menuModel: MenuModel[] = [
    {
      label: 'Getting Started',
      items: [
        {
          label: 'Installation',
          icon: 'pi pi-fw pi-download',
          routerLink: ['/getting-started/installation'],
        },
        {
          label: 'Theming',
          icon: 'pi pi-fw pi-palette',
          routerLink: ['/getting-started/theming'],
        },
      ],
    },
    {
      label: 'Form Controls',
      items: [
        {
          label: 'Input Texts',
          icon: 'pi pi-fw pi-pencil',
          routerLink: ['/components/input-texts'],
        },
        {
          label: 'Textareas',
          icon: 'pi pi-fw pi-align-left',
          routerLink: ['/components/textareas'],
        },
        {
          label: 'Checkboxes',
          icon: 'pi pi-fw pi-check-square',
          routerLink: ['/components/checkboxes'],
        },
        {
          label: 'Toggles',
          icon: 'pi pi-fw pi-toggle-on',
          routerLink: ['/components/toggles'],
        },
        {
          label: 'Radio Buttons',
          icon: 'pi pi-fw pi-circle',
          routerLink: ['/components/radio-buttons'],
        },
        {
          label: 'Selects',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/components/selects'],
        },
        {
          label: 'Multi Selects',
          icon: 'pi pi-fw pi-th-large',
          routerLink: ['/components/multi-selects'],
        },
        {
          label: 'Listboxes',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/components/listboxes'],
        },
        {
          label: 'Calendars',
          icon: 'pi pi-fw pi-calendar',
          routerLink: ['/components/calendars'],
        },
      ],
    },
    {
      label: 'Buttons & Actions',
      items: [
        {
          label: 'Buttons',
          icon: 'pi pi-fw pi-external-link',
          routerLink: ['/components/buttons'],
        },
        {
          label: 'Chips',
          icon: 'pi pi-fw pi-tag',
          routerLink: ['/components/chips'],
        },
        {
          label: 'Tags',
          icon: 'pi pi-fw pi-bookmark',
          routerLink: ['/components/tags'],
        },
      ],
    },
    {
      label: 'Layout & Containers',
      items: [
        {
          label: 'Layouts',
          icon: 'pi pi-fw pi-objects-column',
          routerLink: ['/components/layouts'],
        },
        {
          label: 'Cards',
          icon: 'pi pi-fw pi-id-card',
          routerLink: ['/components/cards'],
        },
        {
          label: 'Dividers',
          icon: 'pi pi-fw pi-minus',
          routerLink: ['/components/dividers'],
        },
        {
          label: 'Panels',
          icon: 'pi pi-fw pi-window-maximize',
          routerLink: ['/components/panels'],
        },
        {
          label: 'Tabs',
          icon: 'pi pi-fw pi-folder',
          routerLink: ['/components/tabs'],
        },
        {
          label: 'Accordions',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/components/accordions'],
        },
      ],
    },
    {
      label: 'Data Display',
      items: [
        {
          label: 'Tables',
          icon: 'pi pi-fw pi-table',
          routerLink: ['/components/tables'],
        },
        {
          label: 'Tree Views',
          icon: 'pi pi-fw pi-sitemap',
          routerLink: ['/components/tree-views'],
        },
        {
          label: 'Charts',
          icon: 'pi pi-fw pi-chart-bar',
          routerLink: ['/components/charts'],
        },
      ],
    },
    {
      label: 'Overlays',
      items: [
        {
          label: 'Dialogs',
          icon: 'pi pi-fw pi-window-maximize',
          routerLink: ['/components/dialogs'],
        },
        {
          label: 'Confirmation Dialogs',
          icon: 'pi pi-fw pi-question-circle',
          routerLink: ['/components/confirmation-dialogs'],
        },
        {
          label: 'Overlay Panels',
          icon: 'pi pi-fw pi-window-maximize',
          routerLink: ['/components/overlay-panels'],
        },
        {
          label: 'Tooltips',
          icon: 'pi pi-fw pi-info-circle',
          routerLink: ['/components/tooltips'],
        },
        {
          label: 'No Content',
          icon: 'pi pi-fw pi-inbox',
          routerLink: ['/components/no-content'],
        },
      ],
    },
    {
      label: 'Feedback & Messages',
      items: [
        {
          label: 'Messages',
          icon: 'pi pi-fw pi-info-circle',
          routerLink: ['/components/messages'],
        },
        {
          label: 'Whispers',
          icon: 'pi pi-fw pi-comment',
          routerLink: ['/components/whispers'],
        },
        {
          label: 'Progress Spinners',
          icon: 'pi pi-fw pi-spin pi-spinner',
          routerLink: ['/components/progress-spinners'],
        },
        {
          label: 'Placeholders',
          icon: 'pi pi-fw pi-stop',
          routerLink: ['/components/placeholders'],
        },
      ],
    },
    {
      label: 'Examples',
      items: [
        {
          label: 'Component Interactions',
          icon: 'pi pi-fw pi-sitemap',
          routerLink: ['/components/component-interactions'],
        },
      ],
    },
  ];
}
