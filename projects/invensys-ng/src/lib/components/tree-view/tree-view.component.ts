import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { ICheckbox } from '../checkbox/checkbox.component';
import { IInputText } from '../input-text/input-text.component';

/**
 * Tree node data structure
 */
export interface ITreeNode {
  key?: string;
  label?: string;
  data?: any;
  icon?: string;
  expandedIcon?: string;
  collapsedIcon?: string;
  children?: ITreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: ITreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  loading?: boolean;
}

/**
 * Supported tree selection modes
 */
export type TreeSelectionMode = 'single' | 'multiple' | 'checkbox';

/**
 * Tree View Component
 *
 * A hierarchical tree component with support for single/multiple/checkbox selection modes.
 * Features filtering, expand/collapse functionality, and parent-child selection propagation.
 *
 * @example
 * ```html
 * <!-- Basic tree view -->
 * <i-tree-view
 *   [value]="treeData"
 *   selectionMode="single"
 *   [(selection)]="selectedNode">
 * </i-tree-view>
 *
 * <!-- Tree with checkbox selection -->
 * <i-tree-view
 *   [value]="treeData"
 *   selectionMode="checkbox"
 *   [(selection)]="selectedNodes"
 *   [propagateSelectionUp]="true"
 *   [propagateSelectionDown]="true">
 * </i-tree-view>
 *
 * <!-- Tree with filtering -->
 * <i-tree-view
 *   [value]="treeData"
 *   [filter]="true"
 *   filterBy="label"
 *   filterPlaceholder="Search tree..."
 *   [(selection)]="selectedNode">
 * </i-tree-view>
 *
 * <!-- Tree with select all (checkbox mode) -->
 * <i-tree-view
 *   [value]="treeData"
 *   selectionMode="checkbox"
 *   [selectAll]="true"
 *   [(selection)]="selectedNodes">
 * </i-tree-view>
 * ```
 *
 * @remarks
 * Supports three selection modes: single, multiple, and checkbox.
 * In checkbox mode, supports selection propagation to parent and child nodes.
 * Includes filtering capability to search through tree nodes.
 */
@Component({
  selector: 'i-tree-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ICheckbox, IInputText],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.scss',
})
export class ITreeView implements OnInit, OnChanges {
  /**
   * Array of tree nodes to display
   * @default []
   */
  @Input() value: ITreeNode[] = [];

  /**
   * Selection mode for the tree
   * @default 'single'
   */
  @Input() selectionMode: TreeSelectionMode = 'single';

  /**
   * Currently selected node(s)
   */
  @Input() selection: ITreeNode | ITreeNode[] | null = null;

  /**
   * Fixed scroll height for the tree container
   */
  @Input() scrollHeight?: string;

  /**
   * Whether the tree is in loading state
   * @default false
   */
  @Input() loading = false;

  /**
   * Message to display when tree is empty
   * @default 'No data found'
   */
  @Input() emptyMessage = 'No data found';

  /**
   * Custom template for the expand/collapse toggler
   */
  @Input() togglerTemplate?: string;

  /**
   * Enables filtering of tree nodes
   * @default false
   */
  @Input() filter = false;

  /**
   * Property name to use for filtering
   * @default 'label'
   */
  @Input() filterBy = 'label';

  /**
   * Filter matching mode
   * @default 'lenient'
   */
  @Input() filterMode = 'lenient';

  /**
   * Placeholder text for the filter input
   * @default 'Search'
   */
  @Input() filterPlaceholder = 'Search';

  /**
   * Filtered nodes array (for internal use)
   * @default []
   */
  @Input() filteredNodes: ITreeNode[] = [];

  /**
   * Validates drop operations (for drag and drop)
   * @default false
   */
  @Input() validateDrop = false;

  /**
   * Whether selecting a child node should propagate selection up to parents
   * @default true
   */
  @Input() propagateSelectionUp = true;

  /**
   * Whether selecting a parent node should propagate selection down to children
   * @default true
   */
  @Input() propagateSelectionDown = true;

  /**
   * Shows a "select all" checkbox for checkbox selection mode
   * @default false
   */
  @Input() selectAll = false;

  /**
   * Event emitted when a node is selected
   */
  @Output() onNodeSelect = new EventEmitter<{
    originalEvent: Event;
    node: ITreeNode;
  }>();

  /**
   * Event emitted when a node is unselected
   */
  @Output() onNodeUnselect = new EventEmitter<{
    originalEvent: Event;
    node: ITreeNode;
  }>();

  /**
   * Event emitted when a node is expanded
   */
  @Output() onNodeExpand = new EventEmitter<{
    originalEvent: Event;
    node: ITreeNode;
  }>();

  /**
   * Event emitted when a node is collapsed
   */
  @Output() onNodeCollapse = new EventEmitter<{
    originalEvent: Event;
    node: ITreeNode;
  }>();

  /**
   * Event emitted when selection changes
   */
  @Output() selectionChange = new EventEmitter<ITreeNode | ITreeNode[]>();

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-tree-view-');

