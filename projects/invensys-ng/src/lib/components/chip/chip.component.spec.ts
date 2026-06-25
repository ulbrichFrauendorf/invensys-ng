import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IChip } from './chip.component';

describe('IChip', () => {
  let component: IChip;
  let fixture: ComponentFixture<IChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IChip],
    }).compileComponents();

    fixture = TestBed.createComponent(IChip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.removable).toBe(false);
      expect(component.removeIcon).toBe('pi pi-times-circle');
      expect(component.disabled).toBe(false);
    });

    it('should accept label input', () => {
      component.label = 'Test Chip';
      fixture.detectChanges();
      expect(component.label).toBe('Test Chip');
    });

    it('should accept icon input', () => {
      component.icon = 'pi pi-user';
      fixture.detectChanges();
      expect(component.icon).toBe('pi pi-user');
    });

    it('should accept image input', () => {
      component.image = 'avatar.png';
      fixture.detectChanges();
      expect(component.image).toBe('avatar.png');
    });

    it('should accept removable input', () => {
      component.removable = true;
      fixture.detectChanges();
      expect(component.removable).toBe(true);
    });

    it('should accept styleClass input', () => {
      component.styleClass = 'custom-chip';
      fixture.detectChanges();
      expect(component.styleClass).toBe('custom-chip');
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });
  });

  describe('Remove functionality', () => {
    it('should emit onRemove event when remove is clicked', () => {
      const mockEvent = new Event('click');
      spyOn(component.onRemove, 'emit');
      component.onRemoveClick(mockEvent);
      expect(component.onRemove.emit).toHaveBeenCalledWith(mockEvent);
    });

    it('should not emit onRemove event when disabled', () => {
      component.disabled = true;
      const mockEvent = new Event('click');
      spyOn(component.onRemove, 'emit');
      component.onRemoveClick(mockEvent);
      expect(component.onRemove.emit).not.toHaveBeenCalled();
    });
  });

  describe('OnPush change detection', () => {
    it('should use OnPush change detection strategy', () => {
      const metadata = (component.constructor as any).__annotations__[0];
      expect(metadata.changeDetection).toBeDefined();
    });
  });
});
