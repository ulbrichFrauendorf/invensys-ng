import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, BehaviorSubject, interval, map, takeWhile } from 'rxjs';
import { IDialogBase } from '@shared/components/dialog/base-dialog.component';
import { IDialogActions } from '@shared/components/dialog/inner/dialog-actions/dialog-actions.component';
import { IInputText } from '@shared/components/input-text/input-text.component';
import {
  IListbox,
  ListboxOption,
} from '@shared/components/listbox/listbox.component';

@Component({
  selector: 'app-example-dialog',
  imports: [
    CommonModule,
    AsyncPipe,
    ReactiveFormsModule,
    IDialogActions,
    IInputText,
    IListbox,
  ],
  templateUrl: './example-dialog.component.html',
  styleUrl: './example-dialog.component.scss',
})
export class ExampleDialogComponent
  extends IDialogBase
  implements OnInit, OnDestroy
{
  public form: FormGroup;
  public departmentOptions$: Observable<ListboxOption[]>;
  private departmentSubject = new BehaviorSubject<ListboxOption[]>([]);
  private isComponentActive = true;

  // Simulated departments data that updates over time
  private initialDepartments: ListboxOption[] = [
    { id: 1, name: 'Engineering', code: 'ENG', employees: 25 },
    { id: 2, name: 'Marketing', code: 'MKT', employees: 12 },
    { id: 3, name: 'Sales', code: 'SAL', employees: 18 },
  ];

  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      message: ['', [Validators.required]],
      user: ['', [Validators.required]],
      selectedDepartments: [
        [1, 2],
        [Validators.required, Validators.minLength(1)],
      ],
    });

    // Initialize the observable with the subject
    this.departmentOptions$ = this.departmentSubject.asObservable();

    // Start with initial data
    this.departmentSubject.next(this.initialDepartments);
  }

  override ngOnInit() {
    super.ngOnInit();

    // Simulate dynamic data updates every 5 seconds
    this.simulateDynamicData();

    // Initialize form with data from config
    const data = this.getData();
    if (data) {
      this.form.patchValue({
        message: data.message || '',
        user: data.user || '',
        selectedDepartments: data.selectedDepartments || [1, 2],
      });
    }

    // Debug form changes
    this.form.get('selectedDepartments')?.valueChanges.subscribe((value) => {
      console.log('Dynamic dialog - Departments form value changed:', value);
    });
  }

  ngOnDestroy() {
    this.isComponentActive = false;
  }

  private simulateDynamicData() {
    // Simulate adding new departments over time
    const additionalDepartments = [
      { id: 4, name: 'Human Resources', code: 'HR', employees: 8 },
      { id: 5, name: 'Finance', code: 'FIN', employees: 15 },
      { id: 6, name: 'Operations', code: 'OPS', employees: 22 },
      { id: 7, name: 'Research & Development', code: 'RND', employees: 30 },
    ];

    // Add a new department every 5 seconds
    interval(5000)
      .pipe(
        takeWhile(() => this.isComponentActive),
        map((index) => index % additionalDepartments.length),
      )
      .subscribe((index) => {
        const currentDepartments = this.departmentSubject.value;
        const newDepartment = additionalDepartments[index];

        // Check if department already exists to avoid duplicates
        if (
          !currentDepartments.some((dept) => dept['id'] === newDepartment['id'])
        ) {
          const updatedDepartments = [...currentDepartments, newDepartment];
          this.departmentSubject.next(updatedDepartments);

          console.log(
            'Dynamic dialog: Department updated, change detection should now work via ApplicationRef',
          );
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      // Close dialog and pass the form data as result
      this.close(formData);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onHide() {
    this.close();
  }
}
