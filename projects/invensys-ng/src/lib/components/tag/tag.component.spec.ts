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
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the value', () => {
    fixture.componentRef.setInput('value', 'Active');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.i-tag-value'));
    expect(span.nativeElement.textContent.trim()).toBe('Active');
  });

  it('should apply severity class', () => {
    fixture.componentRef.setInput('severity', 'success');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.i-tag'));
    expect(el.nativeElement.classList).toContain('i-tag-success');
  });

  it('should apply rounded class when rounded=true', () => {
    fixture.componentRef.setInput('rounded', true);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.i-tag'));
    expect(el.nativeElement.classList).toContain('i-tag-rounded');
  });

  it('should not apply rounded class when rounded=false', () => {
    fixture.componentRef.setInput('rounded', false);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.i-tag'));
    expect(el.nativeElement.classList).not.toContain('i-tag-rounded');
  });

  it('should render icon when provided', () => {
    fixture.componentRef.setInput('icon', 'pi pi-check');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('.i-tag-icon'));
    expect(icon).toBeTruthy();
  });

  it('should not render icon element when icon is absent', () => {
    fixture.componentRef.setInput('icon', undefined);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('.i-tag-icon'));
    expect(icon).toBeNull();
  });

  it('should apply sm size class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.i-tag'));
    expect(el.nativeElement.classList).toContain('i-tag-sm');
  });

  it('should apply lg size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.i-tag'));
    expect(el.nativeElement.classList).toContain('i-tag-lg');
  });
});
