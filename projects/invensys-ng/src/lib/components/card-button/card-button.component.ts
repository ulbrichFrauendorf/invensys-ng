import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Params, RouterLink, UrlTree } from '@angular/router';
import { ICard } from '../card/card.component';

/**
 * An interactive i-card with native keyboard, focus, and navigation behaviour.
 * Use (clicked) for actions, or [routerLink] for navigation. Project display
 * content only: links, buttons and form controls belong outside the card button.
 *
 * @example
 * <i-card-button [selected]="activeTool() === 'password'"
 *   ariaControls="password-panel" (clicked)="activeTool.set('password')">
 *   <h2>Add password</h2><p>Protect your PDFs.</p>
 * </i-card-button>
 * <i-card-button routerLink="/reports"><h2>Reports</h2></i-card-button>
 */
@Component({
  selector: 'i-card-button',
  imports: [ICard, NgTemplateOutlet, RouterLink],
  templateUrl: './card-button.component.html',
  styleUrl: './card-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.i-card-button--full-height]': 'fullHeight()' },
})
export class ICardButton {
  readonly title = input<string>();
  readonly fullHeight = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Set to true/false for toggle buttons; null omits aria-pressed. */
  readonly selected = input<boolean | null>(null);
  readonly ariaLabel = input<string>();
  readonly ariaControls = input<string>();
  /** Providing a route renders a native anchor with Angular RouterLink. */
  readonly routerLink = input<string | readonly any[] | UrlTree | null>(null);
  readonly queryParams = input<Params | null>(null);
  readonly fragment = input<string>();
  readonly target = input<string>();
  readonly clicked = output<MouseEvent>();

  protected activate(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
