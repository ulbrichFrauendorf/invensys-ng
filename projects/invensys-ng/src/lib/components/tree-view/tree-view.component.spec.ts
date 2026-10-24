import { firstValueFrom } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ITreeView, ITreeNode } from './tree-view.component';

describe('ITreeView', () => {
  let component: ITreeView;
  let fixture: ComponentFixture<ITreeView>;

  const createTreeData = (): ITreeNode[] => [
    {
      key: '1',
      label: 'Parent 1',
      children: [
        { key: '1-1', label: 'Child 1-1', leaf: true },
        { key: '1-2', label: 'Child 1-2', leaf: true },
      ],
    },
    {
      key: '2',
      label: 'Parent 2',
      children: [{ key: '2-1', label: 'Child 2-1', leaf: true }],
    },
  ];

  const mockTreeData = createTreeData();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITreeView, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ITreeView);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('value', createTreeData());
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.selectionMode).toBe('single');
      expect(component.loading).toBe(false);
      expect(component.emptyMessage).toBe('No data found');
      expect(component.filter).toBe(true);
      expect(component.propagateSelectionUp).toBe(true);
      expect(component.propagateSelectionDown).toBe(true);
      expect(component.selectAll).toBe(false);
    });

    it('should accept value input', () => {
      const newData: ITreeNode[] = [{ key: '3', label: 'Test Node' }];
      fixture.componentRef.setInput('value', newData);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.value).toEqual(newData);
    });

    it('should accept selectionMode input', () => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.selectionMode).toBe('checkbox');
    });
  });

  describe('Node expansion', () => {
    it('should expand a node', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');

      component.expandNode(mockEvent, node);
      expect(node.expanded).toBe(true);
    });

    it('should collapse a node', () => {
      const node = mockTreeData[0];
      node.expanded = true;
      const mockEvent = new Event('click');

      component.collapseNode(mockEvent, node);
      expect(node.expanded).toBe(false);
    });

    it('should toggle node expansion', () => {
      const node = component.value[0];
      const mockEvent = new Event('click');

      component.toggleNode(mockEvent, node);
      expect(node.expanded).toBe(true);

      component.toggleNode(mockEvent, node);
      expect(node.expanded).toBe(false);
    });

    it('should emit onNodeExpand event', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');
      vi.spyOn(component.onNodeExpand, 'emit').mockReturnValue(undefined);

      component.expandNode(mockEvent, node);
      expect(component.onNodeExpand.emit).toHaveBeenCalledWith({
        originalEvent: mockEvent,
        node,
      });
    });
  });

  describe('Single selection mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('selectionMode', 'single');
    });

    it('should select a node', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');

      component.selectSingleNode(mockEvent, node);
      expect(component.selection).toBe(node);
    });

    it('should deselect a selected node', () => {
      const node = mockTreeData[0];
      fixture.componentRef.setInput('selection', node);
      const mockEvent = new Event('click');

      component.selectSingleNode(mockEvent, node);
      expect(component.selection).toBeNull();
    });

    it('should emit selectionChange event', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');
      vi.spyOn(component.selectionChange, 'emit').mockReturnValue(undefined);

      component.selectSingleNode(mockEvent, node);
      expect(component.selectionChange.emit).toHaveBeenCalled();
    });
  });

  describe('Multiple selection mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('selectionMode', 'multiple');
      fixture.componentRef.setInput('selection', []);
    });

    it('should select multiple nodes', () => {
      const node1 = mockTreeData[0];
      const node2 = mockTreeData[1];
      const mockEvent = new Event('click');

      component.selectMultipleNode(mockEvent, node1);
      component.selectMultipleNode(mockEvent, node2);

      expect(Array.isArray(component.selection)).toBe(true);
      expect((component.selection as ITreeNode[]).length).toBe(2);
    });

    it('should deselect a selected node', () => {
      const node = mockTreeData[0];
      fixture.componentRef.setInput('selection', [node]);
      const mockEvent = new Event('click');

      component.selectMultipleNode(mockEvent, node);
      expect((component.selection as ITreeNode[]).length).toBe(0);
    });
  });

  describe('Checkbox selection mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      fixture.componentRef.setInput('selection', []);
    });

    it('should select node with checkbox', () => {
      const node = mockTreeData[0].children![0];
      const mockEvent = new Event('click');

      component.selectCheckboxNode(mockEvent, node);
      expect((component.selection as ITreeNode[]).includes(node)).toBe(true);
    });

    it('should propagate selection down to children', () => {
      fixture.componentRef.setInput('propagateSelectionDown', true);
      const parentNode = mockTreeData[0];
      const mockEvent = new Event('click');

      component.selectCheckboxNode(mockEvent, parentNode);

      const selection = component.selection as ITreeNode[];
      expect(selection.includes(parentNode.children![0])).toBe(true);
      expect(selection.includes(parentNode.children![1])).toBe(true);
    });

    it('should propagate selection up to parent', () => {
      fixture.componentRef.setInput('propagateSelectionUp', true);
      const childNode = component.value[0].children![0];
      const parentNode = component.value[0];
      const mockEvent = new Event('click');

      component.selectCheckboxNode(mockEvent, childNode);

      const selection = component.selection as ITreeNode[];
      expect(selection.includes(parentNode)).toBe(true);
    });

    it('should detect partial selection', () => {
      const parentNode = mockTreeData[0];
      const child1 = parentNode.children![0];
      fixture.componentRef.setInput('selection', [child1]);

      expect(component.isPartiallySelected(parentNode)).toBe(true);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('filter', true);
    });

    it('shows search by default and filters from the input control', async () => {
      await fixture.whenStable();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('i-input-text input');
      expect(input.getAttribute('aria-label')).toBe('Search tree');
      input.value = 'Child 1-1';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.filteredValue.length).toBe(1);
      expect(component.filteredValue[0].children?.length).toBe(1);
    });

    it('keeps the original selected node after clearing a search', () => {
      const original = component.value[0].children![0];
      component.filterValue = 'Child 1-1';
      component.applyFilter();
      const result = component.filteredValue[0].children![0];
      component.selectSingleNode(new MouseEvent('click'), result);
      expect(component.selection).toBe(original);
      expect(component.isSelected(result)).toBe(true);
      component.filterValue = '';
      component.applyFilter();
      expect(component.isSelected(original)).toBe(true);
    });

    it('propagates checkbox selections through the original hierarchy while searching', () => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      component.filterValue = 'Child 1-1';
      component.applyFilter();
      component.selectCheckboxNode(
        new MouseEvent('click'),
        component.filteredValue[0].children![0],
      );
      expect(component.selection).toContain(component.value[0].children![0]);
      expect(component.selection).toContain(component.value[0]);
      expect(component.isPartiallySelected(component.filteredValue[0])).toBe(true);
    });

    it('keeps hidden selections when select all is toggled in search results', () => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      fixture.componentRef.setInput('selectAll', true);
      const hidden = component.value[1].children![0];
      fixture.componentRef.setInput('selection', [hidden]);
      component.filterValue = 'Child 1-1';
      component.applyFilter();
      component.selectAllChecked = true;
      component.onSelectAllChange();
      expect(component.selection).toContain(hidden);
      expect(component.selection).toContain(component.value[0].children![0]);
      component.selectAllChecked = false;
      component.onSelectAllChange();
      expect(component.selection).toEqual([hidden]);
    });

    it('should filter nodes by label', () => {
      component.filterValue = 'Child 1-1';
      component.applyFilter();

      expect(component.filteredValue.length).toBeGreaterThan(0);
    });

    it('should show all nodes when filter is empty', () => {
      component.filterValue = '';
      component.applyFilter();

      expect(component.filteredValue.length).toBe(mockTreeData.length);
    });

    it('should expand parent nodes when children match filter', () => {
      component.filterValue = 'Child 1-1';
      component.applyFilter();

      const filteredParent = component.filteredValue[0];
      expect(filteredParent.expanded).toBe(true);
    });
  });

  describe('Helper methods', () => {
    it('should detect if node has children', () => {
      const parentNode = mockTreeData[0];
      const leafNode = mockTreeData[0].children![0];

      expect(component.hasChildren(parentNode)).toBe(true);
      expect(component.hasChildren(leafNode)).toBe(false);
    });

    it('should get toggle icon based on expansion state', () => {
      const node = mockTreeData[0];
      node.expanded = false;

      expect(component.getToggleIcon(node)).toBe('pi pi-chevron-right');

      node.expanded = true;
      expect(component.getToggleIcon(node)).toBe('pi pi-chevron-down');
    });

    it('should get node icon based on node type', () => {
      const parentNode = mockTreeData[0];
      const leafNode = mockTreeData[0].children![0];

      expect(component.getNodeIcon(parentNode)).toContain('pi-folder');
      expect(component.getNodeIcon(leafNode)).toBe('pi pi-file');
    });
  });

  describe('Select All functionality', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      fixture.componentRef.setInput('selectAll', true);
    });

    it('should select all nodes', () => {
      component.selectAllChecked = true;
      component.onSelectAllChange();

      const allNodesCount = (component as any).flattenNodes(component.filteredValue).length;
      expect((component.selection as ITreeNode[]).length).toBe(allNodesCount);
    });

    it('should deselect all nodes', () => {
      fixture.componentRef.setInput(
        'selection',
        (component as any).flattenNodes(component.filteredValue),
      );
      component.selectAllChecked = false;
      component.onSelectAllChange();

      expect((component.selection as ITreeNode[]).length).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-tree-view-');
    });

    it('should generate safe checkbox ids', () => {
      const node = mockTreeData[0];
      const id = component.getCheckboxId(node);
      expect(id).toMatch(/^i-tree-view-.*-checkbox-/);
    });
  });

  describe('Node click handling', () => {
    it('should not select node if selectable is false', () => {
      const node: ITreeNode = { key: 'test', label: 'Test', selectable: false };
      const mockEvent = new Event('click');
      const initialSelection = component.selection;

      component.onNodeClick(mockEvent, node);
      expect(component.selection).toBe(initialSelection);
    });

    it('should not handle click in checkbox mode', () => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      const node = mockTreeData[0];
      const mockEvent = new Event('click');
      const initialSelection = component.selection;

      component.onNodeClick(mockEvent, node);
      expect(component.selection).toBe(initialSelection);
    });
  });

  describe('Checkbox change handling', () => {
    it('should handle checkbox change', async () => {
      vi.useFakeTimers();
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      fixture.componentRef.setInput('selection', []);
      const node = mockTreeData[0].children![0];

      component.onCheckboxChange(true, node);

      await vi.advanceTimersByTimeAsync(100);

      expect((component.selection as ITreeNode[]).includes(node)).toBe(true);
    });
  });

  describe('Selection state', () => {
    it('should identify selected node in single mode', () => {
      fixture.componentRef.setInput('selectionMode', 'single');
      const node = mockTreeData[0];
      fixture.componentRef.setInput('selection', node);

      expect(component.isSelected(node)).toBe(true);
      expect(component.isSelected(mockTreeData[1])).toBe(false);
    });

    it('should identify selected nodes in multiple mode', () => {
      fixture.componentRef.setInput('selectionMode', 'multiple');
      const node = mockTreeData[0];
      fixture.componentRef.setInput('selection', [node]);

      expect(component.isSelected(node)).toBe(true);
      expect(component.isSelected(mockTreeData[1])).toBe(false);
    });

    it('should identify selected nodes in checkbox mode', () => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      const node = mockTreeData[0];
      fixture.componentRef.setInput('selection', [node]);

      expect(component.isSelected(node)).toBe(true);
      expect(component.isSelected(mockTreeData[1])).toBe(false);
    });
  });

  describe('Node highlighting', () => {
    it('should highlight selected node in non-checkbox mode', () => {
      fixture.componentRef.setInput('selectionMode', 'single');
      const node = mockTreeData[0];
      fixture.componentRef.setInput('selection', node);

      expect(component.isNodeHighlighted(node)).toBe(true);
    });
  });

  describe('Parent references', () => {
    it('should initialize parent references', () => {
      const nodes: ITreeNode[] = [
        {
          key: '1',
          label: 'Parent',
          children: [{ key: '1-1', label: 'Child' }],
        },
      ];

      fixture.componentRef.setInput('value', nodes);
      component.ngOnInit();

      expect(nodes[0].children![0].parent).toBe(nodes[0]);
    });
  });

  describe('Filter keyup handling', () => {
    it('should update filter value on keyup', () => {
      fixture.componentRef.setInput('filter', true);
      const mockEvent = {
        target: { value: 'test filter' },
      } as any;

      component.onFilterKeyup(mockEvent);
      expect(component.filterValue).toBe('test filter');
    });
  });

  describe('Node matching', () => {
    it('should match node by label', () => {
      const node: ITreeNode = { key: '1', label: 'Test Node' };
      expect(component.isNodeMatch(node, 'test')).toBe(true);
      expect(component.isNodeMatch(node, 'xyz')).toBe(false);
    });

    it('should handle node without label', () => {
      const node: ITreeNode = { key: '1' };
      expect(component.isNodeMatch(node, 'test')).toBe(false);
    });
  });

  describe('Select all state update', () => {
    it('should update select all checked state', () => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      fixture.componentRef.setInput('selectAll', true);
      const allNodes = (component as any).flattenNodes(component.filteredValue);
      fixture.componentRef.setInput('selection', allNodes);

      component.updateSelectAllState();
      expect(component.selectAllChecked).toBe(true);
    });

    it('should uncheck select all when not all selected', () => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      fixture.componentRef.setInput('selectAll', true);
      fixture.componentRef.setInput('selection', [mockTreeData[0]]);

      component.updateSelectAllState();
      expect(component.selectAllChecked).toBe(false);
    });
  });

  describe('Custom icons', () => {
    it('should use custom expanded and collapsed icons', () => {
      const node: ITreeNode = {
        key: '1',
        label: 'Test',
        expandedIcon: 'pi pi-minus',
        collapsedIcon: 'pi pi-plus',
      };

      node.expanded = false;
      expect(component.getToggleIcon(node)).toBe('pi pi-plus');

      node.expanded = true;
      expect(component.getToggleIcon(node)).toBe('pi pi-minus');
    });

    it('should use custom node icon', () => {
      const node: ITreeNode = {
        key: '1',
        label: 'Test',
        icon: 'pi pi-star',
      };

      expect(component.getNodeIcon(node)).toBe('pi pi-star');
    });

    it('keeps node loading out of the legacy spinner icon', () => {
      const node: ITreeNode = {
        key: '1',
        label: 'Test',
        loading: true,
      };

      expect(component.getToggleIcon(node)).toBe('pi pi-chevron-right');
    });
  });

  describe('Event emissions', () => {
    it('should emit onNodeSelect event', async () => {
      const node = mockTreeData[0].children![0];
      const mockEvent = new Event('click');

      const emittedValue = firstValueFrom(component.onNodeSelect);

      component.selectCheckboxNode(mockEvent, node);

      const event = await emittedValue;

      expect(event.node).toBe(node);
      expect(event.originalEvent).toBe(mockEvent);
    });

    it('should emit onNodeUnselect event', async () => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      const node = mockTreeData[0].children![0];
      fixture.componentRef.setInput('selection', [node]);
      const mockEvent = new Event('click');

      const emittedValue = firstValueFrom(component.onNodeUnselect);

      component.selectCheckboxNode(mockEvent, node);

      const event = await emittedValue;

      expect(event.node).toBe(node);
    });

    it('should emit onNodeCollapse event', () => {
      const node = mockTreeData[0];
      node.expanded = true;
      const mockEvent = new Event('click');
      vi.spyOn(component.onNodeCollapse, 'emit').mockReturnValue(undefined);

      component.collapseNode(mockEvent, node);
      expect(component.onNodeCollapse.emit).toHaveBeenCalledWith({
        originalEvent: mockEvent,
        node,
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty tree data', () => {
      fixture.componentRef.setInput('value', []);
      component.ngOnInit();
      expect(component.filteredValue).toEqual([]);
    });

    it('should handle nodes without children', () => {
      const leafNode: ITreeNode = { key: '1', label: 'Leaf', leaf: true };
      expect(component.hasChildren(leafNode)).toBe(false);
    });

    it('should handle propagation without parent', () => {
      fixture.componentRef.setInput('selectionMode', 'checkbox');
      const selection: ITreeNode[] = [];
      const node: ITreeNode = { key: '1', label: 'Test' };

      component.selectNode(node, selection);
      expect(selection.includes(node)).toBe(true);
    });
  });

  describe('Lifecycle hooks', () => {
    it('should initialize on ngOnInit', () => {
      vi.spyOn(component, 'updateSerializedValue').mockReturnValue(undefined);
      vi.spyOn(component, 'updateSelectAllState').mockReturnValue(undefined);

      component.ngOnInit();

      expect(component.updateSerializedValue).toHaveBeenCalled();
      expect(component.updateSelectAllState).toHaveBeenCalled();
    });

    it('should update on value changes', () => {
      vi.spyOn(component, 'updateSerializedValue').mockReturnValue(undefined);
      vi.spyOn(component, 'updateSelectAllState').mockReturnValue(undefined);

      component.ngOnChanges({
        value: {
          previousValue: [],
          currentValue: mockTreeData,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.updateSerializedValue).toHaveBeenCalled();
      expect(component.updateSelectAllState).toHaveBeenCalled();
    });

    it('should update on selection changes', () => {
      vi.spyOn(component, 'updateSelectAllState').mockReturnValue(undefined);

      component.ngOnChanges({
        selection: {
          previousValue: null,
          currentValue: [mockTreeData[0]],
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.updateSelectAllState).toHaveBeenCalled();
    });
  });
});

afterEach(() => vi.useRealTimers());
