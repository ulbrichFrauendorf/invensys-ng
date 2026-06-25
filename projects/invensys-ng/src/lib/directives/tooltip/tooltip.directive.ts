import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
  createComponent,
  ApplicationRef,
  Injector,
  EnvironmentInjector,
} from '@angular/core';
import { TooltipComponent, TooltipPosition } from './tooltip.component';

/**
 * Tooltip Directive
 *
 * Displays contextual tooltips on hover or focus.
 * Tooltips are appended to document.body with z-index: 10000 to ensure
 * they appear above all other elements including dialogs (z-index: 1000).
 *
 * @example
 * <button iTooltip="Click to save" tooltipPosition="above">Save</button>
 */
@Directive({
  selector: '[iTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('iTooltip') tooltipText: string = '';
  @Input() tooltipPosition: TooltipPosition = 'above';
  @Input() tooltipDelay: number = 500; // milliseconds

  private tooltipComponent: ComponentRef<TooltipComponent> | null = null;
  private showTimeout: any;
  private hideTimeout: any;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private applicationRef: ApplicationRef,
    private injector: Injector,
    private environmentInjector: EnvironmentInjector,
  ) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', () => {
      this.showTooltip();
    });

    this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => {
      this.hideTooltip();
    });

    this.renderer.listen(this.elementRef.nativeElement, 'focus', () => {
      this.showTooltip();
    });

    this.renderer.listen(this.elementRef.nativeElement, 'blur', () => {
      this.hideTooltip();
    });
  }

  private showTooltip(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    // Check for empty, null, or whitespace-only tooltip text
    if (
      !this.tooltipText ||
      !this.tooltipText.trim() ||
      this.tooltipComponent
    ) {
      return;
    }

    this.showTimeout = setTimeout(() => {
      this.createTooltip();
    }, this.tooltipDelay);
  }

  private hideTooltip(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }

    this.hideTimeout = setTimeout(() => {
      this.destroyTooltip();
    }, 100);
  }

  private createTooltip(): void {
    if (this.tooltipComponent) {
      return;
    }

    // Create the tooltip component
    this.tooltipComponent = createComponent(TooltipComponent, {
      environmentInjector: this.environmentInjector,
    });

    // Set the tooltip properties
    this.tooltipComponent.instance.text = this.tooltipText;
    this.tooltipComponent.instance.position = this.tooltipPosition;

    // Add a unique identifier to the tooltip element to avoid conflicts
    const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
    this.renderer.setAttribute(
      this.tooltipComponent.location.nativeElement,
      'id',
      tooltipId,
    );
    this.renderer.setAttribute(
      this.tooltipComponent.location.nativeElement,
      'data-tooltip-for',
      this.elementRef.nativeElement.id || 'unknown',
    );

    // Register with ApplicationRef for change detection first
    this.applicationRef.attachView(this.tooltipComponent.hostView);

    // Append to body
    document.body.appendChild(this.tooltipComponent.location.nativeElement);

    // Position the tooltip after a brief delay to ensure rendering
    requestAnimationFrame(() => {
      this.positionTooltip();
    });
  }

  private positionTooltip(): void {
    if (!this.tooltipComponent) return;

    const hostElement = this.elementRef.nativeElement;
    const tooltipElement = this.tooltipComponent.location.nativeElement;

    // Ensure we're working with the correct tooltip instance
    if (!tooltipElement || !document.body.contains(tooltipElement)) {
      return;
    }

    // Make tooltip visible but off-screen to measure its dimensions
    this.renderer.setStyle(tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(tooltipElement, 'visibility', 'hidden');
    this.renderer.setStyle(tooltipElement, 'top', '-9999px');
    this.renderer.setStyle(tooltipElement, 'left', '-9999px');
    this.renderer.setStyle(tooltipElement, 'z-index', '9999');

    // Force a layout to get accurate measurements
    tooltipElement.offsetHeight;

    const hostRect = hostElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();

    let top = 0;
    let left = 0;
    const gap = 8; // Gap between host and tooltip

    switch (this.tooltipPosition) {
      case 'above':
        top = hostRect.top - tooltipRect.height - gap + window.scrollY;
        left =
          hostRect.left +
          (hostRect.width - tooltipRect.width) / 2 +
          window.scrollX;
        break;
      case 'below':
        top = hostRect.bottom + gap + window.scrollY;
        left =
          hostRect.left +
          (hostRect.width - tooltipRect.width) / 2 +
          window.scrollX;
        break;
      case 'left':
        top =
          hostRect.top +
          (hostRect.height - tooltipRect.height) / 2 +
          window.scrollY;
        left = hostRect.left - tooltipRect.width - gap + window.scrollX;
        break;
      case 'right':
        top =
          hostRect.top +
          (hostRect.height - tooltipRect.height) / 2 +
          window.scrollY;
        left = hostRect.right + gap + window.scrollX;
        break;
    }

    // Ensure tooltip stays within viewport (using fixed positioning)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Convert back to viewport coordinates for boundary checking
    const viewportLeft = left - scrollX;
    const viewportTop = top - scrollY;

    // Adjust horizontal position if tooltip goes outside viewport
    if (viewportLeft < gap) {
      left = gap + scrollX;
    } else if (viewportLeft + tooltipRect.width > viewportWidth - gap) {
      left = viewportWidth - tooltipRect.width - gap + scrollX;
    }

    // Adjust vertical position if tooltip goes outside viewport
    if (viewportTop < gap) {
      top = gap + scrollY;
    } else if (viewportTop + tooltipRect.height > viewportHeight - gap) {
      top = viewportHeight - tooltipRect.height - gap + scrollY;
    }

    // Apply final position and make visible
    // Use z-index 10000 to ensure tooltips appear above dialogs (z-index: 1000)
    this.renderer.setStyle(tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(tooltipElement, 'z-index', '10000');
    this.renderer.setStyle(tooltipElement, 'visibility', 'visible');
  }

  private destroyTooltip(): void {
    if (this.tooltipComponent) {
      const tooltipElement = this.tooltipComponent.location.nativeElement;

      // Remove from DOM first
      if (tooltipElement && document.body.contains(tooltipElement)) {
        document.body.removeChild(tooltipElement);
      }

      // Then cleanup Angular references
      this.applicationRef.detachView(this.tooltipComponent.hostView);
      this.tooltipComponent.destroy();
      this.tooltipComponent = null;
    }
  }

  ngOnDestroy(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.destroyTooltip();
  }
}
