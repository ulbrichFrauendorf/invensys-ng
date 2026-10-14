import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IFileUpload } from './file-upload.component';

describe('IFileUpload', () => {
  let fixture: ComponentFixture<IFileUpload>;
  let component: IFileUpload;
  const file = (name: string, size = 3, type = '') => new File([new Uint8Array(size)], name, { type, lastModified: 1 });

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [IFileUpload] }).compileComponents();
    fixture = TestBed.createComponent(IFileUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('accepts arbitrary files by default and deduplicates against the selection and batch', () => {
    const first = file('first.txt');
    component.files = [first];
    const emit = spyOn(component.filesChange, 'emit');
    const second = file('second.bin');
    component.addFiles([first, second, second]);
    expect(emit).toHaveBeenCalledOnceWith([first, second]);
    expect(component.files).toEqual([first]);
    emit.calls.reset();
    component.addFiles([first]);
    expect(emit).not.toHaveBeenCalled();
  });

  it('matches extensions, exact MIME types and wildcard MIME types', () => {
    component.options = { fileTypes: ['.pdf', 'text/plain', 'image/*'] };
    const files = [file('A.PDF'), file('no-extension', 3, 'text/plain'), file('photo', 3, 'image/png')];
    const emit = spyOn(component.filesChange, 'emit');
    component.addFiles(files);
    expect(emit).toHaveBeenCalledOnceWith(files);
    component.addFiles([file('bad.exe'), file('valid.pdf')]);
    expect(component.error?.code).toBe('fileType');
    expect(emit.calls.count()).toBe(1);
  });

  it('rejects empty files and permits them when configured', () => {
    const empty = file('empty.txt', 0);
    const emit = spyOn(component.filesChange, 'emit');
    component.addFiles([empty]);
    expect(component.error?.code).toBe('emptyFile');
    expect(emit).not.toHaveBeenCalled();
    component.options = { allowEmptyFiles: true };
    component.addFiles([empty]);
    expect(emit).toHaveBeenCalledOnceWith([empty]);
  });

  it('enforces per-file, count and total limits including existing files', () => {
    component.options = { maxFiles: 2, maxFileSize: 4, maxTotalSize: 6 };
    component.files = [file('existing.txt')];
    const emit = spyOn(component.filesChange, 'emit');
    const errors = spyOn(component.validationError, 'emit');
    component.addFiles([file('large.txt', 5)]);
    expect(component.error?.code).toBe('fileSize');
    component.addFiles([file('a.txt', 1), file('b.txt', 1)]);
    expect(component.error?.code).toBe('fileCount');
    component.addFiles([file('total.txt', 4)]);
    expect(component.error?.code).toBe('totalSize');
    expect(emit).not.toHaveBeenCalled();
    expect(errors.calls.count()).toBe(3);
    const boundary = file('boundary.txt', 3);
    component.addFiles([boundary]);
    expect(emit).toHaveBeenCalledOnceWith([...component.files, boundary]);
    expect(component.error).toBeNull();
  });

  it('replaces the selection in single-file mode and rejects multiple dropped files', () => {
    component.options = { multiple: false };
    component.files = [file('old.txt')];
    const replacement = file('new.txt');
    const emit = spyOn(component.filesChange, 'emit');
    component.addFiles([replacement]);
    expect(emit).toHaveBeenCalledOnceWith([replacement]);
    component.addFiles([file('a.txt'), file('b.txt')]);
    expect(component.error?.code).toBe('fileCount');
    expect(emit.calls.count()).toBe(1);
  });

  it('blocks selection, drops and removal while disabled', () => {
    component.files = [file('old.txt')];
    component.disabled = true;
    const emit = spyOn(component.filesChange, 'emit');
    component.addFiles([file('new.txt')]);
    component.remove(0);
    const preventDefault = jasmine.createSpy('preventDefault');
    component.onDrop({ preventDefault, dataTransfer: { files: [file('drop.txt')] } } as unknown as DragEvent);
    expect(preventDefault).toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it('removes selected files and clears validation errors', () => {
    const retained = file('keep.txt');
    component.files = [file('remove.txt'), retained];
    component.error = { code: 'fileCount', message: 'error' };
    const emit = spyOn(component.filesChange, 'emit');
    component.remove(0);
    expect(emit).toHaveBeenCalledOnceWith([retained]);
    expect(component.error).toBeNull();
  });

  it('binds native restrictions and renders custom labels and validation feedback', () => {
    fixture.componentRef.setInput('options', { fileTypes: ['.pdf'], multiple: false, maxFileSize: 1024 });
    fixture.componentRef.setInput('chooseLabel', 'Choose PDF');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.accept).toBe('.pdf');
    expect(input.multiple).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('Choose PDF');
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', { value: { files: [file('bad.txt')] } });
    fixture.nativeElement.querySelector('.i-file-upload__drop-zone').dispatchEvent(drop);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('bad.txt');
  });

  it('uses the same validation for picker and drop and resets the picker', () => {
    component.options = { fileTypes: ['.pdf'] };
    const selected = file('selected.pdf');
    const target = { files: [selected], value: 'selected.pdf' };
    const emit = spyOn(component.filesChange, 'emit');
    component.onSelect({ target } as unknown as Event);
    expect(target.value).toBe('');
    expect(emit).toHaveBeenCalledOnceWith([selected]);
    component.onDrop({ preventDefault() {}, dataTransfer: { files: [file('bad.txt')] } } as unknown as DragEvent);
    expect(component.error?.code).toBe('fileType');
    expect(emit.calls.count()).toBe(1);
  });
});
