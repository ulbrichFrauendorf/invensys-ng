import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Wraps card button tiles based on the group's available width. */
@Component({
  selector: '[iCardButtonGroup]',
  template: '<ng-content />',
  styleUrl: './card-button-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.i-card-button-group-compact]': 'compact()' },
})
export class ICardButtonGroup {
  /** Uses a narrower tile width for sidebars and tool selectors. */
  readonly compact = input(false, { transform: booleanAttribute });
}
