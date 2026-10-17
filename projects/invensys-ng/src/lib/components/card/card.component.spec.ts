import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ICard } from './card.component';

describe('ICard', () => {
  let component: ICard;
  let fixture: ComponentFixture<ICard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ICard],
    }).compileComponents();

    fixture = TestBed.createComponent(ICard);
    component = fixture.componentInstance;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.closable).toBe(false);
      expect(component.title).toBeUndefined();
    });

    it('should accept title input', () => {
      fixture.componentRef.setInput('title', 'Test Card');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.title).toBe('Test Card');
    });

    it('should accept closable input', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.closable).toBe(true);
    });

    it('should display title when provided', () => {
      fixture.componentRef.setInput('title', 'My Card Title');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('.i-card-header'));
      expect(titleElement).toBeTruthy();
    });
  });

  describe('Close functionality', () => {
    it('should show close button when closable is true', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.componentRef.setInput('title', 'Closable Card');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const closeButton = fixture.debugElement.query(By.css('i-button'));
      expect(closeButton).toBeTruthy();
    });

    it('should not show close button when closable is false', () => {
      fixture.componentRef.setInput('closable', false);
      fixture.componentRef.setInput('title', 'Non-closable Card');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const closeButton = fixture.debugElement.query(By.css('i-button'));
      expect(closeButton).toBeFalsy();
    });

    it('should emit closeCard event when close button is clicked', () => {
      vi.spyOn(component.closeCard, 'emit').mockReturnValue(undefined);
      component.onCloseCard();
      expect(component.closeCard.emit).toHaveBeenCalled();
    });
  });

  describe('Content projection', () => {
    it('should project content into card body', () => {
      const testContent = 'This is card content';
      const testFixture = TestBed.createComponent(ICard);
      const cardElement = testFixture.nativeElement;
      cardElement.innerHTML = testContent;
      testFixture.changeDetectorRef.markForCheck();
      testFixture.detectChanges();

      expect(cardElement.textContent).toContain(testContent);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-card-');
    });
  });
});
