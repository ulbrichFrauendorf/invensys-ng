import { ISeverity } from '@shared/enums/IButtonSeverity';
import { IPosition } from '@shared/enums/IPosition';

/**
 * Configuration for a whisper (toast/notification) message.
 */
export interface IWhisperMessage {
  /** Unique identifier for the message. Auto-generated if not provided */
  id?: string;

  /** Visual severity/style of the message (e.g., 'success', 'info', 'warning', 'danger') */
  severity: ISeverity;

  /** The main title/summary text of the message */
  summary: string;

  /** Optional detailed description or additional information */
  detail?: string;

  /** Optional key to group related messages for bulk operations */
  key?: string;

  /** Duration in milliseconds before the message auto-dismisses. Defaults to 3000ms. Set to 0 for sticky messages */
  life?: number;

  /** If true, the message will not auto-dismiss and must be manually closed */
  sticky?: boolean;

  /** Whether the message can be manually closed by the user. Defaults to true */
  closable?: boolean;

  /** Optional custom data to attach to the message */
  data?: any;
}

/**
 * Global configuration options for the whisper service.
 */
export interface IWhisperOptions {
  /** The position where whisper messages appear on screen (e.g., 'top-right', 'bottom-left') */
  position?: IPosition;

  /** If true, prevents showing duplicate messages that are already visible */
  preventOpenDuplicates?: boolean;

  /** If true, prevents adding duplicate messages to the queue */
  preventDuplicates?: boolean;
}
