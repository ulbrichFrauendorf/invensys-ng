import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';

/** One rem probe per application, shared by controls that need pixel geometry. */
@Injectable({ providedIn: 'root' })
export class RootSizeService {
  readonly pixels = signal(16);

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
      'position:fixed;width:1rem;height:0;overflow:hidden;visibility:hidden;pointer-events:none;';
    document.body.appendChild(probe);
    const update = () => this.pixels.set(probe.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(probe);
    destroyRef.onDestroy(() => {
      observer.disconnect();
      probe.remove();
    });
  }
}
