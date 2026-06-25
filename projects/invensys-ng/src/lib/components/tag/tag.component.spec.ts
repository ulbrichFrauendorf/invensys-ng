import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ITag } from './tag.component';
import { By } from '@angular/platform-browser';

describe('ITag', () => {
  let component: ITag;
  let fixture: ComponentFixture<ITag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITag],
    }).compileComponents();

    fixture = TestBed.createComponent(ITag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the value', () => {
    component.value = 'Active';
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.i-tag-value'));
    expect(span.nativeElement.textContent.trim()).toBe('Active');
  });

  it('should apply severity class', () => {
    component.severity = 'success';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.i-tag'));
    expect(el.nativeElement.classList).toContain('i-tag-success');
  });

  it('should apply rounded class when rounded=true', () => {
    component.rounded = true;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.i-tag'));
    expect(el.nativeElement.classList).toContain('i-tag-rounded');
  });

  it('should not apply rounded class when rounded=false', () => {
    component.rounded = false;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.i-tag'));
    expect(el.nativeElement.classList).not.toContain('i-tag-rounded');
  });

  it('should render icon when provided', () => {
    component.icon = 'pi pi-check';
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('.i-tag-icon'));
    expect(icon).toBeTruthy();
  });

  it('should not render icon element when icon is absent', () => {
    component.icon = undefined;
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('.i-tag-icon'));
    expect(icon).toBeNull();
  });

  it('should apply sm size class', () => {
    component.size = 'sm';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.i-tag'));
    expect(el.nativeElement.classList).toContain('i-tag-sm');
  });

  it('should apply lg size class', () => {
    component.size = 'lg';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.i-tag'));
    expect(el.nativeElement.classList).toContain('i-tag-lg');
  });
});
