import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IButton } from '../button/button.component';
import { IMessage } from '../message/message.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { FileUploadOptions, FileUploadValidationError } from './file-upload.types';

/**
 * Selects and validates local files. The consuming app owns the selection and upload transport.
 * @example
 * <i-file-upload [(files)]="files" [options]="uploadOptions" />
 */
@Component({
  selector: 'i-file-upload',
  standalone: true,
  imports: [IButton, IMessage],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IFileUpload {
  /** Controlled selection; supports [(files)]. */
  @Input() files: File[] = [];
  @Input() options: FileUploadOptions = {};
  @Input() disabled = false;
  @Input() dropLabel = 'Drop your files here';
  @Input() description = 'or choose files from your device';
  @Input() chooseLabel = 'Choose files';
  @Input() ariaLabel = 'Choose files';
  @Input() uploadIcon = 'pi pi-cloud-upload';
  @Input() fileIcon = 'pi pi-file';
  /** Emits only when a valid selection changes. Invalid batches are rejected as a whole. */
  @Output() filesChange = new EventEmitter<File[]>();
  @Output() validationError = new EventEmitter<FileUploadValidationError>();

  readonly componentId = UniqueComponentId('i-file-upload-');
  dragging = false;
  error: FileUploadValidationError | null = null;

  get limits(): Required<FileUploadOptions> {
    return {
      fileTypes: this.options.fileTypes ?? [],
      multiple: this.options.multiple ?? true,
      maxFiles: this.options.maxFiles ?? 20,
      maxFileSize: this.options.maxFileSize ?? 25 * 1024 * 1024,
      maxTotalSize: this.options.maxTotalSize ?? 100 * 1024 * 1024,
      allowEmptyFiles: this.options.allowEmptyFiles ?? false,
    };
  }

  get accept(): string {
    return this.limits.fileTypes.join(',');
  }

  get limitsLabel(): string {
    const limits = this.limits;
    return `Up to ${limits.multiple ? limits.maxFiles : Math.min(1, limits.maxFiles)} files · ${this.formatSize(limits.maxFileSize)} per file · ${this.formatSize(limits.maxTotalSize)} total`;
  }

  onSelect(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.addFiles(Array.from(element.files ?? []));
    element.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.disabled) this.dragging = true;
  }

  onDragLeave(event: DragEvent): void {
    const zone = event.currentTarget as HTMLElement;
    if (!(event.relatedTarget instanceof Node) || !zone.contains(event.relatedTarget)) {
      this.dragging = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    this.addFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  addFiles(incoming: readonly File[]): void {
    if (this.disabled || incoming.length === 0) return;
    this.error = null;
    const limits = this.limits;
    for (const file of incoming) {
      if (!this.accepts(file)) {
        this.reject({
          code: 'fileType',
          file,
          message: `${file.name}: supported file types are ${limits.fileTypes.join(', ')}.`,
        });
        return;
      }
      if (!limits.allowEmptyFiles && file.size === 0) {
        this.reject({ code: 'emptyFile', file, message: `${file.name} is empty.` });
        return;
      }
      if (file.size > limits.maxFileSize) {
        this.reject({
          code: 'fileSize',
          file,
          message: `${file.name} exceeds ${this.formatSize(limits.maxFileSize)} per file.`,
        });
        return;
      }
    }
    // Single-file mode replaces the existing selection. A multi-file drop is still rejected.
    const combined = limits.multiple ? [...this.files] : [];
    for (const file of incoming) {
      if (!combined.some((existing) => this.sameFile(existing, file))) combined.push(file);
    }
    const maxFiles = limits.multiple ? limits.maxFiles : Math.min(1, limits.maxFiles);
    if (combined.length > maxFiles) {
      this.reject({
        code: 'fileCount',
        message: `Select at most ${maxFiles} file${maxFiles === 1 ? '' : 's'}.`,
      });
      return;
    }
    if (combined.reduce((total, file) => total + file.size, 0) > limits.maxTotalSize) {
      this.reject({
        code: 'totalSize',
        message: `Selected files exceed ${this.formatSize(limits.maxTotalSize)} in total.`,
      });
      return;
    }
    if (
      combined.length !== this.files.length ||
      combined.some((file, index) => !this.sameFile(file, this.files[index]))
    ) {
      this.filesChange.emit(combined);
    }
  }

  remove(index: number): void {
    if (this.disabled || index < 0 || index >= this.files.length) return;
    this.error = null;
    this.filesChange.emit(this.files.filter((_, position) => position !== index));
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Number((bytes / 1024).toFixed(1))} KB`;
    return `${Number((bytes / (1024 * 1024)).toFixed(1))} MB`;
  }

  private accepts(file: File): boolean {
    return (
      this.limits.fileTypes.length === 0 ||
      this.limits.fileTypes.some((type) => {
        const token = type.toLowerCase();
        if (token.startsWith('.')) return file.name.toLowerCase().endsWith(token);
        if (token.endsWith('/*')) return file.type.toLowerCase().startsWith(token.slice(0, -1));
        return file.type.toLowerCase() === token;
      })
    );
  }

  private sameFile(a: File, b: File): boolean {
    return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
  }

  private reject(error: FileUploadValidationError): void {
    this.error = error;
    this.validationError.emit(error);
  }
}
