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

  it('reveals the image immediately after load without a timer', () => {
    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('load'));
    expect(component.imageLoaded).toBe(true);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('img').classList.contains('loaded'),
    ).toBe(true);
  });
});
