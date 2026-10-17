import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';
import { signal } from '@angular/core';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.fixed).toBe(false);
      expect(component.imageLoaded).toBe(false);
    });

    it('should accept fixed input', () => {
      fixture.componentRef.setInput('fixed', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.fixed).toBe(true);
    });

    it('should accept colorScheme signal input', () => {
      const colorScheme = signal('dark');
      fixture.componentRef.setInput('colorScheme', colorScheme);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.colorScheme()).toBe('dark');
    });
  });

  describe('Image loading', () => {
    it('should set imageLoaded to true after delay', async () => {
      vi.useFakeTimers();
      expect(component.imageLoaded).toBe(false);
      component.onImageLoad();

      await vi.advanceTimersByTimeAsync(250);

      expect(component.imageLoaded).toBe(true);
    });

    it('should have a 200ms delay before marking image as loaded', async () => {
      vi.useFakeTimers();
      component.onImageLoad();

      await vi.advanceTimersByTimeAsync(100);

      expect(component.imageLoaded).toBe(false);

      await vi.advanceTimersByTimeAsync(150);

      expect(component.imageLoaded).toBe(true);
    });
  });
});

afterEach(() => vi.useRealTimers());
