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
    fixture.changeDetectorRef.markForCheck();
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
      fixture.componentRef.setInput('label', 'Test Chip');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.label).toBe('Test Chip');
    });

    it('should accept icon input', () => {
      fixture.componentRef.setInput('icon', 'pi pi-user');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.icon).toBe('pi pi-user');
    });

    it('should accept image input', () => {
      fixture.componentRef.setInput('image', 'avatar.png');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.image).toBe('avatar.png');
    });

    it('should accept removable input', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.removable).toBe(true);
    });

    it('should accept styleClass input', () => {
      fixture.componentRef.setInput('styleClass', 'custom-chip');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.styleClass).toBe('custom-chip');
    });

    it('should accept disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });
  });

  describe('Remove functionality', () => {
    it('should emit onRemove event when remove is clicked', () => {
      const mockEvent = new Event('click');
      vi.spyOn(component.onRemove, 'emit').mockReturnValue(undefined);
      component.onRemoveClick(mockEvent);
      expect(component.onRemove.emit).toHaveBeenCalledWith(mockEvent);
    });

    it('should not emit onRemove event when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      const mockEvent = new Event('click');
      vi.spyOn(component.onRemove, 'emit').mockReturnValue(undefined);
      component.onRemoveClick(mockEvent);
      expect(component.onRemove.emit).not.toHaveBeenCalled();
    });
  });

  describe('Input rendering', () => {
    it('updates the rendered label through the public input', async () => {
      fixture.componentRef.setInput('label', 'Updated label');
      await fixture.whenStable();
      expect(fixture.nativeElement.textContent).toContain('Updated label');
    });
  });
});
