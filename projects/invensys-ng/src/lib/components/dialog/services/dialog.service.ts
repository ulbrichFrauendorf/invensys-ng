import {
  Injectable,
  ComponentRef,
  ViewContainerRef,
  Injector,
  Type,
  createComponent,
  EnvironmentInjector,
  inject,
  ApplicationRef,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IDialog } from '../dialog.component';
import { IDynamicDialogConfig, IDynamicDialogRef } from './dialog.interfaces';

/**
 * Service for dynamically creating and managing dialog components.
 *
 * This service provides a programmatic way to open dialogs with custom components,
 * handling the component lifecycle, DOM attachment, change detection, and cleanup
 * automatically. It creates a dialog wrapper and injects the specified component
 * into it with optional configuration and data.
 *
 * @example
 * ```typescript
 * // Basic usage
 * constructor(private dialogService: DialogService) {}
 *
 * openDialog() {
 *   const ref = this.dialogService.open(MyCustomComponent, {
 *     header: 'Edit User',
 *     width: '500px',
 *     data: { userId: 123 }
 *   });
 *
 *   ref.onClose.subscribe(result => {
 *     if (result) {
 *       console.log('Dialog closed with result:', result);
 *     }
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Responsive dialog with custom styles
 * openResponsiveDialog() {
 *   this.dialogService.open(FormComponent, {
 *     header: 'Create New Item',
 *     width: '600px',
 *     contentStyle: { overflow: 'auto', padding: '20px' },
 *     breakpoints: {
 *       '960px': '75vw',
 *       '640px': '90vw'
 *     },
 *     data: { mode: 'create' }
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  /**
   * Angular's environment injector for creating components.
   * @internal
   */
  private environmentInjector = inject(EnvironmentInjector);

  /**
   * Application reference for managing component views in Angular's change detection.
   * @internal
   */
  private appRef = inject(ApplicationRef);

  /**
   * Opens a dialog with the specified component and configuration.
   *
   * Creates a dialog wrapper component, instantiates the provided component inside it,
   * and handles all necessary setup including change detection, DOM attachment, and
   * event subscriptions. The component instance will receive `config`, `dialogRef`,
   * and `data` properties if they are defined on the component.
   *
   * @template T The type of the component to display in the dialog
   * @param component The component class to render inside the dialog
   * @param config Configuration options for the dialog appearance and behavior
   * @returns A reference object that can be used to control the dialog and subscribe to close events
   *
   * @example
   * ```typescript
   * const ref = this.dialogService.open(UserFormComponent, {
   *   header: 'Edit User',
   *   width: '500px',
   *   height: '600px',
   *   closable: true,
   *   modal: true,
   *   data: {
   *     user: this.selectedUser,
   *     mode: 'edit'
   *   }
   * });
   *
   * // Handle dialog close
   * ref.onClose.subscribe(savedUser => {
   *   if (savedUser) {
   *     this.updateUserList(savedUser);
   *   }
   * });
   *
   * // Programmatically close the dialog
   * setTimeout(() => {
   *   ref.close();
   * }, 5000);
   * ```
   */
  open<T>(
    component: Type<T>,
    config: IDynamicDialogConfig = {}
  ): IDynamicDialogRef {
    // Create the dialog wrapper component
    const dialogRef = createComponent(IDialog, {
      environmentInjector: this.environmentInjector,
    });

    // Create the dynamic component to be displayed inside the dialog
    const componentRef = createComponent(component, {
      environmentInjector: this.environmentInjector,
    });

    // Set dialog properties
    dialogRef.instance.header = config.header;
    dialogRef.instance.width = config.width || '300px';
    dialogRef.instance.height = config.height;
    dialogRef.instance.contentStyle = config.contentStyle;
    dialogRef.instance.breakpoints = config.breakpoints;
    dialogRef.instance.closable = config.closable !== false;
    dialogRef.instance.modal = config.modal !== false;
    dialogRef.instance.dismissableMask = config.dismissableMask ?? false;

    // Create the dialog reference first so we can pass it to the component
    const closeSubject = new Subject<any>();
    let isClosing = false; // Flag to prevent circular calls

    const ref: IDynamicDialogRef = {
      close: (result?: any) => {
        if (isClosing) return; // Prevent circular calls
        isClosing = true;

        dialogRef.instance.hide();

        // Properly detach views from Angular's change detection before destroying
        this.appRef.detachView(componentRef.hostView);
        this.appRef.detachView(dialogRef.hostView);

        if (dialogRef.location.nativeElement.parentNode) {
          dialogRef.location.nativeElement.parentNode.removeChild(
            dialogRef.location.nativeElement
          );
        }
        componentRef.destroy();
        dialogRef.destroy();
        closeSubject.next(result);
        closeSubject.complete();
      },
      onClose: closeSubject.asObservable(),
      instance: dialogRef.instance,
    };

    // Inject data and dialog reference into the dynamic component
    if (componentRef.instance && typeof componentRef.instance === 'object') {
      // Always set config if the property exists
      if ('config' in componentRef.instance) {
        (componentRef.instance as any).config = config;
      }
      // Always set dialogRef if the property exists
      if ('dialogRef' in componentRef.instance) {
        (componentRef.instance as any).dialogRef = ref;
      }
      // Set data from config if it exists and the property exists on the component
      if ('data' in componentRef.instance) {
        (componentRef.instance as any).data = config.data || {};
      }
    }

    // Attach both components to Angular's change detection cycle
    // This is critical for proper change detection in dynamic components
    this.appRef.attachView(dialogRef.hostView);
    this.appRef.attachView(componentRef.hostView);

    // Trigger change detection to ensure ngOnInit is called with the injected data
    componentRef.changeDetectorRef.detectChanges();

    document.body.appendChild(dialogRef.location.nativeElement);

    // Subscribe to dialog visibility changes to handle close button, ESC key, and overlay clicks
    dialogRef.instance.visibleChange.subscribe((visible: boolean) => {
      if (!visible && !isClosing) {
        // Dialog was closed via close button, ESC, or overlay click
        ref.close();
      }
    });

    // Show the dialog and wait for the next tick to ensure DOM is rendered
    dialogRef.instance.show();

    // Insert the dynamic component into the dialog content
    const dialogContent =
      dialogRef.location.nativeElement.querySelector('.i-dialog-content');
    if (dialogContent) {
      dialogContent.appendChild(componentRef.location.nativeElement);
    }

    return ref;
  }
}
