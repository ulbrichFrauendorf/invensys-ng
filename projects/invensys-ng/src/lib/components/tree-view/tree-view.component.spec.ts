import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ITreeView, ITreeNode } from './tree-view.component';

describe('ITreeView', () => {
  let component: ITreeView;
  let fixture: ComponentFixture<ITreeView>;

  const mockTreeData: ITreeNode[] = [
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITreeView, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ITreeView);
    component = fixture.componentInstance;

    // Use a deep clone of the mock data for each test to avoid shared mutable state
    const clonedData: any = JSON.parse(JSON.stringify(mockTreeData));
    component.value = clonedData;
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
      expect(component.filter).toBe(false);
      expect(component.propagateSelectionUp).toBe(true);
      expect(component.propagateSelectionDown).toBe(true);
      expect(component.selectAll).toBe(false);
    });

    it('should accept value input', () => {
      const newData: ITreeNode[] = [{ key: '3', label: 'Test Node' }];
      component.value = newData;
      fixture.detectChanges();
      expect(component.value).toEqual(newData);
    });

    it('should accept selectionMode input', () => {
      component.selectionMode = 'checkbox';
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
      spyOn(component.onNodeExpand, 'emit');

      component.expandNode(mockEvent, node);
      expect(component.onNodeExpand.emit).toHaveBeenCalledWith({
        originalEvent: mockEvent,
        node,
      });
    });
  });

  describe('Single selection mode', () => {
    beforeEach(() => {
      component.selectionMode = 'single';
    });

    it('should select a node', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');

      component.selectSingleNode(mockEvent, node);
      expect(component.selection).toBe(node);
    });

    it('should deselect a selected node', () => {
      const node = mockTreeData[0];
      component.selection = node;
      const mockEvent = new Event('click');

      component.selectSingleNode(mockEvent, node);
      expect(component.selection).toBeNull();
    });

    it('should emit selectionChange event', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');
      spyOn(component.selectionChange, 'emit');

      component.selectSingleNode(mockEvent, node);
      expect(component.selectionChange.emit).toHaveBeenCalled();
    });
  });

  describe('Multiple selection mode', () => {
    beforeEach(() => {
      component.selectionMode = 'multiple';
      component.selection = [];
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
      component.selection = [node];
      const mockEvent = new Event('click');

      component.selectMultipleNode(mockEvent, node);
      expect((component.selection as ITreeNode[]).length).toBe(0);
    });
  });

  describe('Checkbox selection mode', () => {
    beforeEach(() => {
      component.selectionMode = 'checkbox';
      component.selection = [];
    });

    it('should select node with checkbox', () => {
      const node = mockTreeData[0].children![0];
      const mockEvent = new Event('click');

      component.selectCheckboxNode(mockEvent, node);
      expect((component.selection as ITreeNode[]).includes(node)).toBe(true);
    });

    it('should propagate selection down to children', () => {
      component.propagateSelectionDown = true;
      const parentNode = mockTreeData[0];
      const mockEvent = new Event('click');

      component.selectCheckboxNode(mockEvent, parentNode);

      const selection = component.selection as ITreeNode[];
      expect(selection.includes(parentNode.children![0])).toBe(true);
      expect(selection.includes(parentNode.children![1])).toBe(true);
    });

    it('should propagate selection up to parent', () => {
      component.propagateSelectionUp = true;
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
      component.selection = [child1];

      expect(component.isPartiallySelected(parentNode)).toBe(true);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      component.filter = true;
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
      component.selectionMode = 'checkbox';
      component.selectAll = true;
    });

    it('should select all nodes', () => {
      component.selectAllChecked = true;
      component.onSelectAllChange();

      const allNodesCount = (component as any).flattenNodes(
        component.filteredValue
      ).length;
      expect((component.selection as ITreeNode[]).length).toBe(allNodesCount);
    });

    it('should deselect all nodes', () => {
      component.selection = (component as any).flattenNodes(
        component.filteredValue
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
      component.selectionMode = 'checkbox';
      const node = mockTreeData[0];
      const mockEvent = new Event('click');
      const initialSelection = component.selection;

      component.onNodeClick(mockEvent, node);
      expect(component.selection).toBe(initialSelection);
    });
  });

  describe('Checkbox change handling', () => {
    it('should handle checkbox change', (done) => {
      component.selectionMode = 'checkbox';
      component.selection = [];
      const node = mockTreeData[0].children![0];

      component.onCheckboxChange(true, node);

      setTimeout(() => {
        expect((component.selection as ITreeNode[]).includes(node)).toBe(true);
        done();
      }, 100);
    });
  });

  describe('Selection state', () => {
    it('should identify selected node in single mode', () => {
      component.selectionMode = 'single';
      const node = mockTreeData[0];
      component.selection = node;

      expect(component.isSelected(node)).toBe(true);
      expect(component.isSelected(mockTreeData[1])).toBe(false);
    });

    it('should identify selected nodes in multiple mode', () => {
      component.selectionMode = 'multiple';
      const node = mockTreeData[0];
      component.selection = [node];

      expect(component.isSelected(node)).toBe(true);
      expect(component.isSelected(mockTreeData[1])).toBe(false);
    });

    it('should identify selected nodes in checkbox mode', () => {
      component.selectionMode = 'checkbox';
      const node = mockTreeData[0];
      component.selection = [node];

      expect(component.isSelected(node)).toBe(true);
      expect(component.isSelected(mockTreeData[1])).toBe(false);
    });
  });

  describe('Node highlighting', () => {
    it('should highlight selected node in non-checkbox mode', () => {
      component.selectionMode = 'single';
      const node = mockTreeData[0];
      component.selection = node;

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

      component.value = nodes;
      component.ngOnInit();

      expect(nodes[0].children![0].parent).toBe(nodes[0]);
    });
  });

  describe('Filter keyup handling', () => {
    it('should update filter value on keyup', () => {
      component.filter = true;
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
      component.selectionMode = 'checkbox';
      component.selectAll = true;
      const allNodes = (component as any).flattenNodes(component.filteredValue);
      component.selection = allNodes;

      component.updateSelectAllState();
      expect(component.selectAllChecked).toBe(true);
    });

    it('should uncheck select all when not all selected', () => {
      component.selectionMode = 'checkbox';
      component.selectAll = true;
      component.selection = [mockTreeData[0]];

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

    it('should show loading icon when node is loading', () => {
      const node: ITreeNode = {
        key: '1',
        label: 'Test',
        loading: true,
      };

      expect(component.getToggleIcon(node)).toBe('pi pi-spin pi-spinner');
    });
  });

  describe('Event emissions', () => {
    it('should emit onNodeSelect event', (done) => {
      const node = mockTreeData[0].children![0];
      const mockEvent = new Event('click');

      component.onNodeSelect.subscribe((event) => {
        expect(event.node).toBe(node);
        expect(event.originalEvent).toBe(mockEvent);
        done();
      });

      component.selectCheckboxNode(mockEvent, node);
    });

    it('should emit onNodeUnselect event', (done) => {
      component.selectionMode = 'checkbox';
      const node = mockTreeData[0].children![0];
      component.selection = [node];
      const mockEvent = new Event('click');

      component.onNodeUnselect.subscribe((event) => {
        expect(event.node).toBe(node);
        done();
      });

      component.selectCheckboxNode(mockEvent, node);
    });

    it('should emit onNodeCollapse event', () => {
      const node = mockTreeData[0];
      node.expanded = true;
      const mockEvent = new Event('click');
      spyOn(component.onNodeCollapse, 'emit');

      component.collapseNode(mockEvent, node);
      expect(component.onNodeCollapse.emit).toHaveBeenCalledWith({
        originalEvent: mockEvent,
        node,
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty tree data', () => {
      component.value = [];
      component.ngOnInit();
      expect(component.filteredValue).toEqual([]);
    });

    it('should handle nodes without children', () => {
      const leafNode: ITreeNode = { key: '1', label: 'Leaf', leaf: true };
      expect(component.hasChildren(leafNode)).toBe(false);
    });

    it('should handle propagation without parent', () => {
      component.selectionMode = 'checkbox';
      const selection: ITreeNode[] = [];
      const node: ITreeNode = { key: '1', label: 'Test' };

      component.selectNode(node, selection);
      expect(selection.includes(node)).toBe(true);
    });
  });

  describe('Lifecycle hooks', () => {
    it('should initialize on ngOnInit', () => {
      spyOn(component, 'updateSerializedValue');
      spyOn(component, 'updateSelectAllState');

      component.ngOnInit();

      expect(component.updateSerializedValue).toHaveBeenCalled();
      expect(component.updateSelectAllState).toHaveBeenCalled();
    });

    it('should update on value changes', () => {
      spyOn(component, 'updateSerializedValue');
      spyOn(component, 'updateSelectAllState');

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
      spyOn(component, 'updateSelectAllState');

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
