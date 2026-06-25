import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IAccordion } from './accordion.component';

describe('IAccordion', () => {
  let component: IAccordion;
  let fixture: ComponentFixture<IAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IAccordion],
    }).compileComponents();

    fixture = TestBed.createComponent(IAccordion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.header).toBe('');
      expect(component.expanded).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.icon).toBeUndefined();
    });

    it('should accept header input', () => {
      component.header = 'Test Header';
      fixture.detectChanges();
      expect(component.header).toBe('Test Header');
    });

    it('should accept expanded input', () => {
      component.expanded = true;
      fixture.detectChanges();
      expect(component.expanded).toBe(true);
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });

    it('should accept icon input', () => {
      component.icon = 'pi pi-info-circle';
      fixture.detectChanges();
      expect(component.icon).toBe('pi pi-info-circle');
    });

    it('should display header when provided', () => {
      component.header = 'My Accordion Title';
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(
        By.css('.i-accordion-title')
      );
      expect(titleElement.nativeElement.textContent).toBe('My Accordion Title');
    });

    it('should display icon when provided', () => {
      component.icon = 'pi pi-info-circle';
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(
        By.css('.i-accordion-icon')
      );
      expect(iconElement).toBeTruthy();
      expect(iconElement.nativeElement.classList).toContain('pi-info-circle');
    });

    it('should not display icon when not provided', () => {
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(
        By.css('.i-accordion-icon')
      );
      expect(iconElement).toBeFalsy();
    });
  });

  describe('Toggle functionality', () => {
    it('should toggle expanded state on click', () => {
      expect(component.expanded).toBe(false);
      component.toggle();
      expect(component.expanded).toBe(true);
      component.toggle();
      expect(component.expanded).toBe(false);
    });

    it('should not toggle when disabled', () => {
      component.disabled = true;
      component.expanded = false;
      component.toggle();
      expect(component.expanded).toBe(false);
    });

    it('should emit expandedChange when toggled', () => {
      spyOn(component.expandedChange, 'emit');
      component.toggle();
      expect(component.expandedChange.emit).toHaveBeenCalledWith(true);
    });

    it('should emit onToggle when toggled', () => {
      spyOn(component.onToggle, 'emit');
      component.toggle();
      expect(component.onToggle.emit).toHaveBeenCalledWith(true);
    });

    it('should not emit events when disabled', () => {
      component.disabled = true;
      spyOn(component.expandedChange, 'emit');
      spyOn(component.onToggle, 'emit');
      component.toggle();
      expect(component.expandedChange.emit).not.toHaveBeenCalled();
      expect(component.onToggle.emit).not.toHaveBeenCalled();
    });

    it('should toggle on header click', () => {
      const header = fixture.debugElement.query(By.css('.i-accordion-header'));
      expect(component.expanded).toBe(false);
      header.triggerEventHandler('click', null);
      expect(component.expanded).toBe(true);
    });
  });

  describe('CSS Classes', () => {
    it('should add expanded class when expanded', () => {
      component.expanded = true;
      fixture.detectChanges();
      const accordion = fixture.debugElement.query(By.css('.i-accordion'));
      expect(accordion.nativeElement.classList).toContain('expanded');
    });

    it('should add disabled class when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      const accordion = fixture.debugElement.query(By.css('.i-accordion'));
      expect(accordion.nativeElement.classList).toContain('disabled');
    });

    it('should add collapsed class to content wrapper when not expanded', () => {
      component.expanded = false;
      fixture.detectChanges();
      const contentWrapper = fixture.debugElement.query(
        By.css('.i-accordion-content-wrapper')
      );
      expect(contentWrapper.nativeElement.classList).toContain('collapsed');
    });

    it('should remove collapsed class from content wrapper when expanded', () => {
      component.expanded = true;
      fixture.detectChanges();
      const contentWrapper = fixture.debugElement.query(
        By.css('.i-accordion-content-wrapper')
      );
      expect(contentWrapper.nativeElement.classList).not.toContain('collapsed');
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-accordion-');
    });

    it('should have aria-expanded attribute on header', () => {
      const header = fixture.debugElement.query(By.css('.i-accordion-header'));
      expect(header.attributes['aria-expanded']).toBe('false');

      component.expanded = true;
      fixture.detectChanges();
      expect(header.attributes['aria-expanded']).toBe('true');
    });

    it('should have aria-disabled attribute on header', () => {
      const header = fixture.debugElement.query(By.css('.i-accordion-header'));
      expect(header.attributes['aria-disabled']).toBe('false');

      component.disabled = true;
      fixture.detectChanges();
      expect(header.attributes['aria-disabled']).toBe('true');
    });

    it('should have role button on header', () => {
      const header = fixture.debugElement.query(By.css('.i-accordion-header'));
      expect(header.attributes['role']).toBe('button');
    });

    it('should have tabindex on header', () => {
      const header = fixture.debugElement.query(By.css('.i-accordion-header'));
      expect(header.attributes['tabindex']).toBe('0');
    });
  });
});
