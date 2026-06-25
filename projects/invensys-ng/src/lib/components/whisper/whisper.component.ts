import { NgClass, NgStyle } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { WhisperService } from './services/whisper.service';
import {
  IWhisperMessage,
  IWhisperOptions,
} from './services/whisper.interfaces';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { ZIndexUtils } from '../../utils/zindexutils';
import { IButton } from '../button/button.component';
import { ISeverity } from '@shared/enums/IButtonSeverity';

/**
 * Supported whisper/toast positions
 */
export type IWhisperPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Whisper (Toast Notification) Component
 *
 * A notification/toast component that displays temporary messages.
 * Supports multiple positions, severities, and automatic dismissal.
 *
 * @example
 * ```html
 * <!-- Basic whisper container (place in app root) -->
 * <i-whisper></i-whisper>
 *
 * <!-- Whisper with custom position -->
 * <i-whisper position="bottom-right"></i-whisper>
 *
 * <!-- Keyed whisper for specific notifications -->
 * <i-whisper key="global-notifications"></i-whisper>
 * ```
 *
 * ```typescript
 * // In your component:
 * constructor(private whisperService: WhisperService) {}
 *
 * showSuccess() {
 *   this.whisperService.add({
 *     severity: 'success',
 *     summary: 'Success',
 *     detail: 'Operation completed successfully',
 *     life: 3000
 *   });
 * }
 *
 * showError() {
 *   this.whisperService.add({
 *     severity: 'danger',
 *     summary: 'Error',
 *     detail: 'An error occurred',
 *     life: 5000
 *   });
 * }
 * ```
 *
 * @remarks
 * This component uses OnPush change detection for optimal performance.
 * Works with WhisperService to display notifications.
 * Supports auto-dismissal with configurable life time.
 */
@Component({
  selector: 'i-whisper',
  standalone: true,
  imports: [NgClass, NgStyle, IButton],
  templateUrl: './whisper.component.html',
  styleUrl: './whisper.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IWhisper implements OnInit, OnDestroy {
  /**
   * Key to filter which messages this whisper container displays
   * If set, only messages with matching key will be shown
   */
  @Input() key?: string;

  /**
   * Whether to automatically manage z-index
   * @default true
   */
  @Input() autoZIndex = true;

  /**
   * Base z-index value for the whisper container
   * @default 0
   */
  @Input() baseZIndex = 0;

  /**
   * Custom inline styles to apply to the container
   */
  @Input() style?: { [key: string]: any };

  /**
   * Position of the whisper container on screen
   * @default 'top-right'
   */
  @Input() position: IWhisperPosition = 'top-right';

  /**
   * Prevents duplicate messages from being shown at the same time
   * Removes existing message before showing the duplicate
   * @default false
   */
  @Input() preventOpenDuplicates = false;

  /**
   * Prevents duplicate messages from being added at all
   * @default false
   */
  @Input() preventDuplicates = false;

  /**
   * Array of current whisper messages
   * @internal
   */
  messages: IWhisperMessage[] = [];

  /**
   * Subscription to message events from the service
   * @internal
   */
  messageSubscription?: Subscription;

  /**
   * Subscription to clear events from the service
   * @internal
   */
  clearSubscription?: Subscription;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-whisper-');

  constructor(
    private whisperService: WhisperService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.messageSubscription = this.whisperService.messageObserver.subscribe(
      (message) => {
        if (message) {
          if (this.key) {
            if (message.key !== this.key) {
              return;
            }
          } else {
            if (message.key) {
              return;
            }
          }

          if (this.preventDuplicates) {
            const isDuplicate = this.messages.some(
              (m) =>
                m.summary === message.summary &&
                m.detail === message.detail &&
                m.severity === message.severity
            );
            if (isDuplicate) return;
          }

          if (this.preventOpenDuplicates) {
            this.messages = this.messages.filter(
              (m) =>
                !(
                  m.summary === message.summary &&
                  m.detail === message.detail &&
                  m.severity === message.severity
                )
            );
          }

          this.messages = [...this.messages, message];

          if (message.life && message.life > 0) {
            setTimeout(() => {
              this.remove(message);
            }, message.life);
          }

          this.cd.markForCheck();
        }
      }
    );

    this.clearSubscription = this.whisperService.clearObserver.subscribe(
      (key) => {
        if (key) {
          this.messages = this.messages.filter((m) => m.key !== key);
        } else {
          this.messages = [];
        }
        this.cd.markForCheck();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }

    if (this.clearSubscription) {
      this.clearSubscription.unsubscribe();
    }
  }

  /**
   * Removes a specific message from the display
   * @internal
   */
  remove(message: IWhisperMessage): void {
    this.messages = this.messages.filter((m) => m.id !== message.id);
    this.cd.markForCheck();
  }

  /**
   * Removes all messages from the display
   * @internal
   */
  removeAll(): void {
    this.messages = [];
    this.cd.markForCheck();
  }

  /**
   * Handles the close button click for a message
   * @internal
   */
  onClose(message: IWhisperMessage): void {
    this.remove(message);
  }

  /**
   * Gets the appropriate icon class for a message severity
   * @internal
   */
  getMessageIcon(severity: ISeverity): string {
    switch (severity) {
      case 'success':
        return 'pi-check-circle';
      case 'info':
        return 'pi-info-circle';
      case 'warning':
        return 'pi-exclamation-triangle';
      case 'danger':
        return 'pi-times-circle';
      default:
        return 'pi-info-circle';
    }
  }

  /**
   * Gets CSS classes for the whisper container
   * @internal
   */
  getContainerClass(): string {
    return `i-whisper i-whisper-${this.position}`;
  }

  /**
   * Gets CSS classes for a specific message
   * @internal
   */
  getMessageClass(message: IWhisperMessage): string {
    let classes = 'i-whisper-message';
    if (message.severity) {
      classes += ` i-whisper-message-${message.severity}`;
    }
    return classes;
  }

  /**
   * TrackBy function for ngFor optimization
   * @internal
   */
  trackByMessage(index: number, message: IWhisperMessage): any {
    return message.id;
  }
}
