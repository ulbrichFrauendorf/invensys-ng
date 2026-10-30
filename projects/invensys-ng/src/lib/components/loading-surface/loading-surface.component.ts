import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Internal loading presentation; public controls own their loading inputs and values. */
@Component({
  selector: 'i-loading-surface',
  imports: [],
  templateUrl: './loading-surface.component.html',
  styleUrl: './loading-surface.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.loading-surface-fill]': 'fillContainer()' },
})
export class LoadingSurfaceComponent {
  readonly loading = input(false);
  readonly variant = input<'field' | 'list' | 'table' | 'chart' | 'inline'>(
    'list',
  );
  readonly minimumHeight = input('10rem');
  /** Keeps projected content within a height supplied by its parent. */
  readonly fillContainer = input(false);
  readonly ariaLabel = input('Loading data');
  readonly rows = [0, 1, 2, 3, 4];
}
