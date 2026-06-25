import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IWhisperMessage, IWhisperOptions } from './whisper.interfaces';

/**
 * Service for displaying whisper (toast/notification) messages to users.
 *
 * This service provides a centralized way to show temporary notification messages
 * across the application. Messages can be customized with different severities,
 * durations, and positions. The service supports auto-dismissing messages, sticky
 * messages, and grouping related notifications.
 *
 * @example
 * ```typescript
 * // Basic success message
 * constructor(private whisperService: WhisperService) {}
 *
 * saveData() {
 *   this.apiService.save(data).subscribe(() => {
 *     this.whisperService.add({
 *       severity: 'success',
 *       summary: 'Success',
 *       detail: 'Data saved successfully'
 *     });
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Error message with custom duration
 * this.whisperService.add({
 *   severity: 'danger',
 *   summary: 'Error',
 *   detail: 'Failed to load data',
 *   life: 5000,
 *   closable: true
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Sticky message that requires manual close
 * this.whisperService.add({
 *   severity: 'warning',
 *   summary: 'Important Notice',
 *   detail: 'Please review these changes carefully',
 *   sticky: true
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Configure global options
 * this.whisperService.setOptions({
 *   position: 'bottom-right',
 *   preventDuplicates: true
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class WhisperService {
  /**
   * Internal subject for publishing new messages.
   * @internal
   */
  private messageSource = new Subject<IWhisperMessage>();

  /**
   * Internal subject for publishing clear commands.
   * @internal
   */
  private clearSource = new Subject<string | null>();

  /**
   * Observable stream of whisper messages. Subscribe to this to display messages in the UI.
   */
  messageObserver = this.messageSource.asObservable();

  /**
   * Observable stream of clear commands. Emits when messages should be cleared.
   */
  clearObserver = this.clearSource.asObservable();

  /**
   * Default configuration options for the whisper service.
   * @internal
   */
  private defaultOptions: IWhisperOptions = {
    position: 'top-right',
    preventOpenDuplicates: false,
    preventDuplicates: false,
  };

  /**
   * Current active configuration options.
   * @internal
   */
  private options: IWhisperOptions = { ...this.defaultOptions };

  /**
   * Adds a new whisper message to display.
   *
   * Creates and displays a notification message with auto-generated ID if not provided.
   * Sets default values for life (3000ms), closable (true), and severity (info) if not specified.
   *
   * @param message The message configuration object
   *
   * @example
   * ```typescript
   * // Simple info message
   * this.whisperService.add({
   *   severity: 'info',
   *   summary: 'Information',
   *   detail: 'This is an info message'
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Custom duration and grouped message
   * this.whisperService.add({
   *   severity: 'success',
   *   summary: 'Upload Complete',
   *   detail: 'File uploaded successfully',
   *   key: 'upload-notifications',
   *   life: 5000
   * });
   * ```
   */
  add(message: IWhisperMessage): void {
    if (message) {
      // Generate a unique ID if not provided
      if (!message.id) {
        message.id = this.generateId();
      }

      // Set default values
      message.life = message.life ?? 3000;
      message.closable = message.closable ?? true;
      message.severity = message.severity ?? 'info';

      this.messageSource.next(message);
    }
  }

  /**
   * Adds multiple whisper messages at once.
   *
   * Convenience method for displaying multiple notification messages.
   * Each message is processed individually through the add() method.
   *
   * @param messages Array of message configuration objects to display
   *
   * @example
   * ```typescript
   * this.whisperService.addAll([
   *   { severity: 'success', summary: 'Task 1', detail: 'Completed' },
   *   { severity: 'success', summary: 'Task 2', detail: 'Completed' },
   *   { severity: 'info', summary: 'Task 3', detail: 'In progress' }
   * ]);
   * ```
   */
  addAll(messages: IWhisperMessage[]): void {
    if (messages && messages.length) {
      messages.forEach(message => this.add(message));
    }
  }

  /**
   * Clears whisper messages from the display.
   *
   * When called without a key, clears all visible messages.
   * When called with a key, clears only messages matching that key.
   *
   * @param key Optional key to clear only specific grouped messages
   *
   * @example
   * ```typescript
   * // Clear all messages
   * this.whisperService.clear();
   * ```
   *
   * @example
   * ```typescript
   * // Clear only messages with a specific key
   * this.whisperService.clear('upload-notifications');
   * ```
   */
  clear(key?: string): void {
    this.clearSource.next(key || null);
  }

  /**
   * Sets global configuration options for the whisper service.
   *
   * Updates the service configuration by merging provided options with defaults.
   * This affects all future messages displayed by the service.
   *
   * @param options Configuration options to apply
   *
   * @example
   * ```typescript
   * // Change position and enable duplicate prevention
   * this.whisperService.setOptions({
   *   position: 'bottom-left',
   *   preventDuplicates: true,
   *   preventOpenDuplicates: true
   * });
   * ```
   */
  setOptions(options: IWhisperOptions): void {
    this.options = { ...this.defaultOptions, ...options };
  }

  /**
   * Gets the current global configuration options.
   *
   * Returns a copy of the current options to prevent external modifications.
   *
   * @returns A copy of the current configuration options
   *
   * @example
   * ```typescript
   * const currentOptions = this.whisperService.getOptions();
   * console.log('Current position:', currentOptions.position);
   * ```
   */
  getOptions(): IWhisperOptions {
    return { ...this.options };
  }

  /**
   * Generates a unique identifier for messages.
   * @internal
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}