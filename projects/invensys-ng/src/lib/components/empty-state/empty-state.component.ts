import {
  Component,
  Input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Empty State Component
 *
 * Displays an illustration and message when no content is available.
 * Useful for empty lists, search results, or initial states.
 *
 * @example
 * ```html
 * <!-- Basic empty state -->
 * <i-empty-state></i-empty-state>
 *
 * <!-- Fixed position (doesn't scroll with content) -->
 * <i-empty-state [fixed]="true"></i-empty-state>
 *
 * <!-- With dark color scheme -->
 * <i-empty-state [colorScheme]="colorSchemeSignal"></i-empty-state>
 * ```
 *
 * @remarks
 * Use the fixed property when you want the empty state to remain
 * centered regardless of scroll position.
 */
@Component({
  selector: 'i-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  /**
   * Whether the empty state should be fixed position
   * @default false
   */
  @Input() fixed: boolean = false;

  /**
   * Color scheme signal for theming
   * @default signal('light')
   */
  @Input() colorScheme = signal<string>('light');

  /**
   * Tracks whether the illustration image has loaded
   * @internal
   */
  imageLoaded: boolean = false;

  /**
   * Marks the image ready; CSS owns the fade transition
   * @internal
   */
  onImageLoad(): void {
    this.imageLoaded = true;
  }
}
