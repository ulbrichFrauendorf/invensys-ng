import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnDestroy,
  Renderer2,
  NgZone,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { IButton } from '../button/button.component';
import { ZIndexUtils } from '../../utils/zindexutils';

/**
 * Overlay Panel Component
 *
 * A floating panel that positions itself relative to a target element.
 * Modeled after PrimeNG's OverlayPanel with automatic positioning and collision detection.
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <i-button (clicked)="panel.toggle($event)">Show Panel</i-button>
 * <i-overlay-panel #panel>
 *   <p>Panel content goes here</p>
 * </i-overlay-panel>
 *
 * <!-- With custom position -->
 * <i-button (clicked)="panel2.toggle($event)">Show Panel</i-button>
 * <i-overlay-panel #panel2 [appendTo]="'body'">
 *   <p>This panel is appended to body</p>
 * </i-overlay-panel>
 * ```
 */
@Component({
  selector: 'i-overlay-panel',
  standalone: true,
  imports: [CommonModule, IButton],
  templateUrl: './overlay-panel.component.html',
  styleUrls: ['./overlay-panel.component.scss'],
  animations: [
    trigger('animation', [
      state(
        'void',
        style({
          transform: 'scaleY(0.8)',
          opacity: 0,
        })
      ),
      state(
        'open',
        style({
          transform: 'scaleY(1)',
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          transform: 'scaleY(0.8)',
          opacity: 0,
        })
      ),
      transition('void => open', animate('150ms ease-out')),
      transition('open => closed', animate('150ms ease-in')),
    ]),
  ],
})
export class IOverlayPanel implements OnDestroy {
  /**
   * Whether clicking outside closes the panel
   * @default true
   */
  @Input() dismissable = true;

  /**
   * Where to append the panel ('body' or null for inline)
   * @default 'body'
   */
  @Input() appendTo: 'body' | null = 'body';

  /**
   * Base z-index value
   * @default 1000
   */
  @Input() baseZIndex = 1000;

  /**
   * Auto z-index layering
   * @default true
   */
  @Input() autoZIndex = true;

  /**
   * Event emitted when panel shows
   */
  @Output() onShow = new EventEmitter<void>();

  /**
   * Event emitted when panel hides
   */
  @Output() onHide = new EventEmitter<void>();

  @ViewChild('container') containerViewChild?: ElementRef;

  visible = false;
  private target?: HTMLElement;
  private documentClickListener?: () => void;
  private documentResizeListener?: () => void;
  private scrollHandler?: any;
  private selfClick = false;
  private targetClick = false;
  overlayVisible = false;
  render = false;

  constructor(
    public el: ElementRef,
    private renderer: Renderer2,
    private zone: NgZone
  ) {}

  ngOnDestroy() {
    this.unbindDocumentClickListener();
    this.unbindScrollListener();
    this.unbindResizeListener();
    if (this.appendTo === 'body' && this.containerViewChild) {
      this.renderer.removeChild(
        document.body,
        this.containerViewChild.nativeElement
      );
    }
    this.target = undefined;
  }

  toggle(event: Event, target?: HTMLElement) {
    if (this.visible) {
      this.hide();
    } else {
      this.show(event, target || (event.currentTarget as HTMLElement));
    }
  }

  show(event: Event, target?: HTMLElement) {
    this.target = target || (event.currentTarget as HTMLElement);
    this.targetClick = true;

    if (this.visible) {
      return;
    }

    this.visible = true;
    this.render = true;
  }

  hide() {
    this.visible = false;
    this.unbindDocumentClickListener();
    this.unbindScrollListener();
    this.unbindResizeListener();
  }

  onAnimationStart(event: any) {
    if (event.toState === 'open') {
      const zIndexUtils = ZIndexUtils();
      this.containerViewChild!.nativeElement.style.zIndex = String(
        this.autoZIndex
          ? this.baseZIndex + zIndexUtils.getCurrent() + 1
          : this.baseZIndex
      );
      this.appendContainer();
      this.align();
      this.bindDocumentClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
      this.overlayVisible = true;
      this.onShow.emit();
    }
  }

