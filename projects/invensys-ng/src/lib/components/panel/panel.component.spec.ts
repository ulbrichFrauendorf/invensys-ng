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
    fixture.changeDetectorRef.markForCheck();
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
      fixture.componentRef.setInput('header', 'Test Header');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.header).toBe('Test Header');
    });

    it('should accept collapsed input', () => {
      fixture.componentRef.setInput('collapsed', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.collapsed).toBe(true);
    });

    it('should accept toggleable input', () => {
      fixture.componentRef.setInput('toggleable', false);
      fixture.changeDetectorRef.markForCheck();
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
      fixture.componentRef.setInput('toggleable', false);
      fixture.componentRef.setInput('collapsed', false);
      component.toggle();
      expect(component.collapsed).toBe(false);
    });

    it('should emit collapsedChange event', () => {
      const spy = vi.fn().mockName('collapsedChange');
      component.collapsedChange.subscribe(spy);
      component.toggle();
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should emit onToggle event', () => {
      const spy = vi.fn().mockName('onToggle');
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
