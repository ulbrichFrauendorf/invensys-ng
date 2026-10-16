import { ConnectedPosition } from '@angular/cdk/overlay';

export const OPTION_OVERLAY_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
];

export function handleOptionKeys(
  event: KeyboardEvent,
  panel: HTMLElement | undefined,
  close: (restoreFocus: boolean) => void,
): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    close(true);
    return;
  }
  if (event.key === 'Tab') {
    // Restore the trigger before the browser advances focus out of the picker.
    close(true);
    return;
  }
  if (!panel || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  if (event.target instanceof HTMLInputElement && ['Home', 'End'].includes(event.key)) return;
  const options = Array.from(panel.querySelectorAll<HTMLButtonElement>('[role="option"]'));
  if (!options.length) return;
  event.preventDefault();
  const current = options.indexOf(event.target as HTMLButtonElement);
  let next = event.key === 'ArrowUp' ? current - 1 : current + 1;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End' || (current < 0 && event.key === 'ArrowUp')) next = options.length - 1;
  options[(next + options.length) % options.length].focus();
}
