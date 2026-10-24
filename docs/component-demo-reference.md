# Component demo reference

The approved Confirmation Dialog demo source checkpoint is dated 15 October 2026. The reusable `DemoPlaygroundComponent` now provides that structure for the component examples. Installation and Theming keep their documentation layouts.

## Use the wrapper

Add `DemoPlaygroundComponent` and `DemoOptionDirective` to a demo's standalone imports, then declare one option template for each example:

```html
<app-demo-playground
  class="buttons-demo"
  title="Button Components"
  description="Choose the button examples to include."
>
  <ng-template
    appDemoOption="severities"
    label="Severity variants"
    [sourceCode]="codeExamples.severities"
    [selected]="true"
  >
    <div class="button-examples">
      <i-button severity="primary">Primary</i-button>
      <i-button severity="success">Success</i-button>
    </div>
  </ng-template>
</app-demo-playground>
```

Each option appears as a checkbox. Checked examples render together in the single preview, and the code view combines their copyable snippets. If an option needs editable values, use the `appDemoOptions` template slot; use `appDemoPreview` and `appDemoUsage` when the component needs a custom preview or notes. The Confirmation Dialog demonstrates all three slots while retaining its configurable service call.

The wrapper owns the sticky preview card, icon-only Preview/Code toggle, vertical option list, and Usage Notes section. Its markup and styling live in:

- `projects/ui-kit/src/app/components/demo-playground/`
- `projects/ui-kit/src/app/components/demo-playground.styles.scss`
- `projects/ui-kit/src/app/components/demo-playground.theme.scss`

Keep example-specific preview rules in the demo stylesheet, put colors in theme styles, and let application typography style headings and paragraphs. Use pixel units for fixed sizes and spacing; do not use `rem`.

## Snapshot

[`snapshots/confirmation-dialog-demo-2026-10-15.zip`](snapshots/confirmation-dialog-demo-2026-10-15.zip) preserves the original approved page and theme with repository-relative paths. Its JSON manifest records SHA-256 hashes. This source checkpoint does not change Git history.

The live wrapper-based reference is `/components/confirmation-dialogs` in the UI kit.


## Mobile behavior

Single and multiple selects use HTML `select` controls on touch devices at widths up to 991px. The browser supplies the option picker; native searching and multiple-selection presentation depend on the platform. Object values, Angular form updates, disabled states, blur handling, clear buttons, and validation messages are retained. Set `[nativeOnMobile]="false"` to retain the custom searchable popup on mobile, for example when a long option list requires the library's filter.

Use the Selects and Multi Selects demos to check selection, clearing, external form resets, and disabled controls on a phone. Also check a short landscape viewport for dialog scrolling and calendar visibility. The demo preview is in normal document flow on narrow screens so it does not cover the options beneath it. Touch controls have larger targets and editable text uses at least 16px to avoid mobile focus zoom.

Selects share the same visible field in desktop and touch modes. Custom option panels use connected overlays to avoid clipping inside scrolling cards. Chips are plain collections: `label` supplies an accessible name, and the legacy `useFloatLabel` input no longer renders a visible label. Clear actions stay inside their own containers.

Run the form, layout, focus, and hit-target regression checks in desktop and coarse-pointer Chrome with:

```sh
npm run test:frontend
```

This checks native control wiring and touch CSS; verify the operating system picker itself on physical iOS and Android devices before release.

## Styling verification — 24 October 2026

The library's `page-layout` applies the shared shadow token when its content header snaps, using the desktop content scrollport or mobile shell scrollport, and clears it when the header returns. Its existing desktop/touch regressions cover this behavior with and without a sidebar. The `card-button` clips the nested card surface to its rounded boundary so the primary selection border stays visible. The `stepper` uses a transparent bottom border for inactive and completed steps; only the active, incomplete step has the primary underline.

The Radio Buttons, Checkboxes, and Toggles demos wrap each example in an `i-panel` with `[toggleable]="false"`. These changes follow the shared Angular requirements for library controls, theme-owned colors, nested SCSS, and preserved public inputs.

Verification: production library/UI-kit/catalog build passed, as did 32 page-layout/layout browser tests, 5 card-button tests, and 13 stepper tests. Prettier checked only the changed `.ts`, `.html`, and `.scss` files, using the sibling iTrace frontend configuration because this checkout has no Prettier configuration. The build retains its existing confirmation-dialog dynamic/static import warning.

Local production previews were checked in Chrome at 1440px and 390px in light and dark themes. All 17 form-control examples remained open in fixed panels; card selection, completed-step underlines, and header snap/return states were checked. Space still changes radio, checkbox, and toggle values within the panels; Enter selects a card with a visible keyboard focus outline. Phone-sized browser emulation does not verify physical-device rendering.
