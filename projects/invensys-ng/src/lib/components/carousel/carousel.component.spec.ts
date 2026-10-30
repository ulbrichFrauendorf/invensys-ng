import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ICarousel } from './carousel.component';
import { ICarouselItem } from './carousel-item.directive';

@Component({
  imports: [ICarousel, ICarouselItem],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<i-carousel [(activeIndex)]="index" ariaLabel="Tools">
    @for (item of items; track item) {
      <section iCarouselItem>
        <button>{{ item }}</button>
      </section>
    }
  </i-carousel>`,
})
class Host {
  index = 0;
  items = ['Reports', 'Onboarding', 'Automations'];
}

describe('ICarousel', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.nativeElement.style.width = '360px';
    fixture.detectChanges();
    await fixture.whenStable();
    return {
      fixture,
      carousel: fixture.debugElement.query(By.directive(ICarousel))
        .componentInstance as ICarousel,
    };
  }

  it('moves with bounded controls and updates the bound index', async () => {
    const { fixture, carousel } = await setup();
    carousel.goTo(1);
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(1);
    carousel.goTo(99);
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(2);
    expect(
      fixture.nativeElement.querySelector('[aria-label="Next slide"]').disabled,
    ).toBe(true);
    carousel.goTo(-1);
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(0);
    expect(
      fixture.nativeElement.querySelector('[aria-label="Previous slide"]')
        .disabled,
    ).toBe(true);
  });

  it('uses one horizontal slide at a time and supports keyboard navigation', async () => {
    const { fixture, carousel } = await setup();
    const viewport: HTMLElement = fixture.nativeElement.querySelector(
      '.i-carousel-viewport',
    );
    const items = fixture.nativeElement.querySelectorAll('[iCarouselItem]');
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth * 2);
    expect(items[0].getBoundingClientRect().top).toBe(
      items[1].getBoundingClientRect().top,
    );
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    fixture.detectChanges();
    expect(carousel.activeIndex).toBe(2);
    expect(viewport.scrollLeft).toBeGreaterThan(viewport.clientWidth);
    const child = items[2].querySelector('button');
    child.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    expect(carousel.activeIndex).toBe(2);
  });

  it('tracks a manually swiped slide and clamps when slides are removed', async () => {
    const { fixture, carousel } = await setup();
    const viewport: HTMLElement = fixture.nativeElement.querySelector(
      '.i-carousel-viewport',
    );
    viewport.scrollLeft = viewport.scrollWidth;
    carousel.onScrollEnd();
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(2);
    fixture.componentInstance.items = ['Reports'];
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(0);
    expect(
      fixture.nativeElement.querySelector('.i-carousel-controls'),
    ).toBeNull();
    fixture.componentInstance.items = [];
    fixture.detectChanges();
    carousel.goTo(1);
    expect(carousel.activeIndex).toBe(0);
  });
});
