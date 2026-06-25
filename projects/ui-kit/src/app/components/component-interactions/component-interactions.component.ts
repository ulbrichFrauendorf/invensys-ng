import { Component, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { IAccordion } from '../../../../../invensys-ng/src/lib/components/accordion/accordion.component';
import { IAccordionList } from '../../../../../invensys-ng/src/lib/components/accordion-list/accordion-list.component';
import { IPanel } from '../../../../../invensys-ng/src/lib/components/panel/panel.component';
import { ISelect } from '@shared/components/select/select.component';
import { IMultiSelect } from '@shared/components/multi-select/multi-select.component';
import { IButton } from '@shared/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-component-interactions',
  imports: [
    JsonPipe,
    IAccordion,
    IAccordionList,
    IPanel,
    ISelect,
    IMultiSelect,
    IButton,
    ReactiveFormsModule,
    FormsModule,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './component-interactions.component.html',
  styleUrl: './component-interactions.component.scss',
})
export class ComponentInteractionsComponent implements OnInit {
  interactionForm: FormGroup;

  // Sample data for selects
  countries = [
    { value: 'us', label: 'United States', code: 'US' },
    { value: 'uk', label: 'United Kingdom', code: 'GB' },
    { value: 'de', label: 'Germany', code: 'DE' },
    { value: 'fr', label: 'France', code: 'FR' },
    { value: 'it', label: 'Italy', code: 'IT' },
    { value: 'es', label: 'Spain', code: 'ES' },
    { value: 'ca', label: 'Canada', code: 'CA' },
    { value: 'au', label: 'Australia', code: 'AU' },
    { value: 'jp', label: 'Japan', code: 'JP' },
    { value: 'br', label: 'Brazil', code: 'BR' },
  ];

  categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports' },
  ];

  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  features = [
    { value: 'notifications', label: 'Notifications' },
    { value: 'darkMode', label: 'Dark Mode' },
    { value: 'autoSave', label: 'Auto Save' },
    { value: 'twoFactor', label: 'Two-Factor Auth' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'api', label: 'API Access' },
  ];

  tags = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'review', label: 'Needs Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived' },
  ];

  languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' },
  ];

  // Code examples
  codeExamples = {
    dropdownInAccordion: `<i-accordion-list [multiple]="true">
  <i-accordion header="User Settings" icon="pi pi-user">
    <div class="form-group">
      <i-select
        label="Country"
        [options]="countries"
        optionLabel="label"
        optionValue="value"
        formControlName="country"
        placeholder="Select country"
        [filter]="true" />
    </div>
  </i-accordion>

  <i-accordion header="Product Settings" icon="pi pi-shopping-cart">
    <div class="form-group">
      <i-select
        label="Category"
        [options]="categories"
        optionLabel="label"
        optionValue="value"
        formControlName="category"
        placeholder="Select category" />

      <i-select
        label="Priority"
        [options]="priorities"
        optionLabel="label"
        optionValue="value"
        formControlName="priority"
        placeholder="Select priority" />
    </div>
  </i-accordion>
</i-accordion-list>`,
    multiSelectInAccordion: `<i-accordion header="Advanced Settings" icon="pi pi-cog">
  <div class="form-group">
    <i-multi-select
      label="Enable Features"
      [options]="features"
      optionLabel="label"
      optionValue="value"
      formControlName="selectedFeatures"
      placeholder="Select features to enable"
      [filter]="true" />

    <i-multi-select
      label="Tags"
      [options]="tags"
      optionLabel="label"
      optionValue="value"
      formControlName="selectedTags"
      placeholder="Select tags" />
  </div>
</i-accordion>`,
    selectInPanel: `<i-panel header="User Preferences" [toggleable]="true">
  <div class="form-group">
    <i-select
      label="Country"
      [options]="countries"
      optionLabel="label"
      optionValue="value"
      formControlName="country"
      placeholder="Select your country"
      [filter]="true"
      [showClear]="true" />

    <i-multi-select
      label="Languages"
      [options]="languages"
      optionLabel="label"
      optionValue="value"
      formControlName="selectedLanguages"
      placeholder="Select languages"
      [filter]="true" />
  </div>
</i-panel>`,
  };

  tsExamples = {
    setup: `import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IAccordion, IAccordionList, ISelect, IMultiSelect } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, IAccordion, IAccordionList, ISelect, IMultiSelect],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  interactionForm = this.fb.group({
    country: [''],
    category: [''],
    priority: [''],
    selectedFeatures: [[]],
    selectedTags: [[]]
  });

  constructor(private fb: FormBuilder) {}
}`,
  };

  componentFeatures: Feature[] = [
    {
      title: 'Dropdown in Accordion',
      description:
        'Demonstrates how dropdowns properly function inside accordion panels without z-index issues',
    },
    {
      title: 'Multi-Select in Accordion',
      description:
        'Shows multi-select dropdowns expanding correctly beyond accordion boundaries',
    },
    {
      title: 'Dropdown in Panel',
      description:
        'Ensures select and multi-select components work correctly inside panel containers with proper overlay visibility',
    },
    {
      title: 'Form Integration',
      description:
        'Shows reactive forms working seamlessly across accordion panels',
    },
    {
      title: 'Multiple Interactions',
      description:
        'Test how multiple accordions with dropdowns behave when opened simultaneously',
    },
    {
      title: 'State Management',
      description:
        'Form state is preserved when accordion panels are collapsed and expanded',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.interactionForm = this.fb.group({
      country: [''],
      category: [''],
      priority: [''],
      selectedFeatures: [[]],
      selectedTags: [[]],
      selectedLanguages: [[]],
    });
  }

  ngOnInit() {
    // Subscribe to form changes for demonstration
    this.interactionForm.valueChanges.subscribe((values) => {
      console.log('Form values changed:', values);
    });
  }

  onSubmit() {
    console.log('Form submitted:', this.interactionForm.value);
  }

  resetForm() {
    this.interactionForm.reset();
  }
}
