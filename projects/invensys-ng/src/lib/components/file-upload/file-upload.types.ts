/** Native accept tokens: extensions, MIME types, or MIME groups such as image/*. */
export type FileUploadType = `.${string}` | `${string}/${string}`;

export interface FileUploadOptions {
  /** Empty or omitted accepts all file types. Tokens are matched case-insensitively. */
  fileTypes?: readonly FileUploadType[];
  /** Allow selecting more than one file. Defaults to true. */
  multiple?: boolean;
  /** Maximum selected files. Defaults to 20. */
  maxFiles?: number;
  /** Maximum bytes per file. Defaults to 25 MiB. */
  maxFileSize?: number;
  /** Maximum combined bytes. Defaults to 100 MiB. */
  maxTotalSize?: number;
  /** Accept zero-byte files. Defaults to false. */
  allowEmptyFiles?: boolean;
}

export type FileUploadErrorCode = 'fileType' | 'emptyFile' | 'fileSize' | 'fileCount' | 'totalSize';

export interface FileUploadValidationError {
  code: FileUploadErrorCode;
  message: string;
  file?: File;
}
