import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IPanel } from './panel.component';

describe('IPanel', () => {
  let component: IPanel;
  let fixture: ComponentFixture<IPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(IPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.collapsed).toBe(false);
      expect(component.toggleable).toBe(true);
      expect(component.header).toBe('');
    });

    it('should accept header input', () => {
      component.header = 'Test Header';
      fixture.detectChanges();
      expect(component.header).toBe('Test Header');
    });

    it('should accept collapsed input', () => {
      component.collapsed = true;
      fixture.detectChanges();
      expect(component.collapsed).toBe(true);
    });

    it('should accept toggleable input', () => {
      component.toggleable = false;
      fixture.detectChanges();
      expect(component.toggleable).toBe(false);
    });
  });

  describe('Toggle functionality', () => {
    it('should toggle when toggleable is true', () => {
      expect(component.collapsed).toBe(false);
      component.toggle();
      expect(component.collapsed).toBe(true);
      component.toggle();
      expect(component.collapsed).toBe(false);
    });

    it('should not toggle when toggleable is false', () => {
      component.toggleable = false;
      component.collapsed = false;
      component.toggle();
      expect(component.collapsed).toBe(false);
    });

    it('should emit collapsedChange event', () => {
      const spy = jasmine.createSpy('collapsedChange');
      component.collapsedChange.subscribe(spy);
      component.toggle();
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should emit onToggle event', () => {
      const spy = jasmine.createSpy('onToggle');
      component.onToggle.subscribe(spy);
      component.toggle();
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-panel-');
    });
  });
});
