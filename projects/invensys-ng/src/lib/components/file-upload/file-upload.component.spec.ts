import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IFileUpload } from './file-upload.component';
import { IPlaceholder } from '../placeholder/placeholder.component';

describe('IFileUpload', () => {
  let fixture: ComponentFixture<IFileUpload>;
  let component: IFileUpload;
  const file = (name: string, size = 3, type = '') =>
    new File([new Uint8Array(size)], name, { type, lastModified: 1 });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IFileUpload],
    }).compileComponents();
    fixture = TestBed.createComponent(IFileUpload);
    component = fixture.componentInstance;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('uses the placeholder dashed border colour and card surface', () => {
    const placeholder = TestBed.createComponent(IPlaceholder);
    placeholder.changeDetectorRef.markForCheck();
    placeholder.detectChanges();
    // TestBed's renderer replaces the previous root when creating a second fixture.
    document.body.appendChild(fixture.nativeElement);
    for (const host of [fixture.nativeElement, placeholder.nativeElement]) {
      host.style.setProperty('--surface-border', 'rgb(123, 124, 125)');
      host.style.setProperty('--surface-card', 'rgb(240, 241, 242)');
      host.style.setProperty('--color-component-background', 'rgb(10, 11, 12)');
      host.style.setProperty('--color-text-primary', 'rgb(20, 21, 22)');
    }
    const uploadStyle = getComputedStyle(
      fixture.nativeElement.querySelector('.i-file-upload__drop-zone'),
    );
    const placeholderStyle = getComputedStyle(
      placeholder.nativeElement.querySelector('.i-placeholder'),
    );
    expect(uploadStyle.borderTopColor).toBe('rgb(123, 124, 125)');
    expect(uploadStyle.borderTopColor).toBe(placeholderStyle.borderTopColor);
    expect(uploadStyle.borderTopStyle).toBe(placeholderStyle.borderTopStyle);
    expect(uploadStyle.borderTopWidth).toBe(placeholderStyle.borderTopWidth);
    expect(uploadStyle.borderTopLeftRadius).toBe(
      placeholderStyle.borderTopLeftRadius,
    );
    expect(uploadStyle.backgroundColor).toBe(placeholderStyle.backgroundColor);
    placeholder.destroy();
  });

  it('accepts arbitrary files by default and deduplicates against the selection and batch', () => {
    const first = file('first.txt');
    fixture.componentRef.setInput('files', [first]);
    const emit = vi
      .spyOn(component.filesChange, 'emit')
      .mockReturnValue(undefined);
    const second = file('second.bin');
    component.addFiles([first, second, second]);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith([first, second]);
    expect(component.files).toEqual([first]);
    emit.mockClear();
    component.addFiles([first]);
    expect(emit).not.toHaveBeenCalled();
  });

  it('matches extensions, exact MIME types and wildcard MIME types', () => {
    fixture.componentRef.setInput('options', {
      fileTypes: ['.pdf', 'text/plain', 'image/*'],
    });
    const files = [
      file('A.PDF'),
      file('no-extension', 3, 'text/plain'),
      file('photo', 3, 'image/png'),
    ];
    const emit = vi
      .spyOn(component.filesChange, 'emit')
      .mockReturnValue(undefined);
    component.addFiles(files);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith(files);
    component.addFiles([file('bad.exe'), file('valid.pdf')]);
    expect(component.error?.code).toBe('fileType');
    expect(vi.mocked(emit).mock.calls.length).toBe(1);
  });

  it('rejects empty files and permits them when configured', () => {
    const empty = file('empty.txt', 0);
    const emit = vi
      .spyOn(component.filesChange, 'emit')
      .mockReturnValue(undefined);
    component.addFiles([empty]);
    expect(component.error?.code).toBe('emptyFile');
    expect(emit).not.toHaveBeenCalled();
    fixture.componentRef.setInput('options', { allowEmptyFiles: true });
    component.addFiles([empty]);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith([empty]);
  });

  it('enforces per-file, count and total limits including existing files', () => {
    fixture.componentRef.setInput('options', {
      maxFiles: 2,
      maxFileSize: 4,
      maxTotalSize: 6,
    });
    fixture.componentRef.setInput('files', [file('existing.txt')]);
    const emit = vi
      .spyOn(component.filesChange, 'emit')
      .mockReturnValue(undefined);
    const errors = vi
      .spyOn(component.validationError, 'emit')
      .mockReturnValue(undefined);
    component.addFiles([file('large.txt', 5)]);
    expect(component.error?.code).toBe('fileSize');
    component.addFiles([file('a.txt', 1), file('b.txt', 1)]);
    expect(component.error?.code).toBe('fileCount');
    component.addFiles([file('total.txt', 4)]);
    expect(component.error?.code).toBe('totalSize');
    expect(emit).not.toHaveBeenCalled();
    expect(vi.mocked(errors).mock.calls.length).toBe(3);
    const boundary = file('boundary.txt', 3);
    component.addFiles([boundary]);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith([...component.files, boundary]);
    expect(component.error).toBeNull();
  });

  it('replaces the selection in single-file mode and rejects multiple dropped files', () => {
    fixture.componentRef.setInput('options', { multiple: false });
    fixture.componentRef.setInput('files', [file('old.txt')]);
    const replacement = file('new.txt');
    const emit = vi
      .spyOn(component.filesChange, 'emit')
      .mockReturnValue(undefined);
    component.addFiles([replacement]);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith([replacement]);
    component.addFiles([file('a.txt'), file('b.txt')]);
    expect(component.error?.code).toBe('fileCount');
    expect(vi.mocked(emit).mock.calls.length).toBe(1);
  });

  it('blocks selection, drops and removal while disabled', () => {
    fixture.componentRef.setInput('files', [file('old.txt')]);
    fixture.componentRef.setInput('disabled', true);
    const emit = vi
      .spyOn(component.filesChange, 'emit')
      .mockReturnValue(undefined);
    component.addFiles([file('new.txt')]);
    component.remove(0);
    const preventDefault = vi.fn().mockName('preventDefault');
    component.onDrop({
      preventDefault,
      dataTransfer: { files: [file('drop.txt')] },
    } as unknown as DragEvent);
    expect(preventDefault).toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it('removes selected files and clears validation errors', () => {
    const retained = file('keep.txt');
    fixture.componentRef.setInput('files', [file('remove.txt'), retained]);
    component.error = { code: 'fileCount', message: 'error' };
    const emit = vi
      .spyOn(component.filesChange, 'emit')
      .mockReturnValue(undefined);
    component.remove(0);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith([retained]);
    expect(component.error).toBeNull();
  });

  it('binds native restrictions and renders custom labels and validation feedback', () => {
    fixture.componentRef.setInput('options', {
      fileTypes: ['.pdf'],
      multiple: false,
      maxFileSize: 1024,
    });
    fixture.componentRef.setInput('chooseLabel', 'Choose PDF');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    expect(input.accept).toBe('.pdf');
    expect(input.multiple).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Choose PDF');
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', {
      value: { files: [file('bad.txt')] },
    });
    fixture.nativeElement
      .querySelector('.i-file-upload__drop-zone')
      .dispatchEvent(drop);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[role="alert"]').textContent,
    ).toContain('bad.txt');
  });

  it('uses the same validation for picker and drop and resets the picker', () => {
    fixture.componentRef.setInput('options', { fileTypes: ['.pdf'] });
    const selected = file('selected.pdf');
    const target = { files: [selected], value: 'selected.pdf' };
    const emit = vi
      .spyOn(component.filesChange, 'emit')
      .mockReturnValue(undefined);
    component.onSelect({ target } as unknown as Event);
    expect(target.value).toBe('');
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith([selected]);
    component.onDrop({
      preventDefault() {},
      dataTransfer: { files: [file('bad.txt')] },
    } as unknown as DragEvent);
    expect(component.error?.code).toBe('fileType');
    expect(vi.mocked(emit).mock.calls.length).toBe(1);
  });
});