  /**
   * Filtered tree nodes after applying search
   * @internal
   */
  filteredValue: ITreeNode[] = [];

  /**
   * Current filter/search value
   * @internal
   */
  filterValue = '';

  /**
   * State of the "select all" checkbox
   * @internal
   */
  selectAllChecked = false;

  /**
   * Set of temporarily highlighted nodes (for visual feedback)
   * @internal
   */
  private temporaryHighlighted = new Set<ITreeNode>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateSerializedValue();
    this.updateSelectAllState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.updateSerializedValue();
      this.updateSelectAllState();
    }
    if (changes['selection']) {
      this.updateSelectAllState();
    }
  }

  updateSerializedValue() {
    this.filteredValue = this.value || [];
    this.initializeParentReferences(this.filteredValue);
    if (this.filter && this.filterValue) {
      this.applyFilter();
    }
  }

  initializeParentReferences(nodes: ITreeNode[], parent?: ITreeNode) {
    if (!nodes) return;

    for (let node of nodes) {
      node.parent = parent;
      if (node.children) {
        this.initializeParentReferences(node.children, node);
      }
    }
  }

  onFilterKeyup(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterValue = target.value;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.filterValue.trim()) {
      this.filteredValue = this.value;
      return;
    }

    this.filteredValue = this.filterNodes(
      this.value,
      this.filterValue.toLowerCase()
    );
  }

  filterNodes(nodes: ITreeNode[], filterValue: string): ITreeNode[] {
    const filteredNodes: ITreeNode[] = [];

    for (let node of nodes) {
      const nodeMatches = this.isNodeMatch(node, filterValue);
      const filteredChildren = node.children
        ? this.filterNodes(node.children, filterValue)
        : [];

      if (nodeMatches || filteredChildren.length > 0) {
        const clonedNode = { ...node };
        if (filteredChildren.length > 0) {
          clonedNode.children = filteredChildren;
          clonedNode.expanded = true;
        }
        filteredNodes.push(clonedNode);
      }
    }

    return filteredNodes;
  }

  isNodeMatch(node: ITreeNode, filterValue: string): boolean {
    const nodeValue = (node.label || '').toLowerCase();
    return nodeValue.includes(filterValue);
  }

  isSelected(node: ITreeNode): boolean {
    if (this.selectionMode === 'single') {
      return this.selection === node;
    } else if (
      this.selectionMode === 'multiple' ||
      this.selectionMode === 'checkbox'
    ) {
      return Array.isArray(this.selection)
        ? this.selection.includes(node)
        : false;
    }
    return false;
  }

  isNodeHighlighted(node: ITreeNode): boolean {
    if (this.selectionMode === 'checkbox') {
      return this.temporaryHighlighted.has(node);
    }
    return this.isSelected(node);
  }

  isTemporarilyHighlighted(node: ITreeNode): boolean {
    return this.temporaryHighlighted.has(node);
  }

  private addTemporaryHighlight(node: ITreeNode) {
    this.temporaryHighlighted.add(node);
    setTimeout(() => {
      this.temporaryHighlighted.delete(node);
      this.cdr.detectChanges();
    }, 400);
  }

  isPartiallySelected(node: ITreeNode): boolean {
    if (this.selectionMode !== 'checkbox' || !node.children) {
      return false;
    }

    const selection = Array.isArray(this.selection) ? this.selection : [];
    const selectedChildren = node.children.filter((child) =>
      selection.includes(child)
    );
    const totalChildren = node.children.length;

    return (
      selectedChildren.length > 0 && selectedChildren.length < totalChildren
    );
  }

  onNodeClick(event: Event, node: ITreeNode) {
    if (node.selectable === false) {
      return;
    }

    if (this.selectionMode === 'checkbox') {
      return;
    }

    if (this.selectionMode === 'single') {
      this.selectSingleNode(event, node);
    } else if (this.selectionMode === 'multiple') {
      this.selectMultipleNode(event, node);
    }
  }

  selectSingleNode(event: Event, node: ITreeNode) {
    if (this.selection === node) {
      this.selection = null;
      this.onNodeUnselect.emit({ originalEvent: event, node });
    } else {
      this.selection = node;
      this.onNodeSelect.emit({ originalEvent: event, node });
    }
    this.selectionChange.emit(this.selection || undefined);
  }

  selectMultipleNode(event: Event, node: ITreeNode) {
    const selection = Array.isArray(this.selection) ? [...this.selection] : [];
    this.selection = selection;
    const index = selection.indexOf(node);

    if (index >= 0) {
      selection.splice(index, 1);
      this.onNodeUnselect.emit({ originalEvent: event, node });
    } else {
      selection.push(node);
      this.onNodeSelect.emit({ originalEvent: event, node });
    }
    this.selectionChange.emit(this.selection);
  }

  selectCheckboxNode(event: Event, node: ITreeNode) {
    const selection = Array.isArray(this.selection) ? [...this.selection] : [];
    const selected = this.isSelected(node);

    if (selected) {
      this.unselectNode(node, selection);
    } else {
      this.selectNode(node, selection);
    }

    if (this.propagateSelectionDown && node.children) {
      this.propagateDown(node, !selected, selection);
    }

    if (this.propagateSelectionUp && node.parent) {
      this.propagateUp(node.parent, selection);
    }

    this.selection = selection;
    this.selectionChange.emit(this.selection);
    this.updateSelectAllState();

    setTimeout(() => {
      if (selected) {
        this.onNodeUnselect.emit({ originalEvent: event, node });
      } else {
        this.onNodeSelect.emit({ originalEvent: event, node });
      }
    }, 0);
  }

  onCheckboxChange(checked: boolean, node: ITreeNode) {
    this.addTemporaryHighlight(node);

    const fakeEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    this.selectCheckboxNode(fakeEvent, node);
  }

  selectNode(node: ITreeNode, selection: ITreeNode[]) {
    if (!selection.includes(node)) {
      selection.push(node);
    }
  }

  unselectNode(node: ITreeNode, selection: ITreeNode[]) {
    const index = selection.indexOf(node);
    if (index >= 0) {
      selection.splice(index, 1);
    }
  }

  propagateDown(node: ITreeNode, select: boolean, selection: ITreeNode[]) {
    if (node.children) {
      for (let child of node.children) {
        if (select) {
          this.selectNode(child, selection);
        } else {
          this.unselectNode(child, selection);
        }

        if (child.children) {
          this.propagateDown(child, select, selection);
        }
      }
    }
  }

  propagateUp(node: ITreeNode, selection: ITreeNode[]) {
    if (node.children) {
      const selectedChildren = node.children.filter((child) =>
        selection.includes(child)
      );
      const totalChildren = node.children.length;

      if (selectedChildren.length === totalChildren) {
        this.selectNode(node, selection);
      } else if (selectedChildren.length > 0) {
        this.selectNode(node, selection);
      } else {
        this.unselectNode(node, selection);
      }

      if (node.parent) {
        this.propagateUp(node.parent, selection);
      }
    }
  }

  toggleNode(event: Event, node: ITreeNode) {
    if (node.expanded) {
      this.collapseNode(event, node);
    } else {
      this.expandNode(event, node);
    }
  }

  expandNode(event: Event, node: ITreeNode) {
    node.expanded = true;
    this.onNodeExpand.emit({ originalEvent: event, node });
  }

  collapseNode(event: Event, node: ITreeNode) {
    node.expanded = false;
    this.onNodeCollapse.emit({ originalEvent: event, node });
  }

  hasChildren(node: ITreeNode): boolean {
    return !!(node.children && node.children.length > 0);
  }

  getToggleIcon(node: ITreeNode): string {
    if (node.loading) {
      return 'pi pi-spin pi-spinner';
    }

    const expanded = node.expanded;

    if (node.expandedIcon && node.collapsedIcon) {
      return expanded ? node.expandedIcon : node.collapsedIcon;
    }

    return expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right';
  }

  getNodeIcon(node: ITreeNode): string {
    if (node.icon) {
      return node.icon;
    }

    if (this.hasChildren(node)) {
      return node.expanded ? 'pi pi-folder-open' : 'pi pi-folder';
    }

    return 'pi pi-file';
  }

  getCheckboxId(node: ITreeNode): string {
    const safeKey = (node.key || node.label || 'node')
      .replace(/[^a-zA-Z0-9\-_]/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
    return `${this.componentId}-checkbox-${safeKey}`;
  }

  // Select All functionality
  onSelectAllChange() {
    if (this.selectionMode !== 'checkbox') return;

    const allNodes = this.flattenNodes(this.filteredValue);
    const previousSelection = Array.isArray(this.selection)
      ? this.selection
      : [];

    const fakeEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    if (this.selectAllChecked) {
      this.selection = allNodes;

      allNodes.forEach((node) => {
        if (!previousSelection.includes(node)) {
          this.onNodeSelect.emit({ originalEvent: fakeEvent, node });
        }
      });
    } else {
      this.selection = [];

      previousSelection.forEach((node) => {
        this.onNodeUnselect.emit({ originalEvent: fakeEvent, node });
      });
    }

    this.selectionChange.emit(this.selection);
  }

  private flattenNodes(nodes: ITreeNode[]): ITreeNode[] {
    let result: ITreeNode[] = [];
    nodes.forEach((node) => {
      result.push(node);
      if (node.children) {
        result = result.concat(this.flattenNodes(node.children));
      }
    });
    return result;
  }

  updateSelectAllState() {
    if (this.selectionMode !== 'checkbox' || !this.selectAll) return;

    const allNodes = this.flattenNodes(this.filteredValue);
    const selectedNodes = Array.isArray(this.selection) ? this.selection : [];
    this.selectAllChecked =
      allNodes.length > 0 && selectedNodes.length === allNodes.length;
  }
}
