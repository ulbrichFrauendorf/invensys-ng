import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  IDynamicDialogConfig,
  IDynamicDialogRef,
} from './services/dialog.interfaces';

@Component({
  template: '',
})
export abstract class IDialogBase implements OnInit, AfterViewInit {
  public dialogRef?: IDynamicDialogRef;
  public config: IDynamicDialogConfig = {};

  constructor() {}

  ngOnInit(): void {
    this.initializeDialogProperties();
  }

  ngAfterViewInit(): void {
    this.initializeDialogProperties();
  }

  private initializeDialogProperties(): void {
    if (!this.config) {
      this.config = {};
    }

    if (!this.dialogRef && typeof window !== 'undefined') {
      setTimeout(() => {
        if (!this.dialogRef) {
          console.warn(
            'BaseDialogComponent: dialogRef is not available. Dialog may not close properly.'
          );
        }
      }, 100);
    }
  }

  protected close(result?: any): void {
    if (this.dialogRef) {
      this.dialogRef.close(result);
    } else {
      console.error(
        'BaseDialogComponent: Cannot close dialog - dialogRef is not available'
      );
    }
  }

  protected getData<T = any>(): T | undefined {
    return this.config?.data as T;
  }

  protected getDataProperty<T = any>(key: string): T | undefined {
    return this.config?.data?.[key] as T;
  }

  protected hasData(key?: string): boolean {
    if (!this.config?.data) {
      return false;
    }

    if (key) {
      return key in this.config.data;
    }

    return true;
  }
}
