import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

/** A single step rendered inside an {@link IStepper}. */
@Component({
  selector: 'i-step',
  standalone: true,
  template: `
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class IStep {
  /** Primary text shown in the step navigation. */
  @Input({ required: true }) label!: string;

  /** Optional supporting text shown below the label. */
  @Input() description?: string;

  /** Optional PrimeIcons class used instead of the step number. */
  @Input() icon?: string;

  /** Marks the step as successfully completed. */
  @Input() completed = false;

  /** Marks the step as optional. */
  @Input() optional = false;

  /** Prevents the step from being selected. */
  @Input() disabled = false;

  /** Projected step content. */
  @ViewChild('contentTemplate', { static: true })
  contentTemplate!: TemplateRef<unknown>;
}
