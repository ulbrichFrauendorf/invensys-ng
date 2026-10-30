import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICarousel } from '../../../../../invensys-ng/src/lib/components/carousel/carousel.component';
import { ICarouselItem } from '../../../../../invensys-ng/src/lib/components/carousel/carousel-item.directive';
import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-carousels',
  standalone: true,
  imports: [
    ICarousel,
    ICarouselItem,
    DemoPlaygroundComponent,
    DemoOptionDirective,
  ],
  templateUrl: './carousels.component.html',
  styleUrl: './carousels.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselsComponent {
  activeIndex = 0;
  readonly sourceCode = `<i-carousel [(activeIndex)]="activeIndex" ariaLabel="Featured tools">
  <section iCarouselItem><h3>Reports</h3></section>
  <section iCarouselItem><h3>Onboarding</h3></section>
  <section iCarouselItem><h3>Automations</h3></section>
</i-carousel>`;
  readonly tsCode = `import { ICarousel, ICarouselItem } from 'invensys-ng';`;
  readonly fullWidthSourceCode = `<i-carousel [fullWidth]="true" [showNavigators]="true" ariaLabel="Featured tools">
  <section iCarouselItem><h3>Reports</h3></section>
  <section iCarouselItem><h3>Onboarding</h3></section>
  <section iCarouselItem><h3>Automations</h3></section>
</i-carousel>`;
}
