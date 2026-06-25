import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IDialog } from './dialog.component';

describe('IDialog', () => {
  let component: IDialog;
  let fixture: ComponentFixture<IDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(IDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.closable).toBe(true);
      expect(component.modal).toBe(true);
      expect(component.visible).toBe(false);
      expect(component.width).toBe('50rem');
    });

    it('should accept header input', () => {
      component.header = 'Dialog Title';
      fixture.detectChanges();
      expect(component.header).toBe('Dialog Title');
    });

    it('should accept width input', () => {
      component.width = '30rem';
      fixture.detectChanges();
      expect(component.width).toBe('30rem');
    });

    it('should accept closable input', () => {
      component.closable = false;
      fixture.detectChanges();
      expect(component.closable).toBe(false);
    });
  });

  describe('Show and Hide functionality', () => {
    it('should show dialog', () => {
      component.show();
      expect(component.visible).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should hide dialog', () => {
      component.visible = true;
      component.hide();
      expect(component.visible).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });

    it('should emit visibleChange event on show', () => {
      spyOn(component.visibleChange, 'emit');
      component.show();
      expect(component.visibleChange.emit).toHaveBeenCalledWith(true);
    });

    it('should emit visibleChange event on hide', () => {
      spyOn(component.visibleChange, 'emit');
      component.hide();
      expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('Lifecycle hooks', () => {
    it('should show dialog on init if visible is true', () => {
      const testFixture = TestBed.createComponent(IDialog);
      const testComponent = testFixture.componentInstance;
      testComponent.visible = true;
      spyOn(testComponent, 'show');
      testComponent.ngOnInit();
      expect(testComponent.show).toHaveBeenCalled();
    });

    it('should hide dialog on destroy', () => {
      spyOn(component, 'hide');
      component.ngOnDestroy();
      expect(component.hide).toHaveBeenCalled();
    });
  });

  describe('Keyboard interactions', () => {
    it('should close dialog on escape key if closable', () => {
      component.closable = true;
      component.visible = true;
      spyOn(component, 'hide');
      component.onEscapeKey();
      expect(component.hide).toHaveBeenCalled();
    });

    it('should not close dialog on escape key if not closable', () => {
      component.closable = false;
      component.visible = true;
      spyOn(component, 'hide');
      component.onEscapeKey();
      expect(component.hide).not.toHaveBeenCalled();
    });
  });

  describe('Modal overlay interactions', () => {
    it('should close on overlay click if modal and closable', () => {
      component.modal = true;
      component.closable = true;
      component.visible = true;

      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div'),
      };
      mockEvent.target = mockEvent.currentTarget;

      spyOn(component, 'hide');
      component.onOverlayClick(mockEvent as any);
      expect(component.hide).toHaveBeenCalled();
    });

    it('should not close on overlay click if not closable', () => {
      component.modal = true;
      component.closable = false;

      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div'),
      };
      mockEvent.target = mockEvent.currentTarget;

      spyOn(component, 'hide');
      component.onOverlayClick(mockEvent as any);
      expect(component.hide).not.toHaveBeenCalled();
    });
  });

  describe('Close button', () => {
    it('should close dialog on close button click', () => {
      component.closable = true;
      spyOn(component, 'hide');
      component.onCloseClick();
      expect(component.hide).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-dialog-');
    });
  });
});
