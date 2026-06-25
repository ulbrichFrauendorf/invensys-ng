# Invensys NG

A modern Angular component library for enterprise apps.

## Project Website

[invensys.web.za](https://invensys.web.za)

## Installation

```bash
npm install invensys-ng
```

## Theme Setup

Import the bundled theme once from your application `styles.scss`:

```scss
@use "invensys-ng/src/lib/themes/theme.scss" as invensys-theme;

@include invensys-theme.define-theme();
```

For explicit control, import the theme pieces separately:

```scss
@use "invensys-ng/src/lib/themes/colors.theme.scss" as colors-theme;
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
}
```
