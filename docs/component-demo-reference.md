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