  onAnimationEnd(event: any) {
    if (event.toState === 'closed') {
      if (this.appendTo === 'body' && this.containerViewChild) {
        this.renderer.removeChild(
          document.body,
          this.containerViewChild.nativeElement
        );
      }
      this.unbindDocumentClickListener();
      this.unbindScrollListener();
      this.unbindResizeListener();
      this.overlayVisible = false;
      this.onHide.emit();
      this.render = false;
    }
  }

  appendContainer() {
    if (this.appendTo === 'body') {
      this.renderer.appendChild(
        document.body,
        this.containerViewChild!.nativeElement
      );
    }
  }

  align() {
    if (!this.containerViewChild || !this.target) {
      return;
    }

    const container = this.containerViewChild.nativeElement;
    const target = this.target.getBoundingClientRect();
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const targetWidth = target.width;
    const targetHeight = target.height;
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const gap = 8;

    let top: number;
    let left: number;
    let arrowPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

    // Calculate best position
    const spaceBelow = viewport.height - (target.top + targetHeight);
    const spaceAbove = target.top;
    const spaceRight = viewport.width - (target.left + targetWidth);
    const spaceLeft = target.left;

    // Determine position based on available space
    if (spaceBelow >= containerHeight + gap) {
      // Position below
      top = target.top + targetHeight + gap;
      left = target.left + targetWidth / 2 - containerWidth / 2;
      arrowPosition = 'top';
    } else if (spaceAbove >= containerHeight + gap) {
      // Position above
      top = target.top - containerHeight - gap;
      left = target.left + targetWidth / 2 - containerWidth / 2;
      arrowPosition = 'bottom';
    } else if (spaceRight >= containerWidth + gap) {
      // Position right
      top = target.top + targetHeight / 2 - containerHeight / 2;
      left = target.left + targetWidth + gap;
      arrowPosition = 'left';
    } else if (spaceLeft >= containerWidth + gap) {
      // Position left
      top = target.top + targetHeight / 2 - containerHeight / 2;
      left = target.left - containerWidth - gap;
      arrowPosition = 'right';
    } else {
      // Default to below if no space
      top = target.top + targetHeight + gap;
      left = target.left + targetWidth / 2 - containerWidth / 2;
      arrowPosition = 'top';
    }

    // Keep within viewport bounds
    if (left < 10) {
      left = 10;
    } else if (left + containerWidth > viewport.width - 10) {
      left = viewport.width - containerWidth - 10;
    }

    if (top < 10) {
      top = 10;
    } else if (top + containerHeight > viewport.height - 10) {
      top = viewport.height - containerHeight - 10;
    }

    // Apply positioning
    container.style.top = top + 'px';
    container.style.left = left + 'px';
    container.className = `overlay-panel overlay-panel-${arrowPosition}`;
  }

  onContainerClick() {
    this.selfClick = true;
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener && this.dismissable) {
      this.zone.runOutsideAngular(() => {
        this.documentClickListener = this.renderer.listen(
          'document',
          'click',
          () => {
            if (!this.selfClick && !this.targetClick && this.visible) {
              this.zone.run(() => {
                this.hide();
              });
            }
            this.selfClick = false;
            this.targetClick = false;
          }
        );
      });
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = undefined;
    }
  }

  bindScrollListener() {
    if (!this.scrollHandler) {
      this.scrollHandler = () => {
        if (this.visible) {
          this.zone.run(() => {
            this.align();
          });
        }
      };
      window.addEventListener('scroll', this.scrollHandler, true);
    }
  }

  unbindScrollListener() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler, true);
      this.scrollHandler = null;
    }
  }

  bindResizeListener() {
    if (!this.documentResizeListener) {
      this.zone.runOutsideAngular(() => {
        this.documentResizeListener = this.renderer.listen(
          'window',
          'resize',
          () => {
            if (this.visible) {
              this.zone.run(() => {
                this.align();
              });
            }
          }
        );
      });
    }
  }

  unbindResizeListener() {
    if (this.documentResizeListener) {
      this.documentResizeListener();
      this.documentResizeListener = undefined;
    }
  }

  onEscapeKey() {
    if (this.dismissable) {
      this.hide();
    }
  }
}
