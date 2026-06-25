import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { ISeverity } from '@shared/enums/IButtonSeverity';
import { IProgressSpinner } from '../progress-spinner/progress-spinner.component';

/**
 * Supported button sizes
 */
export type IButtonSize = 'xtra-small' | 'small' | 'medium' | 'large';

/**
 * Button Component
 *
 * A customizable button component with multiple styles and sizes.
 * Supports icons, different severity levels, and various visual states.
 *
 * @example
 * ```html
 * <!-- Basic button -->
 * <i-button>Click Me</i-button>
 *
 * <!-- Button with icon and severity -->
 * <i-button
 *   severity="primary"
 *   icon="pi pi-check"
 *   (clicked)="onSave()">
 *   Save
 * </i-button>
 *
 * <!-- Icon-only button -->
 * <i-button
 *   icon="pi pi-trash"
 *   severity="danger"
 *   [outlined]="true">
 * </i-button>
 *
 * <!-- Fluid button (full width) -->
 * <i-button [fluid]="true">Full Width Button</i-button>
 * ```
 *
 * @remarks
 * The button automatically detects if it's icon-only and adjusts its styling accordingly.
 */
@Component({
  selector: 'i-button',
  standalone: true,
  imports: [NgClass, IProgressSpinner],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class IButton implements AfterViewInit {
  @HostBinding('class.i-button-fluid') get fluidClass() {
    return this.fluid;
  }
  /**
   * Visual severity/style of the button
   * @default 'primary'
   */
  @Input() severity: ISeverity = 'primary';

  /**
   * Size of the button
   * @default 'medium'
   */
  @Input() size: IButtonSize = 'medium';

  /**
   * HTML button type attribute
   * @default 'button'
   */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Whether the button is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Whether to display outlined style
   * @default false
   */
  @Input() outlined = false;

  /**
   * Whether to display raised (elevated) style
   * @default false
   */
  @Input() raised = false;

  /**
   * Whether to display text-only style (no background)
   * @default false
   */
  @Input() text = false;

  /**
   * Icon class name (e.g., 'pi pi-check')
   */
  @Input() icon?: string;

  /**
   * Whether the button should take full width of its container
   * @default false
   */
  @Input() fluid = false;

  /**
   * Whether the button is in a loading state
   * Shows a spinner and hides button content
   * @default false
   */
  @Input() loading = false;

  /**
   * Event emitted when the button is clicked
   */
  @Output() clicked = new EventEmitter<Event>();

  /**
   * Reference to the projected content element
   * @internal
   */
  @ViewChild('projected', { read: ElementRef })
  projected?: ElementRef<HTMLElement>;

  /**
   * Reference to the native button element
   * @internal
   */
  @ViewChild('buttonElement', { read: ElementRef })
  private buttonElement?: ElementRef<HTMLButtonElement>;

  /**
   * Whether the button is icon-only (no text content)
   * @internal
   */
  iconOnly = false;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-button-');

  constructor(private cdr: ChangeDetectorRef, public el: ElementRef) {}

  ngAfterViewInit(): void {
    const text = this.projected?.nativeElement?.textContent;
    const hasProjected = text && text.trim()?.length > 0;
    this.iconOnly = !!this.icon && !hasProjected;
    this.cdr.detectChanges();
  }

  /**
   * Focuses the underlying native button element.
   * Use this instead of accessing `nativeElement` directly.
   */
  focus(): void {
    this.buttonElement?.nativeElement?.focus();
  }
}
