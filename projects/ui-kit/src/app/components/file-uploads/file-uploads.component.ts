import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IFileUpload } from '@shared/components/file-upload/file-upload.component';
import { FileUploadOptions } from '@shared/components/file-upload/file-upload.types';
import { IPlaceholder } from '@shared/components/placeholder/placeholder.component';
import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-file-uploads',
  imports: [IFileUpload, IPlaceholder, DemoPlaygroundComponent, DemoOptionDirective],
  template: `
    <app-demo-playground class="file-uploads-demo" title="File Upload" description="Select files with drag and drop or the file picker. Each example keeps its own selection.">
    <ng-template appDemoOption="any-file" label="Any file type" [sourceCode]="genericCode" [selected]="true">
      <i-file-upload [(files)]="files" />
    </ng-template>
    <ng-template appDemoOption="pdf" label="PDF documents" [sourceCode]="pdfCode">
      <i-file-upload [(files)]="pdfs" [options]="pdfOptions" dropLabel="Drop your PDFs here"
        chooseLabel="Choose PDFs" ariaLabel="Choose PDF files" fileIcon="pi pi-file-pdf" />
    </ng-template>
    <ng-template appDemoOption="image" label="Single image (2 MB)" [sourceCode]="imageCode">
      <i-file-upload [(files)]="images" [options]="imageOptions" fileIcon="pi pi-image" />
    </ng-template>
    <ng-template appDemoOption="disabled" label="Disabled" [sourceCode]="disabledCode">
      <i-file-upload [disabled]="true" />
    </ng-template>
    <ng-template appDemoOption="border-comparison" label="Upload and placeholder borders" [sourceCode]="borderCode">
      <p>Both components use the same dashed border, radius, and card surface. Focus the upload button or drag a file over it to see the active border.</p>
      <div class="border-comparison">
        <i-file-upload [(files)]="comparisonFiles" />
        <i-placeholder customIcon="pi pi-inbox">
          <h3>No files selected</h3>
          <p>Upload files to get started.</p>
        </i-placeholder>
      </div>
    </ng-template>
    </app-demo-playground>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .border-comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    @media (max-width: 700px) { .border-comparison { grid-template-columns: minmax(0, 1fr); } }
  `,
})
export class FileUploadsComponent {
  files: File[] = [];
  pdfs: File[] = [];
  images: File[] = [];
  comparisonFiles: File[] = [];
  readonly borderCode = `<i-file-upload [(files)]="files" />
<i-placeholder customIcon="pi pi-inbox">Upload files to get started.</i-placeholder>`;
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
