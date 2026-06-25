import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoContentComponent } from './no-content.component';

describe('NoContentComponent', () => {
  let component: NoContentComponent;
  let fixture: ComponentFixture<NoContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default icon', () => {
    expect(component.icon).toBe('pi pi-inbox');
  });

  it('should have default message', () => {
    expect(component.message).toBe('No content available');
  });

  it('should accept custom icon', () => {
    component.icon = 'pi pi-search';
    fixture.detectChanges();
    expect(component.icon).toBe('pi pi-search');
  });

  it('should accept custom message', () => {
    component.message = 'Custom message';
    fixture.detectChanges();
    expect(component.message).toBe('Custom message');
  });

  it('should render icon with correct class', () => {
    component.icon = 'pi pi-test';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('i');
    expect(icon?.className).toContain('pi pi-test');
  });

  it('should render message text', () => {
    component.message = 'Test message';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('.no-content-message');
    expect(message?.textContent).toContain('Test message');
  });
});
