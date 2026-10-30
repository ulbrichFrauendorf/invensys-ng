import { Directive, ElementRef, inject } from '@angular/core';

/** Identifies a projected slide; content remains owned by the consumer. */
@Directive({
  selector: '[iCarouselItem]',
  standalone: true,
  host: {
    '[style.flex]': "'var(--carousel-item-flex, 0 0 auto)'",
    '[style.min-width.px]': '0',
    '[style.max-width]': "'100%'",
    '[style.scroll-snap-align]': "'start'",
  },
})
export class ICarouselItem {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
}
