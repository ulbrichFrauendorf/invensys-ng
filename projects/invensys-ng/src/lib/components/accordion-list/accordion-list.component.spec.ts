import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IAccordionList } from './accordion-list.component';
import { IAccordion } from '../accordion/accordion.component';

// Host component for testing
@Component({
  template: `
    <i-accordion-list [multiple]="multiple">
      <i-accordion header="Section 1" [expanded]="section1Expanded">
        <p>Content 1</p>
      </i-accordion>
      <i-accordion header="Section 2" [expanded]="section2Expanded">
        <p>Content 2</p>
      </i-accordion>
      <i-accordion header="Section 3" [expanded]="section3Expanded">
        <p>Content 3</p>
      </i-accordion>
    </i-accordion-list>
  `,
  imports: [IAccordionList, IAccordion],
})
class TestHostComponent {
  multiple = false;
  section1Expanded = false;
  section2Expanded = false;
  section3Expanded = false;
}

describe('IAccordionList', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const accordionList = fixture.debugElement.query(
      By.directive(IAccordionList)
    );
    expect(accordionList).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default multiple value of false', () => {
      const accordionList = fixture.debugElement.query(
        By.directive(IAccordionList)
      );
      expect(accordionList.componentInstance.multiple).toBe(false);
    });

    it('should accept multiple input', () => {
      hostComponent.multiple = true;
      fixture.detectChanges();
      const accordionList = fixture.debugElement.query(
        By.directive(IAccordionList)
      );
      expect(accordionList.componentInstance.multiple).toBe(true);
    });
  });

  describe('Single expansion mode', () => {
    it('should collapse other accordions when one is expanded', async () => {
      hostComponent.multiple = false;
      fixture.detectChanges();

      const accordions = fixture.debugElement.queryAll(
        By.directive(IAccordion)
      );
      const accordion1 = accordions[0].componentInstance as IAccordion;
      const accordion2 = accordions[1].componentInstance as IAccordion;

      // Expand first accordion
      accordion1.toggle();
      fixture.detectChanges();
      expect(accordion1.expanded).toBe(true);
      expect(accordion2.expanded).toBe(false);

      // Expand second accordion - first should collapse
      accordion2.toggle();
      fixture.detectChanges();
      expect(accordion1.expanded).toBe(false);
      expect(accordion2.expanded).toBe(true);
    });
  });

  describe('Multiple expansion mode', () => {
    it('should allow multiple accordions to be expanded', () => {
      hostComponent.multiple = true;
      fixture.detectChanges();

      const accordions = fixture.debugElement.queryAll(
        By.directive(IAccordion)
      );
      const accordion1 = accordions[0].componentInstance as IAccordion;
      const accordion2 = accordions[1].componentInstance as IAccordion;

      // Expand first accordion
      accordion1.toggle();
      fixture.detectChanges();
      expect(accordion1.expanded).toBe(true);

      // Expand second accordion - first should remain expanded
      accordion2.toggle();
      fixture.detectChanges();
      expect(accordion1.expanded).toBe(true);
      expect(accordion2.expanded).toBe(true);
    });
  });

  describe('Content projection', () => {
    it('should project accordion children', () => {
      const accordions = fixture.debugElement.queryAll(
        By.directive(IAccordion)
      );
      expect(accordions.length).toBe(3);
    });

    it('should display accordion headers', () => {
      const accordions = fixture.debugElement.queryAll(
        By.directive(IAccordion)
      );
      expect(accordions[0].componentInstance.header).toBe('Section 1');
      expect(accordions[1].componentInstance.header).toBe('Section 2');
      expect(accordions[2].componentInstance.header).toBe('Section 3');
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      const accordionList = fixture.debugElement.query(
        By.directive(IAccordionList)
      );
      expect(accordionList.componentInstance.componentId).toContain(
        'i-accordion-list-'
      );
    });
  });
});
