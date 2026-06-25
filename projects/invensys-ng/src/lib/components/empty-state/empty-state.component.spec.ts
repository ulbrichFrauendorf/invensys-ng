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
      component.fixed = true;
      fixture.detectChanges();
      expect(component.fixed).toBe(true);
    });

    it('should accept colorScheme signal input', () => {
      const colorScheme = signal('dark');
      component.colorScheme = colorScheme;
      fixture.detectChanges();
      expect(component.colorScheme()).toBe('dark');
    });
  });

  describe('Image loading', () => {
    it('should set imageLoaded to true after delay', (done) => {
      expect(component.imageLoaded).toBe(false);
      component.onImageLoad();

      setTimeout(() => {
        expect(component.imageLoaded).toBe(true);
        done();
      }, 250);
    });

    it('should have a 200ms delay before marking image as loaded', (done) => {
      component.onImageLoad();

      setTimeout(() => {
        expect(component.imageLoaded).toBe(false);
      }, 100);

      setTimeout(() => {
        expect(component.imageLoaded).toBe(true);
        done();
      }, 250);
    });
  });
});
