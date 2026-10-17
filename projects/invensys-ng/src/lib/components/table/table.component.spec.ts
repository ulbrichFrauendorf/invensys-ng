import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ITable, TableColumn, GridAction } from './table.component';

describe('ITable', () => {
  let component: ITable;
  let fixture: ComponentFixture<ITable>;

  const mockColumns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true, filterable: true },
    { field: 'price', header: 'Price', type: 'currency', sortable: true },
    { field: 'date', header: 'Date', type: 'date' },
  ];

  const mockData = [
    { id: 1, name: 'Product A', price: 100, date: '2024-01-15' },
    { id: 2, name: 'Product B', price: 200, date: '2024-02-20' },
    { id: 3, name: 'Product C', price: 150, date: '2024-03-10' },
    { id: 4, name: 'Product D', price: 300, date: '2024-04-05' },
    { id: 5, name: 'Product E', price: 250, date: '2024-05-25' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITable, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ITable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('grid', {
      rows: mockData,
      columns: mockColumns,
    });
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.emptyMessage).toBe('No data available');
      expect(component.sortable).toBe(false);
      expect(component.filterable).toBe(false);
      expect(component.globalFilter).toBe(false);

      expect(component.selectionMode).toBeNull();

      expect(component.striped).toBe(false);
      expect(component.hoverable).toBe(true);
      expect(component.bordered).toBe(false);
      expect(component.size).toBe('medium');
      expect(component.loading).toBe(false);
    });

    it('updates rows through the grid input', () => {
      const newData = [{ id: 10, name: 'New Product' }];
      fixture.componentRef.setInput('grid', {
        rows: newData,
        columns: mockColumns,
      });
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.gridRows()).toEqual(newData);
    });

    it('updates columns through the grid input', () => {
      const newColumns: TableColumn[] = [{ field: 'test', header: 'Test' }];
      fixture.componentRef.setInput('grid', {
        rows: mockData,
        columns: newColumns,
      });
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.gridColumns()).toEqual(newColumns);
    });
  });

  describe('Data Display', () => {
    it('provides every row for display', () => {
      expect(component.processedData().length).toBe(mockData.length);
    });

    it('should get cell value from row', () => {
      expect(component.getCellValue(mockData[0], 'name')).toBe('Product A');
    });

    it('should handle nested field paths', () => {
      const nestedData = { user: { profile: { name: 'John' } } };
      expect(component.getCellValue(nestedData, 'user.profile.name')).toBe(
        'John',
      );
    });

    it('should return empty string for null/undefined values', () => {
      expect(component.getCellValue(null, 'name')).toBe('');
      expect(component.getCellValue(undefined, 'name')).toBe('');
      expect(component.getCellValue({}, 'name')).toBe('');
    });
  });

  describe('Cell Formatting', () => {
    it('should format currency values', () => {
      const column: TableColumn = {
        field: 'price',
        header: 'Price',
        type: 'currency',
      };
      const formatted = component.formatCellValue(100, column);
      expect(formatted).toContain('$');
      expect(formatted).toContain('100');
    });

    it('should format boolean values', () => {
      const column: TableColumn = {
        field: 'active',
        header: 'Active',
        type: 'boolean',
      };
      expect(component.formatCellValue(true, column)).toBe('Yes');
      expect(component.formatCellValue(false, column)).toBe('No');
    });

    it('should format number values', () => {
      const column: TableColumn = {
        field: 'count',
        header: 'Count',
        type: 'number',
      };
      const formatted = component.formatCellValue(1000, column);
      expect(formatted).toBe('1,000');
    });

    it('should handle null/undefined values', () => {
      const column: TableColumn = { field: 'test', header: 'Test' };
      expect(component.formatCellValue(null, column)).toBe('');
      expect(component.formatCellValue(undefined, column)).toBe('');
    });
  });

  describe('Sorting', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('sortable', true);
    });

    it('should sort by column', () => {
      const column = mockColumns[0];
      component.onSortColumn(column);
      expect(component.sortField).toBe('id');
      expect(component.sortOrder).toBe('asc');
    });

    it('should toggle sort order on same column', () => {
      const column = mockColumns[0];
      component.onSortColumn(column);
      expect(component.sortOrder).toBe('asc');
      component.onSortColumn(column);
      expect(component.sortOrder).toBe('desc');
    });

    it('should emit onSort event', () => {
      vi.spyOn(component.onSort, 'emit').mockReturnValue(undefined);
      const column = mockColumns[0];
      component.onSortColumn(column);
      expect(component.onSort.emit).toHaveBeenCalledWith({
        field: 'id',
        order: 'asc',
      });
    });

    it('should not sort when sortable is false', () => {
      fixture.componentRef.setInput('sortable', false);
      const column = mockColumns[0];
      component.onSortColumn(column);
      expect(component.sortField).toBe('');
    });

    it('should get correct sort icon', () => {
      const column = mockColumns[0];
      expect(component.getSortIcon(column)).toBe('pi pi-sort-alt');

      fixture.componentRef.setInput('sortField', 'id');
      fixture.componentRef.setInput('sortOrder', 'asc');
      expect(component.getSortIcon(column)).toBe('pi pi-sort-amount-up');

      fixture.componentRef.setInput('sortOrder', 'desc');
      expect(component.getSortIcon(column)).toBe('pi pi-sort-amount-down');
    });
  });

  describe('Filtering', () => {
    it('should filter by global filter', async () => {
      vi.useFakeTimers();
      fixture.componentRef.setInput('filterDelay', 0);
      component.onGlobalFilterInput('Product A');

      await vi.advanceTimersByTimeAsync(10);

      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.processedData().length).toBe(1);
      expect(component.processedData()[0].name).toBe('Product A');
    });

    it('should filter by column filter', async () => {
      vi.useFakeTimers();
      fixture.componentRef.setInput('filterDelay', 0);
      component.onColumnFilterInput('name', 'Product B');

      await vi.advanceTimersByTimeAsync(10);

      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.processedData().length).toBe(1);
      expect(component.processedData()[0].name).toBe('Product B');
    });

    it('should emit onFilter event', async () => {
      vi.useFakeTimers();
      vi.spyOn(component.onFilter, 'emit').mockReturnValue(undefined);
      fixture.componentRef.setInput('filterDelay', 0);
      component.onGlobalFilterInput('test');

      await vi.advanceTimersByTimeAsync(10);

      expect(component.onFilter.emit).toHaveBeenCalled();
    });
  });

  describe('Grid data updates', () => {
    it('renders replacement rows and columns through the grid input', async () => {
      fixture.componentRef.setInput('grid', {
        columns: [{ field: 'name', header: 'Updated name' }],
        rows: [mockData[1]],
      });
      await fixture.whenStable();
      expect(
        fixture.nativeElement.querySelector('thead')?.textContent,
      ).toContain('Updated name');
      expect(
        fixture.nativeElement.querySelector('tbody')?.textContent,
      ).toContain('Product B');
      expect(
        fixture.nativeElement.querySelector('tbody')?.textContent,
      ).not.toContain('Product A');
    });
    it('sorts the rows without mutating the caller data', () => {
      fixture.componentRef.setInput('sortable', true);
      component.onSortColumn(mockColumns[2]);
      expect(component.processedData().map((row) => row.price)).toEqual([
        100, 150, 200, 250, 300,
      ]);
      expect(mockData.map((row) => row.price)).toEqual([
        100, 200, 150, 300, 250,
      ]);
    });
    it('renders the empty state when a replacement grid has no rows', async () => {
      fixture.componentRef.setInput('grid', { columns: mockColumns, rows: [] });
      await fixture.whenStable();
      expect(
        fixture.nativeElement.querySelector('i-no-content'),
      ).not.toBeNull();
    });
  });

  describe('Selection', () => {
    describe('Single Selection', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('selectionMode', 'single');
        fixture.componentRef.setInput('selection', []);
      });

      it('should select a row', () => {
        component.toggleRowSelection(mockData[0]);
        expect(component.selection).toEqual([mockData[0]]);
      });

      it('should deselect on second click', () => {
        component.toggleRowSelection(mockData[0]);
        component.toggleRowSelection(mockData[0]);
        expect(component.selection).toEqual([]);
      });

      it('should replace selection on different row', () => {
        component.toggleRowSelection(mockData[0]);
        component.toggleRowSelection(mockData[1]);
        expect(component.selection).toEqual([mockData[1]]);
      });

      it('should emit selection events', () => {
        vi.spyOn(component.onRowSelect, 'emit').mockReturnValue(undefined);
        vi.spyOn(component.selectionChange, 'emit').mockReturnValue(undefined);
        vi.spyOn(component.onSelectionChange, 'emit').mockReturnValue(
          undefined,
        );

        component.toggleRowSelection(mockData[0]);

        expect(component.onRowSelect.emit).toHaveBeenCalledWith(mockData[0]);
        expect(component.selectionChange.emit).toHaveBeenCalled();
        expect(component.onSelectionChange.emit).toHaveBeenCalled();
      });
    });

    describe('Multiple Selection', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('selectionMode', 'multiple');
        fixture.componentRef.setInput('selection', []);
      });

      it('should add to selection', () => {
        component.toggleRowSelection(mockData[0]);
        component.toggleRowSelection(mockData[1]);
        expect(component.selection.length).toBe(2);
      });

      it('should remove from selection', () => {
        component.toggleRowSelection(mockData[0]);
        component.toggleRowSelection(mockData[1]);
        component.toggleRowSelection(mockData[0]);
        expect(component.selection.length).toBe(1);
        expect(component.isRowSelected(mockData[1])).toBe(true);
      });

      it('should check if row is selected', () => {
        component.toggleRowSelection(mockData[0]);
        expect(component.isRowSelected(mockData[0])).toBe(true);
        expect(component.isRowSelected(mockData[1])).toBe(false);
      });

      it('should select all rows', () => {
        component.toggleAllSelection();
        expect(component.selection.length).toBe(mockData.length);
      });

      it('should deselect all when all selected', () => {
        fixture.componentRef.setInput('selection', [...mockData]);
        component.toggleAllSelection();
        expect(component.selection.length).toBe(0);
      });

      it('should check if all rows selected', () => {
        expect(component.areAllRowsSelected()).toBe(false);
        fixture.componentRef.setInput('selection', [...mockData]);
        expect(component.areAllRowsSelected()).toBe(true);
      });

      it('should check if some rows selected', () => {
        expect(component.areSomeRowsSelected()).toBe(false);
        component.toggleRowSelection(mockData[0]);
        expect(component.areSomeRowsSelected()).toBe(true);
        fixture.componentRef.setInput('selection', [...mockData]);
        expect(component.areSomeRowsSelected()).toBe(false);
      });
    });
  });

  describe('Row Actions', () => {
    const mockActions: GridAction[] = [
      { id: 'edit', icon: 'pi pi-pencil', label: 'Edit', handler: vi.fn() },
      {
        id: 'delete',
        icon: 'pi pi-trash',
        severity: 'danger',
        handler: vi.fn(),
      },
    ];

    beforeEach(() => {
      fixture.componentRef.setInput('grid', {
        rows: mockData,
        columns: mockColumns,
        actions: mockActions,
      });
    });

    it('calls the action handler with the row and stops row selection', () => {
      const event = new MouseEvent('click');
      const stop = vi.spyOn(event, 'stopPropagation');
      component.triggerAction(mockActions[0], mockData[0], event);
      expect(mockActions[0].handler).toHaveBeenCalledWith(mockData[0]);
      expect(stop).toHaveBeenCalledOnce();
    });

    it('should check if action is disabled', () => {
      const disabledAction: GridAction = {
        id: 'test',
        disabled: true,
        handler: vi.fn(),
      };
      expect(component.isActionDisabled(disabledAction, mockData[0])).toBe(
        true,
      );
    });

    it('should evaluate function-based disabled', () => {
      const conditionalAction: GridAction = {
        id: 'test',
        handler: vi.fn(),
        disabled: (row) => row.id === 1,
      };
      expect(component.isActionDisabled(conditionalAction, mockData[0])).toBe(
        true,
      );
      expect(component.isActionDisabled(conditionalAction, mockData[1])).toBe(
        false,
      );
    });
  });

  describe('Row Expansion', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('grid', {
        rows: mockData,
        columns: mockColumns,
        details: { columns: mockColumns, rows: () => [mockData[0]] },
      });
    });

    it('should expand row', () => {
      const mockEvent = new MouseEvent('click');
      component.toggleRowExpansion(mockData[0], mockEvent);
      expect(component.isRowExpanded(mockData[0])).toBe(true);
    });

    it('should collapse expanded row', () => {
      const mockEvent = new MouseEvent('click');
      component.toggleRowExpansion(mockData[0], mockEvent);
      component.toggleRowExpansion(mockData[0], mockEvent);
      expect(component.isRowExpanded(mockData[0])).toBe(false);
    });

    it('should emit expand/collapse events', () => {
      vi.spyOn(component.onRowExpand, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.onRowCollapse, 'emit').mockReturnValue(undefined);
      const mockEvent = new MouseEvent('click');

      component.toggleRowExpansion(mockData[0], mockEvent);
      expect(component.onRowExpand.emit).toHaveBeenCalledWith(mockData[0]);

      component.toggleRowExpansion(mockData[0], mockEvent);
      expect(component.onRowCollapse.emit).toHaveBeenCalledWith(mockData[0]);
    });
  });

  describe('CSS Classes', () => {
    it('should return correct table classes', () => {
      const classes = component.getTableClasses();
      expect(classes['i-table']).toBe(true);
      expect(classes['i-table--medium']).toBe(true);
      expect(classes['i-table--hoverable']).toBe(true);
    });

    it('should include striped class when enabled', () => {
      fixture.componentRef.setInput('striped', true);
      const classes = component.getTableClasses();
      expect(classes['i-table--striped']).toBe(true);
    });

    it('should include bordered class when enabled', () => {
      fixture.componentRef.setInput('bordered', true);
      const classes = component.getTableClasses();
      expect(classes['i-table--bordered']).toBe(true);
    });

    it('should include loading class when loading', () => {
      fixture.componentRef.setInput('loading', true);
      const classes = component.getTableClasses();
      expect(classes['i-table--loading']).toBe(true);
    });

    it('should include size class', () => {
      fixture.componentRef.setInput('size', 'small');
      expect(component.getTableClasses()['i-table--small']).toBe(true);

      fixture.componentRef.setInput('size', 'large');
      expect(component.getTableClasses()['i-table--large']).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-table-');
    });
  });

  describe('Track By Functions', () => {
    it('should track rows by id or index', () => {
      expect(component.trackByRow(0, mockData[0])).toBe(1);
      expect(component.trackByRow(0, {})).toBe(0);
    });

    it('should track columns by field', () => {
      expect(component.trackByColumn(0, mockColumns[0])).toBe('id');
    });
  });
});

afterEach(() => vi.useRealTimers());
