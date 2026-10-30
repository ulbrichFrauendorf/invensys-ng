import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ICarousel } from './carousel.component';
import { ICarouselItem } from './carousel-item.directive';
import { provideRouter, Router } from '@angular/router';
import { ICardButton } from '../card-button/card-button.component';
import { cdp } from 'vitest/browser';
import type { CDPSession } from '@vitest/browser-playwright';

@Component({
  imports: [ICarousel, ICarouselItem],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<i-carousel
    [(activeIndex)]="index"
    [fullWidth]="fullWidth"
    [showNavigators]="showNavigators"
    ariaLabel="Tools"
  >
    @for (item of items; track item) {
      <section iCarouselItem>
        <button>{{ item }}</button>
      </section>
    }
  </i-carousel>`,
})
class Host {
  index = 0;
  fullWidth = true;
  showNavigators = true;
  items = ['Reports', 'Onboarding', 'Automations'];
}

@Component({
  imports: [ICarousel, ICarouselItem, ICardButton],
  template: `<div style="container-type: inline-size">
    <i-carousel [overflowOnly]="true" style="--carousel-min-item-width: 260px">
      <i-card-button iCarouselItem [fullHeight]="true" (clicked)="activate()"
        >First tool</i-card-button
      >
      <i-card-button
        iCarouselItem
        [fullHeight]="true"
        [disabled]="disabled"
        [routerLink]="route"
        (clicked)="activate()"
        >Second tool</i-card-button
      >
    </i-carousel>
  </div>`,
})
class CardsHost {
  disabled = false;
  route: string | null = null;
  readonly activate = vi.fn();
}

describe('ICarousel', () => {
  async function setupCards() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(CardsHost);
    fixture.nativeElement.style.cssText = 'display: block; width: 360px';
    fixture.detectChanges();
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const viewport = root.querySelector<HTMLElement>('.i-carousel-viewport')!;
    const session: CDPSession = cdp();
    return { fixture, root, viewport, session };
  }

  async function dragMouse(
    session: CDPSession,
    x: number,
    y: number,
    distance: number,
  ) {
    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x,
      y,
    });
    await session.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x,
      y,
      button: 'left',
      buttons: 1,
      clickCount: 1,
    });
    for (let step = 1; step <= 10; step++) {
      await session.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: x + (distance * step) / 10,
        y,
        buttons: 1,
      });
    }
    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: x + distance,
      y,
      button: 'left',
      clickCount: 1,
    });
  }

  it('uses the mouse wheel in both directions over cards without activating them', async () => {
    const { fixture, root, viewport, session } = await setupCards();
    const bounds = viewport.getBoundingClientRect();
    const x = bounds.left + 180;
    const y = bounds.top + bounds.height / 2;
    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x,
      y,
      deltaX: 0,
      deltaY: 120,
    });
    await vi.waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(100));
    await vi.waitFor(() =>
      expect(
        root
          .querySelector('.i-carousel-dot-active')
          ?.getAttribute('aria-label'),
      ).toBe('Go to slide 2 of 2'),
    );
    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x,
      y,
      deltaX: 0,
      deltaY: -120,
    });
    await vi.waitFor(() => expect(viewport.scrollLeft).toBeLessThan(10));
    await vi.waitFor(() =>
      expect(
        root
          .querySelector('.i-carousel-dot-active')
          ?.getAttribute('aria-label'),
      ).toBe('Go to slide 1 of 2'),
    );
    expect(fixture.componentInstance.activate).not.toHaveBeenCalled();
  });

  it('preserves native horizontal wheel, browser zoom, and page scrolling at boundaries or when cards fit', async () => {
    const { root, viewport } = await setupCards();
    for (const options of [
      { deltaY: -120 },
      { deltaX: 120, deltaY: 0 },
      { deltaY: 120, ctrlKey: true },
    ]) {
      const event = new WheelEvent('wheel', {
        ...options,
        bubbles: true,
        cancelable: true,
      });
      viewport.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    }
    root.style.width = '1100px';
    const event = new WheelEvent('wheel', {
      deltaY: 120,
      bubbles: true,
      cancelable: true,
    });
    viewport.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('shrinks card buttons continuously and only shows carousel controls once their minimum widths overflow', async () => {
    const { fixture, root, viewport } = await setupCards();
    const controls = root.querySelector<HTMLElement>('.i-carousel-controls')!;
    const first = root.querySelector<HTMLElement>('i-card-button')!;
    for (const width of [950, 900, 825, 700, 600, 552, 551, 390]) {
      root.style.width = `${width}px`;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      fixture.detectChanges();
      if (width >= 552) {
        expect(first.getBoundingClientRect().width).toBeCloseTo(
          (width - 32) / 2,
          1,
        );
        expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
        expect(getComputedStyle(controls).display).toBe('none');
      } else {
        expect(first.getBoundingClientRect().width).toBe(260);
        expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
        expect(getComputedStyle(controls).display).toBe('flex');
      }
    }
  });

  it('scrolls by dragging a native card button and preserves ordinary card clicks', async () => {
    const { fixture, root, viewport, session } = await setupCards();
    const bounds = viewport.getBoundingClientRect();
    await dragMouse(
      session,
      bounds.left + 200,
      bounds.top + bounds.height / 2,
      -160,
    );
    await vi.waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(100));
    await vi.waitFor(() =>
      expect(
        root
          .querySelector('.i-carousel-dot-active')
          ?.getAttribute('aria-label'),
      ).toBe('Go to slide 2 of 2'),
    );
    expect(fixture.componentInstance.activate).not.toHaveBeenCalled();
    const second = root
      .querySelectorAll('i-card-button')[1]
      .getBoundingClientRect();
    const x = second.left + second.width / 2;
    const y = second.top + second.height / 2;
    await session.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x,
      y,
      button: 'left',
      buttons: 1,
      clickCount: 1,
    });
    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x,
      y,
      button: 'left',
      clickCount: 1,
    });
    expect(fixture.componentInstance.activate).toHaveBeenCalledTimes(1);
  });

  for (const disabled of [false, true]) {
    it(`drags ${disabled ? 'disabled' : 'link'} cards without activation or navigation`, async () => {
      const { fixture, root, viewport, session } = await setupCards();
      fixture.componentInstance.route = '/reports';
      fixture.componentInstance.disabled = disabled;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const router = TestBed.inject(Router);
      const navigate = vi
        .spyOn(router, 'navigateByUrl')
        .mockResolvedValue(true);
      const carousel = fixture.debugElement.query(By.directive(ICarousel))
        .componentInstance as ICarousel;
      carousel.goTo(1);
      await fixture.whenStable();
      const bounds = viewport.getBoundingClientRect();
      await dragMouse(
        session,
        bounds.left + 150,
        bounds.top + bounds.height / 2,
        160,
      );
      await vi.waitFor(() => expect(viewport.scrollLeft).toBeLessThan(10));
      expect(fixture.componentInstance.activate).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });
  }

  it('scrolls card buttons in narrow containers and fits them in wide containers', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(CardsHost);
    fixture.nativeElement.style.cssText = 'display: block; width: 360px';
    fixture.detectChanges();
    await fixture.whenStable();
    const viewport: HTMLElement = fixture.nativeElement.querySelector(
      '.i-carousel-viewport',
    );
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    viewport.scrollLeft = viewport.scrollWidth;
    expect(viewport.scrollLeft).toBeGreaterThan(0);
    fixture.nativeElement.style.width = '1100px';
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
  });

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

  it('defaults to content-width slides without navigation controls', () => {
    const fixture = TestBed.createComponent(ICarousel);
    fixture.detectChanges();
    expect(fixture.componentInstance.fullWidth).toBe(false);
    expect(fixture.componentInstance.showNavigators).toBe(false);
  });

  it('keeps slides at their content width and hides navigation when opted out', async () => {
    const { fixture: host } = await setup();
    host.componentInstance.fullWidth = false;
    host.componentInstance.showNavigators = false;
    host.changeDetectorRef.markForCheck();
    host.detectChanges();
    const viewport: HTMLElement = host.nativeElement.querySelector(
      '.i-carousel-viewport',
    );
    const item: HTMLElement =
      host.nativeElement.querySelector('[iCarouselItem]');
    expect(item.getBoundingClientRect().width).toBeLessThan(
      viewport.clientWidth / 2,
    );
    expect(host.nativeElement.querySelector('i-button')).toBeNull();
    expect(host.nativeElement.querySelectorAll('.i-carousel-dot')).toHaveLength(
      3,
    );
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
      fixture.nativeElement.querySelectorAll('.i-carousel-dot'),
    ).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('i-button')).toBeNull();
    fixture.componentInstance.items = [];
    fixture.detectChanges();
    carousel.goTo(1);
    expect(carousel.activeIndex).toBe(0);
    expect(
      fixture.nativeElement.querySelectorAll('.i-carousel-dot'),
    ).toHaveLength(0);
  });

  it('replaces the scrollbar with one accessible dot per slide and widens the active dot', async () => {
    const { fixture } = await setup();
    const root: HTMLElement = fixture.nativeElement;
    const viewport: HTMLElement = fixture.nativeElement.querySelector(
      '.i-carousel-viewport',
    );
    const dots = root.querySelectorAll<HTMLButtonElement>('.i-carousel-dot');
    expect(getComputedStyle(viewport).scrollbarWidth).toBe('none');
    expect(dots).toHaveLength(3);
    expect(dots[0].getAttribute('aria-current')).toBe('true');
    expect(dots[2].getAttribute('aria-label')).toBe('Go to slide 3 of 3');
    expect(
      parseFloat(getComputedStyle(dots[0], '::before').width),
    ).toBeGreaterThan(parseFloat(getComputedStyle(dots[1], '::before').width));
    dots[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(2);
    expect(dots[2].getAttribute('aria-current')).toBe('true');
    expect(dots[0].hasAttribute('aria-current')).toBe(false);
    expect(viewport.scrollLeft).toBeGreaterThan(viewport.clientWidth);
  });

  it('preserves a selected final dot when compact slides cannot align at the viewport start', async () => {
    const { fixture, carousel } = await setup();
    const root: HTMLElement = fixture.nativeElement;
    fixture.componentInstance.fullWidth = false;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const items = root.querySelectorAll<HTMLElement>('[iCarouselItem]');
    items.forEach((item: HTMLElement) => (item.style.flex = '0 0 160px'));
    root.querySelectorAll<HTMLButtonElement>('.i-carousel-dot')[2].click();
    carousel.onScrollEnd();
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(2);
    const viewport: HTMLElement = fixture.nativeElement.querySelector(
      '.i-carousel-viewport',
    );
    viewport.scrollLeft = 0;
    carousel.onScrollEnd();
    viewport.scrollLeft = viewport.scrollWidth;
    carousel.onScrollEnd();
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('.i-carousel-dot-active')
        .getAttribute('aria-label'),
    ).toBe('Go to slide 3 of 3');
  });
});
