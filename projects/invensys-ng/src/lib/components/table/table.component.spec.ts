import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ITable, TableColumn, TableAction } from './table.component';

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
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
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
      expect(component.paginator).toBe(false);
      expect(component.rows).toBe(10);
      expect(component.selectionMode).toBeNull();
      expect(component.showActions).toBe(false);
      expect(component.striped).toBe(false);
      expect(component.hoverable).toBe(true);
      expect(component.bordered).toBe(false);
      expect(component.size).toBe('medium');
      expect(component.loading).toBe(false);
    });

    it('should accept data signal input', () => {
      const newData = [{ id: 10, name: 'New Product' }];
      fixture.componentRef.setInput('data', newData);
      fixture.detectChanges();
      expect(component.data()).toEqual(newData);
    });

    it('should accept columns signal input', () => {
      const newColumns: TableColumn[] = [{ field: 'test', header: 'Test' }];
      fixture.componentRef.setInput('columns', newColumns);
      fixture.detectChanges();
      expect(component.columns()).toEqual(newColumns);
    });
  });

  describe('Data Display', () => {
    it('should display all data when pagination is disabled', () => {
      expect(component.paginatedData().length).toBe(mockData.length);
    });

    it('should get cell value from row', () => {
      expect(component.getCellValue(mockData[0], 'name')).toBe('Product A');
    });

    it('should handle nested field paths', () => {
      const nestedData = { user: { profile: { name: 'John' } } };
      expect(component.getCellValue(nestedData, 'user.profile.name')).toBe('John');
    });

    it('should return empty string for null/undefined values', () => {
      expect(component.getCellValue(null, 'name')).toBe('');
      expect(component.getCellValue(undefined, 'name')).toBe('');
      expect(component.getCellValue({}, 'name')).toBe('');
    });
  });

  describe('Cell Formatting', () => {
    it('should format currency values', () => {
      const column: TableColumn = { field: 'price', header: 'Price', type: 'currency' };
      const formatted = component.formatCellValue(100, column);
      expect(formatted).toContain('$');
      expect(formatted).toContain('100');
    });

    it('should format boolean values', () => {
      const column: TableColumn = { field: 'active', header: 'Active', type: 'boolean' };
      expect(component.formatCellValue(true, column)).toBe('Yes');
      expect(component.formatCellValue(false, column)).toBe('No');
    });

    it('should format number values', () => {
      const column: TableColumn = { field: 'count', header: 'Count', type: 'number' };
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
      component.sortable = true;
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
      spyOn(component.onSort, 'emit');
      const column = mockColumns[0];
      component.onSortColumn(column);
      expect(component.onSort.emit).toHaveBeenCalledWith({
        field: 'id',
        order: 'asc',
      });
    });

    it('should not sort when sortable is false', () => {
      component.sortable = false;
      const column = mockColumns[0];
      component.onSortColumn(column);
      expect(component.sortField).toBe('');
    });

    it('should get correct sort icon', () => {
      const column = mockColumns[0];
      expect(component.getSortIcon(column)).toBe('pi pi-sort-alt');

      component.sortField = 'id';
      component.sortOrder = 'asc';
      expect(component.getSortIcon(column)).toBe('pi pi-sort-amount-up');

      component.sortOrder = 'desc';
      expect(component.getSortIcon(column)).toBe('pi pi-sort-amount-down');
    });
  });

  describe('Filtering', () => {
    it('should filter by global filter', (done) => {
      component.filterDelay = 0;
      component.onGlobalFilterInput('Product A');

      setTimeout(() => {
        fixture.detectChanges();
        expect(component.processedData().length).toBe(1);
        expect(component.processedData()[0].name).toBe('Product A');
        done();
      }, 10);
    });

    it('should filter by column filter', (done) => {
      component.filterDelay = 0;
      component.onColumnFilterInput('name', 'Product B');

      setTimeout(() => {
        fixture.detectChanges();
        expect(component.processedData().length).toBe(1);
        expect(component.processedData()[0].name).toBe('Product B');
        done();
      }, 10);
    });

    it('should emit onFilter event', (done) => {
      spyOn(component.onFilter, 'emit');
      component.filterDelay = 0;
      component.onGlobalFilterInput('test');

      setTimeout(() => {
        expect(component.onFilter.emit).toHaveBeenCalled();
        done();
      }, 10);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      component.paginator = true;
      component.rows = 2;
      component.first = 0;
      fixture.detectChanges();
    });

    it('should paginate data', () => {
      expect(component.paginatedData().length).toBe(2);
    });

    it('should calculate total records', () => {
      expect(component.totalRecordsCount).toBe(mockData.length);
    });

    it('should calculate page count', () => {
      expect(component.pageCount).toBe(3); // 5 items / 2 per page = 3 pages
    });

    it('should calculate current page', () => {
      expect(component.currentPage).toBe(0);
      component.first = 2;
      expect(component.currentPage).toBe(1);
    });

    it('should navigate to specific page', () => {
      component.goToPage(1);
      expect(component.first).toBe(2);
    });

    it('should navigate to first page', () => {
      component.first = 4;
      component.goToFirstPage();
      expect(component.first).toBe(0);
    });

    it('should navigate to last page', () => {
      component.goToLastPage();
      expect(component.currentPage).toBe(2);
    });

    it('should navigate to previous page', () => {
      component.first = 2;
      component.goToPreviousPage();
      expect(component.first).toBe(0);
    });

    it('should navigate to next page', () => {
      component.goToNextPage();
      expect(component.first).toBe(2);
    });

    it('should not navigate beyond bounds', () => {
      component.goToPreviousPage();
      expect(component.first).toBe(0);

      component.goToLastPage();
      const lastFirst = component.first;
      component.goToNextPage();
      expect(component.first).toBe(lastFirst);
    });

    it('should emit onPage event', () => {
      spyOn(component.onPage, 'emit');
      component.goToPage(1);
      expect(component.onPage.emit).toHaveBeenCalled();
    });

    it('should change rows per page', () => {
      spyOn(component.onPage, 'emit');
      component.onRowsPerPageChange(5);
      expect(component.rows).toBe(5);
      expect(component.first).toBe(0);
      expect(component.onPage.emit).toHaveBeenCalled();
    });

    it('should generate page numbers', () => {
      const pages = component.getPageNumbers();
      expect(pages).toEqual([0, 1, 2]);
    });
  });

  describe('Selection', () => {
    describe('Single Selection', () => {
      beforeEach(() => {
        component.selectionMode = 'single';
        component.selection = [];
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
        spyOn(component.onRowSelect, 'emit');
        spyOn(component.selectionChange, 'emit');
        spyOn(component.onSelectionChange, 'emit');

        component.toggleRowSelection(mockData[0]);

        expect(component.onRowSelect.emit).toHaveBeenCalledWith(mockData[0]);
        expect(component.selectionChange.emit).toHaveBeenCalled();
        expect(component.onSelectionChange.emit).toHaveBeenCalled();
      });
    });

    describe('Multiple Selection', () => {
      beforeEach(() => {
        component.selectionMode = 'multiple';
        component.selection = [];
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
        component.selection = [...mockData];
        component.toggleAllSelection();
        expect(component.selection.length).toBe(0);
      });

      it('should check if all rows selected', () => {
        expect(component.areAllRowsSelected()).toBe(false);
        component.selection = [...mockData];
        expect(component.areAllRowsSelected()).toBe(true);
      });

      it('should check if some rows selected', () => {
        expect(component.areSomeRowsSelected()).toBe(false);
        component.toggleRowSelection(mockData[0]);
        expect(component.areSomeRowsSelected()).toBe(true);
        component.selection = [...mockData];
        expect(component.areSomeRowsSelected()).toBe(false);
      });
    });
  });

  describe('Row Actions', () => {
    const mockActions: TableAction[] = [
      { id: 'edit', icon: 'pi pi-pencil', label: 'Edit' },
      { id: 'delete', icon: 'pi pi-trash', severity: 'danger' },
    ];

    beforeEach(() => {
      component.showActions = true;
      component.actions = mockActions;
    });

    it('should emit onAction event', () => {
      spyOn(component.onAction, 'emit');
      const mockEvent = new MouseEvent('click');

      component.onActionClick(mockActions[0], mockData[0], mockEvent);

      expect(component.onAction.emit).toHaveBeenCalledWith({
        action: 'edit',
        row: mockData[0],
      });
    });

    it('should check if action is disabled', () => {
      const disabledAction: TableAction = { id: 'test', disabled: true };
      expect(component.isActionDisabled(disabledAction, mockData[0])).toBe(true);
    });

    it('should evaluate function-based disabled', () => {
      const conditionalAction: TableAction = {
        id: 'test',
        disabled: (row) => row.id === 1,
      };
      expect(component.isActionDisabled(conditionalAction, mockData[0])).toBe(true);
      expect(component.isActionDisabled(conditionalAction, mockData[1])).toBe(false);
    });
  });

  describe('Row Expansion', () => {
    beforeEach(() => {
      component.rowExpandable = true;
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
      spyOn(component.onRowExpand, 'emit');
      spyOn(component.onRowCollapse, 'emit');
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
      component.striped = true;
      const classes = component.getTableClasses();
      expect(classes['i-table--striped']).toBe(true);
    });

    it('should include bordered class when enabled', () => {
      component.bordered = true;
      const classes = component.getTableClasses();
      expect(classes['i-table--bordered']).toBe(true);
    });

    it('should include loading class when loading', () => {
      component.loading = true;
      const classes = component.getTableClasses();
      expect(classes['i-table--loading']).toBe(true);
    });

    it('should include size class', () => {
      component.size = 'small';
      expect(component.getTableClasses()['i-table--small']).toBe(true);

      component.size = 'large';
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
