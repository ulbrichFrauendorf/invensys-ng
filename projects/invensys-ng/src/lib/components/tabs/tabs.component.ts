import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { ITabPanel } from './tab-panel.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Tabs Component
 *
 * A container component for tabbed navigation.
 * Supports icon-only, text-only, and combined icon + text tabs.
 *
 * @example
 * ```html
 * <!-- Text only tabs -->
 * <i-tabs [(activeIndex)]="activeTab">
 *   <i-tab-panel header="Home">Home content</i-tab-panel>
 *   <i-tab-panel header="Profile">Profile content</i-tab-panel>
 * </i-tabs>
 *
 * <!-- Icon only tabs -->
 * <i-tabs [(activeIndex)]="activeTab">
 *   <i-tab-panel icon="pi pi-home"></i-tab-panel>
 *   <i-tab-panel icon="pi pi-user"></i-tab-panel>
 * </i-tabs>
 *
 * <!-- Icon and text tabs -->
 * <i-tabs [(activeIndex)]="activeTab">
 *   <i-tab-panel header="Home" icon="pi pi-home">Home content</i-tab-panel>
 *   <i-tab-panel header="Profile" icon="pi pi-user">Profile content</i-tab-panel>
 * </i-tabs>
 * ```
 */
@Component({
  selector: 'i-tabs',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class ITabs implements AfterContentInit {
  /**
   * Index of the currently active tab
   * @default 0
   */
  @Input() activeIndex = 0;

  /**
   * Event emitted when the active tab index changes (for two-way binding)
   */
  @Output() activeIndexChange = new EventEmitter<number>();

  /**
   * Event emitted when a tab is selected
   */
  @Output() onChange = new EventEmitter<{
    originalEvent: Event;
    index: number;
  }>();

  /**
   * Event emitted when a tab is closed
   */
  @Output() onClose = new EventEmitter<{
    originalEvent: Event;
    index: number;
  }>();

  /**
   * Collection of tab panels
   * @internal
   */
  @ContentChildren(ITabPanel) tabPanels!: QueryList<ITabPanel>;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-tabs-');

  /**
   * Array of tabs for template iteration
   * @internal
   */
  tabs: ITabPanel[] = [];

  ngAfterContentInit(): void {
    this.tabs = this.tabPanels.toArray();
    this.tabPanels.changes.subscribe(() => {
      this.tabs = this.tabPanels.toArray();
    });
  }

  /**
   * Selects a tab by index
   * @param event - The click event
   * @param index - The index of the tab to select
   * @internal
   */
  selectTab(event: Event, index: number): void {
    const tab = this.tabs[index];
    if (tab && !tab.disabled) {
      this.activeIndex = index;
      this.activeIndexChange.emit(index);
      this.onChange.emit({ originalEvent: event, index });
    }
  }

  /**
   * Closes a tab by index
   * @param event - The click event
   * @param index - The index of the tab to close
   * @internal
   */
  closeTab(event: Event, index: number): void {
    event.stopPropagation();
    this.onClose.emit({ originalEvent: event, index });
  }

  /**
   * Handles keyboard navigation for accessibility
   * @param event - The keyboard event
   * @param index - The current tab index
   * @internal
   */
  onKeyDown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.navigateTabs(index, -1);
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.navigateTabs(index, 1);
        event.preventDefault();
        break;
      case 'Home':
        this.navigateToFirstTab();
        event.preventDefault();
        break;
      case 'End':
        this.navigateToLastTab();
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        this.selectTab(event, index);
        event.preventDefault();
        break;
    }
  }

  /**
   * Navigates to adjacent tabs
   * @param currentIndex - The current tab index
   * @param direction - The direction to navigate (-1 or 1)
   * @internal
   */
  private navigateTabs(currentIndex: number, direction: number): void {
    let nextIndex = currentIndex + direction;
    const tabsLength = this.tabs.length;

    while (nextIndex >= 0 && nextIndex < tabsLength) {
      if (!this.tabs[nextIndex].disabled) {
        this.focusTab(nextIndex);
        break;
      }
      nextIndex += direction;
    }
  }

  /**
   * Navigates to the first non-disabled tab
   * @internal
   */
  private navigateToFirstTab(): void {
    for (let i = 0; i < this.tabs.length; i++) {
      if (!this.tabs[i].disabled) {
        this.focusTab(i);
        break;
      }
    }
  }

  /**
   * Navigates to the last non-disabled tab
   * @internal
   */
  private navigateToLastTab(): void {
    for (let i = this.tabs.length - 1; i >= 0; i--) {
      if (!this.tabs[i].disabled) {
        this.focusTab(i);
        break;
      }
    }
  }

  /**
   * Focuses a tab by index
   * @param index - The index of the tab to focus
   * @internal
   */
  private focusTab(index: number): void {
    const tabElement = document.getElementById(
      `${this.componentId}-tab-${index}`
    );
    tabElement?.focus();
  }
}
