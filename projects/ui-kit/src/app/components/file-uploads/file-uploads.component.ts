import { Component } from '@angular/core';
import { IFileUpload } from '@shared/components/file-upload/file-upload.component';
import { FileUploadOptions } from '@shared/components/file-upload/file-upload.types';
import { DemoCardComponent } from '../demo-card/demo-card.component';

@Component({
  selector: 'app-file-uploads',
  imports: [IFileUpload, DemoCardComponent],
  template: `
    <h1>File Upload</h1>
    <p>Select files with drag and drop or the file picker. Each example keeps its own selection.</p>
    <app-demo-card title="Any file type" [sourceCode]="genericCode">
      <i-file-upload [(files)]="files" />
    </app-demo-card>
    <app-demo-card title="PDF documents" [sourceCode]="pdfCode">
      <i-file-upload [(files)]="pdfs" [options]="pdfOptions" dropLabel="Drop your PDFs here"
        chooseLabel="Choose PDFs" ariaLabel="Choose PDF files" fileIcon="pi pi-file-pdf" />
    </app-demo-card>
    <app-demo-card title="Single image (2 MB)" [sourceCode]="imageCode">
      <i-file-upload [(files)]="images" [options]="imageOptions" fileIcon="pi pi-image" />
    </app-demo-card>
    <app-demo-card title="Disabled" [sourceCode]="disabledCode">
      <i-file-upload [disabled]="true" />
    </app-demo-card>
  `,
})
export class FileUploadsComponent {
  files: File[] = [];
  pdfs: File[] = [];
  images: File[] = [];
  readonly pdfOptions: FileUploadOptions = {
    fileTypes: ['.pdf', 'application/pdf'], maxFiles: 20,
    maxFileSize: 25 * 1024 * 1024, maxTotalSize: 100 * 1024 * 1024,
  };
  readonly imageOptions: FileUploadOptions = {
    fileTypes: ['image/*'], multiple: false, maxFileSize: 2 * 1024 * 1024,
  };
  readonly genericCode = '<i-file-upload [(files)]="files" />';
  readonly pdfCode = '<i-file-upload [(files)]="pdfs" [options]="pdfOptions" />';
  readonly imageCode = '<i-file-upload [(files)]="images" [options]="imageOptions" />';
  readonly disabledCode = '<i-file-upload [disabled]="true" />';
}

