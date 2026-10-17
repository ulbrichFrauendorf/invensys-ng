import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IWhisper } from './whisper.component';
import { WhisperService } from './services/whisper.service';
import { Subject } from 'rxjs';
import { IWhisperMessage } from './services/whisper.interfaces';

describe('IWhisper', () => {
  let component: IWhisper;
  let fixture: ComponentFixture<IWhisper>;
  let whisperService: MockedObject<WhisperService>;
  let messageSubject: Subject<IWhisperMessage | null>;
  let clearSubject: Subject<string | undefined>;

  beforeEach(async () => {
    messageSubject = new Subject<IWhisperMessage | null>();
    clearSubject = new Subject<string | undefined>();

    const whisperServiceSpy = {
      messageObserver: messageSubject.asObservable(),
      clearObserver: clearSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [IWhisper],
      providers: [{ provide: WhisperService, useValue: whisperServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(IWhisper);
    component = fixture.componentInstance;
    whisperService = TestBed.inject(
      WhisperService,
    ) as MockedObject<WhisperService>;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.autoZIndex).toBe(true);
      expect(component.baseZIndex).toBe(0);
      expect(component.position).toBe('top-right');
      expect(component.preventOpenDuplicates).toBe(false);
      expect(component.preventDuplicates).toBe(false);
    });

    it('should accept position input', () => {
      fixture.componentRef.setInput('position', 'bottom-left');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.position).toBe('bottom-left');
    });

    it('should accept key input', () => {
      fixture.componentRef.setInput('key', 'custom-key');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.key).toBe('custom-key');
    });
  });

  describe('Message handling', () => {
    it('should add message to messages array', () => {
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
      };

      messageSubject.next(mockMessage);
      expect(component.messages.length).toBe(1);
      expect(component.messages[0]).toEqual(mockMessage);
    });

    it('should filter messages by key', () => {
      fixture.componentRef.setInput('key', 'app');
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
        key: 'app',
      };

      messageSubject.next(mockMessage);
      expect(component.messages.length).toBe(1);
    });

    it('should not show messages with different key', () => {
      fixture.componentRef.setInput('key', 'app');
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
        key: 'other',
      };

      messageSubject.next(mockMessage);
      expect(component.messages.length).toBe(0);
    });

    it('should prevent duplicate messages when preventDuplicates is true', () => {
      fixture.componentRef.setInput('preventDuplicates', true);
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
      };

      messageSubject.next(mockMessage);
      messageSubject.next(mockMessage);

      expect(component.messages.length).toBe(1);
    });

    it('should remove existing duplicate when preventOpenDuplicates is true', () => {
      fixture.componentRef.setInput('preventOpenDuplicates', true);
      const mockMessage1: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
      };
      const mockMessage2: IWhisperMessage = {
        id: '2',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
      };

      messageSubject.next(mockMessage1);
      messageSubject.next(mockMessage2);

      expect(component.messages.length).toBe(1);
      expect(component.messages[0].id).toBe('2');
    });

    it('should auto-remove message after life duration', async () => {
      vi.useFakeTimers();
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
        life: 100,
      };

      messageSubject.next(mockMessage);
      expect(component.messages.length).toBe(1);

      await vi.advanceTimersByTimeAsync(150);

      expect(component.messages.length).toBe(0);
    });
  });

  describe('Message removal', () => {
    it('should remove specific message', () => {
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
      };

      component.messages = [mockMessage];
      component.remove(mockMessage);
      expect(component.messages.length).toBe(0);
    });

    it('should remove all messages', () => {
      component.messages = [
        { id: '1', severity: 'info', summary: 'Test 1', detail: 'Message 1' },
        {
          id: '2',
          severity: 'success',
          summary: 'Test 2',
          detail: 'Message 2',
        },
      ];

      component.removeAll();
      expect(component.messages.length).toBe(0);
    });

    it('should handle close event', () => {
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
      };

      component.messages = [mockMessage];
      vi.spyOn(component, 'remove').mockReturnValue(undefined);
      component.onClose(mockMessage);
      expect(component.remove).toHaveBeenCalledWith(mockMessage);
    });
  });

  describe('Clear functionality', () => {
    it('should clear all messages when no key provided', () => {
      component.messages = [
        { id: '1', severity: 'info', summary: 'Test 1', detail: 'Message 1' },
        {
          id: '2',
          severity: 'success',
          summary: 'Test 2',
          detail: 'Message 2',
        },
      ];

      clearSubject.next(undefined);
      expect(component.messages.length).toBe(0);
    });

    it('should clear messages by key', () => {
      component.messages = [
        {
          id: '1',
          severity: 'info',
          summary: 'Test 1',
          detail: 'Message 1',
          key: 'app',
        },
        {
          id: '2',
          severity: 'success',
          summary: 'Test 2',
          detail: 'Message 2',
          key: 'system',
        },
      ];

      clearSubject.next('app');
      expect(component.messages.length).toBe(1);
      expect(component.messages[0].key).toBe('system');
    });
  });

  describe('Helper methods', () => {
    it('should get correct icon for severity', () => {
      expect(component.getMessageIcon('success')).toBe('pi-check-circle');
      expect(component.getMessageIcon('info')).toBe('pi-info-circle');
      expect(component.getMessageIcon('warning')).toBe(
        'pi-exclamation-triangle',
      );
      expect(component.getMessageIcon('danger')).toBe('pi-times-circle');
    });

    it('should get correct container class', () => {
      fixture.componentRef.setInput('position', 'bottom-right');
      expect(component.getContainerClass()).toBe(
        'i-whisper i-whisper-bottom-right',
      );
    });

    it('should get correct message class', () => {
      const message: IWhisperMessage = {
        id: '1',
        severity: 'success',
        summary: 'Test',
        detail: 'Message',
      };
      expect(component.getMessageClass(message)).toContain(
        'i-whisper-message-success',
      );
    });
  });

  describe('Lifecycle', () => {
    it('should unsubscribe on destroy', () => {
      vi.spyOn(component.messageSubscription!, 'unsubscribe').mockReturnValue(
        undefined,
      );
      vi.spyOn(component.clearSubscription!, 'unsubscribe').mockReturnValue(
        undefined,
      );

      component.ngOnDestroy();

      expect(component.messageSubscription!.unsubscribe).toHaveBeenCalled();
      expect(component.clearSubscription!.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-whisper-');
    });

    it('should track messages by id', () => {
      const message: IWhisperMessage = {
        id: 'test-123',
        severity: 'info',
        summary: 'Test',
        detail: 'Message',
      };
      expect(component.trackByMessage(0, message)).toBe('test-123');
    });
  });

  describe('Position variants', () => {
    it('should apply top-left position class', () => {
      fixture.componentRef.setInput('position', 'top-left');
      expect(component.getContainerClass()).toBe(
        'i-whisper i-whisper-top-left',
      );
    });

    it('should apply top-center position class', () => {
      fixture.componentRef.setInput('position', 'top-center');
      expect(component.getContainerClass()).toBe(
        'i-whisper i-whisper-top-center',
      );
    });

    it('should apply bottom-center position class', () => {
      fixture.componentRef.setInput('position', 'bottom-center');
      expect(component.getContainerClass()).toBe(
        'i-whisper i-whisper-bottom-center',
      );
    });

    it('should apply bottom-left position class', () => {
      fixture.componentRef.setInput('position', 'bottom-left');
      expect(component.getContainerClass()).toBe(
        'i-whisper i-whisper-bottom-left',
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle message without life property', () => {
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
      };

      messageSubject.next(mockMessage);
      expect(component.messages.length).toBe(1);
    });

    it('should handle message with zero life', () => {
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
        life: 0,
      };

      messageSubject.next(mockMessage);
      expect(component.messages.length).toBe(1);
    });

    it('should not show messages without key when component has key', () => {
      fixture.componentRef.setInput('key', 'app');
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
      };

      messageSubject.next(mockMessage);
      expect(component.messages.length).toBe(0);
    });

    it('should show messages without key when component has no key', () => {
      fixture.componentRef.setInput('key', undefined);
      const mockMessage: IWhisperMessage = {
        id: '1',
        severity: 'info',
        summary: 'Test',
        detail: 'Test message',
      };

      messageSubject.next(mockMessage);
      expect(component.messages.length).toBe(1);
    });

    it('should handle null message', () => {
      messageSubject.next(null);
      expect(component.messages.length).toBe(0);
    });

    it('should get default icon for unknown severity', () => {
      expect(component.getMessageIcon('unknown' as any)).toBe('pi-info-circle');
    });

    it('should get message class without severity', () => {
      const message: any = {
        id: '1',
        summary: 'Test',
        detail: 'Message',
      };
      expect(component.getMessageClass(message)).toBe('i-whisper-message');
    });
  });

  describe('Custom styles', () => {
    it('should accept custom style input', () => {
      fixture.componentRef.setInput('style', { marginTop: '10px' });
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.style).toEqual({ marginTop: '10px' });
    });

    it('should accept custom baseZIndex', () => {
      fixture.componentRef.setInput('baseZIndex', 1000);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.baseZIndex).toBe(1000);
    });

    it('should accept autoZIndex input', () => {
      fixture.componentRef.setInput('autoZIndex', false);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.autoZIndex).toBe(false);
    });
  });
});

afterEach(() => vi.useRealTimers());
