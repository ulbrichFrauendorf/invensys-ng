import { Input, Output, EventEmitter, Directive } from '@angular/core';

export type DialogBreakpoints = Record<
  string,
  { width?: string; height?: string }
>;
export type DialogContentStyle = Record<string, string | number>;

@Directive()
export abstract class AbstractDialog {
  @Input() header?: string;
  @Input() width: string = '800px';
  @Input() height?: string;
  @Input() closable: boolean = true;
  @Input() modal: boolean = true;
  /**
   * When true, clicking the overlay backdrop will close the dialog.
   * Defaults to false — the dialog must be closed via the close button or ESC key,
   * or programmatically.
   */
  @Input() dismissableMask: boolean = false;
  @Input() contentStyle?: DialogContentStyle;
  @Input() breakpoints?: DialogBreakpoints;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
}
