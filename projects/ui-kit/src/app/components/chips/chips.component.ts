import { Component } from '@angular/core';

import { IChip } from '@shared/components/chip/chip.component';
import {
  IChipsComponent,
  ChipItem,
  ChipRemoveEvent,
} from '@shared/components/chips/chips.component';
import { IMessage } from '@shared/components/message/message.component';

import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [DemoPlaygroundComponent, DemoOptionDirective,
    IChip,
    IChipsComponent,
    IMessage,
  ],
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class ChipsComponent {
  // Code examples organized by category
  codeExamples = {
    basicChips: `<i-chip label="Action" />
<i-chip label="Comedy" />
<i-chip label="Mystery" />
<i-chip label="Thriller" [removable]="true" (onRemove)="onChipRemove($event)" />
<i-chip label="Apple" icon="pi pi-apple" />`,
    chipsContainer: `<i-chips
  [chips]="filterChips"
  [removable]="true"
  (removeChip)="onRemove($event)"
></i-chips>`,
    boxed: `<i-chips
  [chips]="selectedItems"
  [boxed]="true"
  [removable]="true"
  (removeChip)="onRemove($event)"
></i-chips>`,
    collapse: `<i-chips
  [chips]="selectedItems"
  [removable]="true"
  [collapseOnOverflow]="true"
  [overflowLabel]="selectedItems.length + ' items selected'"
  (removeChip)="onRemove($event)"
></i-chips>`,
    closeAll: `<i-chips
  [chips]="activeFilters"
  [removable]="true"
  [allowCloseAll]="true"
  (removeChip)="onRemove($event)"
  (closedAll)="onClearAll()"
></i-chips>`,
    disabled: `<i-chips
  [chips]="lockedTags"
  [disabled]="true"
></i-chips>`,
    combined: `<i-chips
  [chips]="selections"
  [boxed]="true"
  [removable]="true"
  [collapseOnOverflow]="true"
  [allowCloseAll]="true"
  [overflowLabel]="selections.length + ' selected'"
  (removeChip)="onRemove($event)"
  (closedAll)="onClearAll()"
></i-chips>`,
  };

  // Chip examples data (single i-chip)
  chipExamples = [
    { label: 'Action' },
    { label: 'Comedy' },
    { label: 'Mystery' },
    { label: 'Thriller', removable: true },
    { label: 'Apple', icon: 'pi pi-apple' },
  ];

  // Basic chips container
  basicChips: ChipItem[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'SCSS', value: 'scss' },
  ];

  // Boxed chips
  boxedChips: ChipItem[] = [
    { label: 'New York', value: 'ny' },
    { label: 'Los Angeles', value: 'la' },
    { label: 'Chicago', value: 'chicago' },
  ];

  // Collapsible chips (many items)
  collapsibleChips: ChipItem[] = [
    { label: 'Active', value: 'active' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'On Hold', value: 'on-hold' },
    { label: 'Archived', value: 'archived' },
    { label: 'Draft', value: 'draft' },
    { label: 'Pending Review', value: 'pending' },
  ];

  // Close all chips
  closeAllChips: ChipItem[] = [
    { label: 'Filter A', value: 'a' },
    { label: 'Filter B', value: 'b' },
    { label: 'Filter C', value: 'c' },
  ];

  // Disabled chips
  disabledChips: ChipItem[] = [
    { label: 'Read Only', value: 'readonly' },
    { label: 'Locked', value: 'locked' },
  ];

  // Combined features chips
  combinedChips: ChipItem[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
    { label: 'Option 4', value: '4' },
    { label: 'Option 5', value: '5' },
  ];

  onChipRemove(event: Event): void {
    console.log('Chip removed:', event);
  }

  onRemoveBasic(event: ChipRemoveEvent): void {
    this.basicChips = this.basicChips.filter(
      (c) => c.value !== event.chip.value,
    );
  }

  onRemoveBoxed(event: ChipRemoveEvent): void {
    this.boxedChips = this.boxedChips.filter(
      (c) => c.value !== event.chip.value,
    );
  }

  onRemoveCollapsible(event: ChipRemoveEvent): void {
    this.collapsibleChips = this.collapsibleChips.filter(
      (c) => c.value !== event.chip.value,
    );
  }

  onRemoveCloseAll(event: ChipRemoveEvent): void {
    this.closeAllChips = this.closeAllChips.filter(
      (c) => c.value !== event.chip.value,
    );
  }

  onClearCloseAll(): void {
    this.closeAllChips = [];
  }

  onRemoveCombined(event: ChipRemoveEvent): void {
    this.combinedChips = this.combinedChips.filter(
      (c) => c.value !== event.chip.value,
    );
  }

  onClearCombined(): void {
    this.combinedChips = [];
  }

  onResetAll(): void {
    this.basicChips = [
      { label: 'Angular', value: 'angular' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'SCSS', value: 'scss' },
    ];
    this.boxedChips = [
      { label: 'New York', value: 'ny' },
      { label: 'Los Angeles', value: 'la' },
      { label: 'Chicago', value: 'chicago' },
    ];
    this.collapsibleChips = [
      { label: 'Active', value: 'active' },
      { label: 'In Progress', value: 'in-progress' },
      { label: 'Completed', value: 'completed' },
      { label: 'On Hold', value: 'on-hold' },
      { label: 'Archived', value: 'archived' },
      { label: 'Draft', value: 'draft' },
      { label: 'Pending Review', value: 'pending' },
    ];
    this.closeAllChips = [
      { label: 'Filter A', value: 'a' },
      { label: 'Filter B', value: 'b' },
      { label: 'Filter C', value: 'c' },
    ];
    this.combinedChips = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
      { label: 'Option 4', value: '4' },
      { label: 'Option 5', value: '5' },
    ];
  }

  get collapsibleSummary(): string {
    return this.collapsibleChips.length
      ? `${this.collapsibleChips.length} filters selected`
      : 'No filters selected';
  }

  get combinedSummary(): string {
    return this.combinedChips.length
      ? `${this.combinedChips.length} selected`
      : 'None selected';
  }
}
