import { Component } from '@angular/core';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import { IMessage } from '../../../../../invensys-ng/src/lib/components/message/message.component';

@Component({
  selector: 'app-theming',
  imports: [DemoCardComponent, IMessage],
  templateUrl: './theming.component.html',
  styleUrl: './theming.component.scss',
})
export class ThemingComponent {
  themeFileCode = `.light {
  --color-primary: #f97316;
  --color-secondary: #374151;
  --color-tertiary: #64748b;
  --color-success: #22c55e;
  --color-info: #0ea5e9;
  --color-warning: #eab308;
  --color-danger: #ef4444;
  --color-contrast: #000000;
  --color-contrast-inverse: #ffffff;

  --color-text-primary: #374151;
  --color-text-contrast: #ffffffde;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #64748b;
  --color-text-disabled: #374151;

  --color-component-background: #ffffff;
  --color-component-background-secondary: #ffffff;
  --color-component-background-solid: #0f172a;

  --color-border: #d1d5db;
  --color-disabled-background: #f5f5f5;
  --color-disabled-border: #e2e8f0;

  --surface-ground: #f8fafc;
  --surface-elevated: #ffffff;
  --surface-section: #ffffff;
  --surface-card: #ffffff;
  --surface-overlay: #ffffff;
  --surface-border: #e2e8f0;
  --surface-hover: #f1f5f9;
}

.dark {
  --color-primary: #eab308;
  --color-secondary: #d1d5db;
  --color-tertiary: #64748b;
  --color-success: #4ade80;
  --color-info: #38bdf8;
  --color-warning: #facc15;
  --color-danger: #f87171;
  --color-contrast: #ffffff;
  --color-contrast-inverse: #000000;

  --color-text-primary: #ffffffde;
  --color-text-contrast: #ffffffde;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #64748b;
  --color-text-disabled: #ffffffde;

  --color-component-background: #0b121c;
  --color-component-background-secondary: #000510;
  --color-component-background-solid: #0f172a;

  --color-border: #5e564b;
  --color-disabled-background: #1f2937;
  --color-disabled-border: #4b4e50;

  --surface-ground: #000510;
  --surface-elevated: #1f2937;
  --surface-section: #111827;
  --surface-card: #0b121c;
  --surface-overlay: #0b121c;
  --surface-border: #4b4e50;
  --surface-hover: rgba(255, 255, 255, 0.03);
}`;

  importThemeCode = `@use "invensys-ng/src/lib/themes/theme.scss" as invensys-theme;

@include invensys-theme.define-theme();`;

  advancedThemeCode = `@use "invensys-ng/src/lib/themes/colors.theme.scss" as colors-theme;
@use "invensys-ng/src/lib/themes/typography.theme.scss" as typography-theme;
@use "invensys-ng/src/lib/themes/scrollbar.theme.scss" as scrollbar-theme;
@use "invensys-ng/src/lib/themes/scrollbar-mixins.scss" as scrollbar;
@use "invensys-ng/src/lib/themes/color-variables.scss" as vars;

@include colors-theme.define-color-palette(light);
@include colors-theme.define-color-palette(dark);
@include scrollbar-theme.define-scrollbar-theme();
@include typography-theme.define-typography();

html,
body {
  background-color: vars.$color-surface-ground;
  color: vars.$color-text-primary;
  @include scrollbar.themed-scrollbar();
}`;

  addClassToBodyCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My App</title>
  </head>
  <body class="light">
    <app-root></app-root>
  </body>
</html>`;

  toggleThemeCode = `export class AppComponent {
  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }
}`;

  themeButtonCode = `<button (click)="toggleTheme()">
  Toggle Theme
</button>`;
}
