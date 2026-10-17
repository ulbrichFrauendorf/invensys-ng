import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/services/confirmation-dialog.service';
import { ConfirmationDialogsComponent } from './confirmation-dialogs.component';

describe('Confirmation dialog playground', () => {
  let fixture: ComponentFixture<ConfirmationDialogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogsComponent],
      providers: [{ provide: ConfirmationDialogService, useValue: {} }],
    }).compileComponents();
    fixture = TestBed.createComponent(ConfirmationDialogsComponent);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('updates displayed code when options are enabled, edited, and removed', () => {
    const component = fixture.componentInstance;
    fixture.nativeElement
      .querySelector('button[aria-label="View code"]')
      .click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const displayedCode = () =>
      fixture.nativeElement.querySelector('pre code').textContent as string;
    expect(displayedCode()).not.toContain('acceptLabel:');

    component.setEnabled('acceptLabel', true);
    component.setValue('acceptLabel', 'Delete "this" item\nnow');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(displayedCode()).toContain(
      'acceptLabel: "Delete \\"this\\" item\\nnow"',
    );
    expect(component.configuration().acceptLabel).toBe(
      'Delete "this" item\nnow',
    );

    component.setEnabled('acceptLabel', false);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(displayedCode()).not.toContain('acceptLabel:');
    expect(component.configuration().acceptLabel).toBeUndefined();
  });

  it('keeps the required message and includes only selected callbacks', () => {
    const component = fixture.componentInstance;
    component.setEnabled('message', false);
    component.setEnabled('accept', true);
    expect(component.code()).toContain('message:');
    expect(component.code()).toContain("accept: () => console.log('Accepted')");
    expect(component.code()).not.toContain('reject:');

    component.configuration().accept?.();
    expect(component.result()).toContain('Accept callback executed');
  });

  it('switches between preview and code in the same card without losing options', () => {
    const element = fixture.nativeElement as HTMLElement;
    const component = fixture.componentInstance;
    component.setEnabled('severity', true);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    element
      .querySelector<HTMLButtonElement>('button[aria-label="View code"]')!
      .click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(
      element.querySelector('.preview-panel pre code')?.textContent,
    ).toContain('severity: "danger"');
    expect(element.querySelector('.preview-stage')).toBeNull();

    element
      .querySelector<HTMLButtonElement>('button[aria-label="View preview"]')!
      .click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(element.querySelector('.preview-stage')).not.toBeNull();
    expect(element.querySelector('pre code')).toBeNull();
    expect(component.configuration().severity).toBe('danger');
  });
});
