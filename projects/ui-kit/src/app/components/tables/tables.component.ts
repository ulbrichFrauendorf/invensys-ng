import { Component } from '@angular/core';

import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import {
  FilterEvent,
  GridAction,
  GridData,
  ITable,
  SortEvent,
  TableColumn,
  TableDownloadEvent,
} from '@shared/components/table/table.component';
import { IWhisper } from '../../../../../invensys-ng/src/lib/components/whisper/whisper.component';
import { WhisperService } from '../../../../../invensys-ng/src/lib/components/whisper/services/whisper.service';

// ─── Domain types ──────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  statusIcon: string;
  statusSeverity: string;
  date: string;
  tags: string[];
}

interface CategorySummary {
  category: string;
  itemCount: number;
  totalValue: number;
  avgPrice: number;
  inventoryStatus: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [ITable, DemoCardComponent, FeaturesListComponent, IWhisper],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {
  constructor(private whisperService: WhisperService) {}

  // ── Raw data ──────────────────────────────────────────────────────────────

  readonly products: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro',
      category: 'Electronics',
      price: 1299.99,
      quantity: 50,
      status: 'In Stock',
      statusIcon: 'pi pi-check-circle',
      statusSeverity: 'success',
      date: '2024-01-15',
      tags: ['featured', 'sale'],
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      category: 'Accessories',
      price: 29.99,
      quantity: 200,
      status: 'In Stock',
      statusIcon: 'pi pi-check-circle',
      statusSeverity: 'success',
      date: '2024-02-20',
      tags: ['popular'],
    },
    {
      id: 3,
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      price: 149.99,
      quantity: 75,
      status: 'Low Stock',
      statusIcon: 'pi pi-exclamation-circle',
      statusSeverity: 'warn',
      date: '2024-03-10',
      tags: ['popular', 'sale'],
    },
    {
      id: 4,
      name: 'Monitor 27"',
      category: 'Electronics',
      price: 399.99,
      quantity: 30,
      status: 'In Stock',
      statusIcon: 'pi pi-check-circle',
      statusSeverity: 'success',
      date: '2024-04-05',
      tags: ['featured'],
    },
    {
      id: 5,
      name: 'USB Hub',
      category: 'Accessories',
      price: 24.99,
      quantity: 150,
      status: 'In Stock',
      statusIcon: 'pi pi-check-circle',
      statusSeverity: 'success',
      date: '2024-05-25',
      tags: [],
    },
    {
      id: 6,
      name: 'Webcam HD',
      category: 'Electronics',
      price: 79.99,
      quantity: 0,
      status: 'Out of Stock',
      statusIcon: 'pi pi-times-circle',
      statusSeverity: 'danger',
      date: '2024-06-12',
      tags: [],
    },
    {
      id: 7,
      name: 'Headphones',
      category: 'Audio',
      price: 199.99,
      quantity: 45,
      status: 'In Stock',
      statusIcon: 'pi pi-check-circle',
      statusSeverity: 'success',
      date: '2024-07-18',
      tags: ['featured'],
    },
    {
      id: 8,
      name: 'External SSD',
      category: 'Storage',
      price: 89.99,
      quantity: 100,
      status: 'In Stock',
      statusIcon: 'pi pi-check-circle',
      statusSeverity: 'success',
      date: '2024-08-22',
      tags: ['sale'],
    },
    {
      id: 9,
      name: 'Gaming Chair',
      category: 'Furniture',
      price: 249.99,
      quantity: 20,
      status: 'Low Stock',
      statusIcon: 'pi pi-exclamation-circle',
      statusSeverity: 'warn',
      date: '2024-09-14',
      tags: [],
    },
    {
      id: 10,
      name: 'Standing Desk',
      category: 'Furniture',
      price: 599.99,
      quantity: 0,
      status: 'Out of Stock',
      statusIcon: 'pi pi-times-circle',
      statusSeverity: 'danger',
      date: '2024-10-30',
      tags: [],
    },
  ];

  // ── Column sets ───────────────────────────────────────────────────────────

  readonly baseColumns: TableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true },
    { field: 'category', header: 'Category', sortable: true, filterable: true },
    { field: 'price', header: 'Price', sortable: true, type: 'currency' },
    { field: 'quantity', header: 'Qty', sortable: true, type: 'number' },
    { field: 'status', header: 'Status', sortable: true, filterable: true },
    {
      field: 'date',
      header: 'Date',
      sortable: true,
      type: 'date',
      format: 'yyyy-MM-dd',
    },
  ];

  readonly categoryColumns: TableColumn[] = [
    { field: 'category', header: 'Category', sortable: true },
    {
      field: 'totalValue',
      header: 'Total Value',
      sortable: true,
      type: 'currency',
    },
    {
      field: 'avgPrice',
      header: 'Avg Price',
      sortable: true,
      type: 'currency',
    },
    { field: 'inventoryStatus', header: 'Status', sortable: true },
  ];

  readonly iconColumns: TableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'category', header: 'Category', sortable: true },
    {
      field: 'statusIcon',
      header: 'Status',
      type: 'icon',
      iconClass: 'statusIcon',
      severity: 'statusSeverity',
    },
    { field: 'price', header: 'Price', type: 'currency' },
    { field: 'tags', header: 'Tags', type: 'list' },
  ];

  // ── Category summary rows ─────────────────────────────────────────────────

  private buildCategories(): CategorySummary[] {
    const map = new Map<string, Product[]>();
    this.products.forEach((p) => {
      const group = map.get(p.category) ?? [];
      group.push(p);
      map.set(p.category, group);
    });
    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      itemCount: items.length,
      totalValue: items.reduce((s, p) => s + p.price * p.quantity, 0),
      avgPrice: items.reduce((s, p) => s + p.price, 0) / items.length,
      inventoryStatus: items.every((p) => p.quantity === 0)
        ? 'Out of Stock'
        : items.some((p) => p.quantity === 0)
          ? 'Mixed'
          : 'Available',
    }));
  }

  // ── Per-row action factories ──────────────────────────────────────────────

  private productActions(): GridAction<Product>[] {
    return [
      {
        id: 'edit',
        icon: 'pi pi-pencil',
        severity: 'secondary',
        tooltip: 'Edit product',
        handler: (p) =>
          this.whisperService.add({
            severity: 'info',
            summary: 'Edit',
            detail: p.name,
            key: 'global',
            life: 3000,
          }),
      },
      {
        id: 'delete',
        icon: 'pi pi-trash',
        severity: 'danger',
        tooltip: 'Delete product',
        disabled: (p) => p.quantity === 0,
        handler: (p) =>
          this.whisperService.add({
            severity: 'danger',
            summary: 'Delete',
            detail: p.name,
            key: 'global',
            life: 3000,
          }),
      },
    ];
  }

  // ── GridData objects: one per demo card ──────────────────────────────────

  /** 1 — Sorting & filtering */
  flatGrid: GridData<Product> = {
    columns: this.baseColumns,
    rows: this.products,
  };

  /** 2 — Selection & actions */
  actionsGrid: GridData<Product> = {
    columns: this.baseColumns,
    rows: this.products,
    actions: this.productActions(),
  };

  /** 3 — Expandable detail sub-table */
  detailGrid: GridData<CategorySummary, Product> = {
    columns: this.categoryColumns,
    rows: this.buildCategories(),
    actions: [
      {
        id: 'summarise',
        icon: 'pi pi-eye',
        severity: 'info',
        tooltip: 'View category',
        handler: (cat) =>
          this.whisperService.add({
            severity: 'info',
            summary: cat.category,
            detail: `${cat.itemCount} items`,
            key: 'global',
            life: 3000,
          }),
      },
    ],
    details: {
      columns: this.baseColumns,
      rows: (cat) => this.products.filter((p) => p.category === cat.category),
      actions: this.productActions(),
    },
  };

  /** 4 — Icon & chip columns */
  iconGrid: GridData<Product> = {
    columns: this.iconColumns,
    rows: this.products,
  };

  /** 5 — Large dataset (virtual scroll + download) */
  largeGrid: GridData<Product> = {
    columns: this.baseColumns,
    rows: this.generateLargeDataset(10_000),
  };

  // ── Selection state ───────────────────────────────────────────────────────

  selectedProducts: Product[] = [];

  // ── Event handlers ────────────────────────────────────────────────────────

  onSort(event: SortEvent): void {
    this.whisperService.add({
      severity: 'info',
      summary: 'Sort',
      detail: `${event.field} ${event.order}`,
      key: 'global',
      life: 2000,
    });
  }

  onFilter(event: FilterEvent): void {
    console.log('Filter changed', event);
  }

  onSelectionChange(selection: Product[]): void {
    this.selectedProducts = selection;
  }

  onDownload(event: TableDownloadEvent): void {
    this.whisperService.add({
      severity: 'success',
      summary: 'Download',
      detail: `${event.format.toUpperCase()} — ${event.data.length} rows`,
      key: 'global',
      life: 3000,
    });
  }

  // ── Features list ─────────────────────────────────────────────────────────

  features: Feature[] = [
    {
      title: 'Single input',
      description:
        '[grid] bundles columns, rows, actions, and optional detail sub-table',
    },
    {
      title: 'Virtual scroll',
      description:
        'Opt-in CDK virtual scroll via [virtualScroll]="true"; recommended for ≥ 500 rows',
    },
    {
      title: 'Detail sub-tables',
      description:
        'GridData.details replaces grouped mode; each row expands to a nested <i-table>',
    },
    {
      title: 'Embedded handlers',
      description: 'Per-action handler(row) — no shared dispatcher needed',
    },
    {
      title: 'Selection',
      description:
        'Single or multiple-row selection with dataKey deduplication',
    },
    {
      title: 'Filtering',
      description:
        'Global search bar and per-column filter inputs with debounce',
    },
    {
      title: 'Download',
      description: 'Client-side CSV / JSON / Excel export of filtered data',
    },
    {
      title: 'Column types',
      description: 'Text, number, currency, date, boolean, icon, list (chips)',
    },
    {
      title: 'Resize & sticky',
      description:
        'Draggable column resize handles; sticky headers outside scroll viewport',
    },
    {
      title: 'OnPush + signals',
      description:
        'ChangeDetectionStrategy.OnPush with Angular signal-based state',
    },
  ];

  // ── Code snippets ─────────────────────────────────────────────────────────

  codeExamples = {
    flat: `<i-table
  [grid]="flatGrid"
  [sortable]="true"
  [filterable]="true"
  [globalFilter]="true"
  [height]="'360px'"
  [striped]="true"
  (onSort)="onSort($event)"
  (onFilter)="onFilter($event)"
></i-table>`,

    actions: `<i-table
  [grid]="actionsGrid"
  selectionMode="multiple"
  dataKey="id"
  [(selection)]="selectedProducts"
  [hoverable]="true"
  [height]="'360px'"
  (onSelectionChange)="onSelectionChange($event)"
></i-table>`,

    detail: `<i-table
  [grid]="detailGrid"
  [sortable]="true"
  [striped]="true"
  [height]="'420px'"
></i-table>`,

    icons: `<i-table
  [grid]="iconGrid"
  [sortable]="true"
  [height]="'360px'"
  [hoverable]="true"
></i-table>`,

    large: `<i-table
  [grid]="largeGrid"
  [sortable]="true"
  [globalFilter]="true"
  [downloadable]="true"
  [virtualScroll]="true"
  downloadFormat="csv"
  [height]="'400px'"
  (onDownload)="onDownload($event)"
></i-table>`,
  };

  tsCodeExamples = {
    flat: `interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  date: string;
}

readonly baseColumns: TableColumn[] = [
  { field: 'name',     header: 'Name',     sortable: true, filterable: true },
  { field: 'category', header: 'Category', sortable: true, filterable: true },
  { field: 'price',    header: 'Price',    sortable: true, type: 'currency' },
  { field: 'quantity', header: 'Qty',      sortable: true, type: 'number'   },
  { field: 'status',   header: 'Status',   sortable: true, filterable: true },
  { field: 'date',     header: 'Date',     sortable: true, type: 'date', format: 'yyyy-MM-dd' },
];

flatGrid: GridData<Product> = {
  columns: this.baseColumns,
  rows: this.products,
};`,

    actions: `private productActions(): GridAction<Product>[] {
  return [
    {
      id: 'edit',
      icon: 'pi pi-pencil',
      severity: 'secondary',
      tooltip: 'Edit product',
      handler: (p) => this.whisperService.add({
        severity: 'info', summary: 'Edit', detail: p.name,
      }),
    },
    {
      id: 'delete',
      icon: 'pi pi-trash',
      severity: 'danger',
      tooltip: 'Delete product',
      disabled: (p) => p.quantity === 0,
      handler: (p) => this.whisperService.add({
        severity: 'danger', summary: 'Delete', detail: p.name,
      }),
    },
  ];
}

actionsGrid: GridData<Product> = {
  columns: this.baseColumns,
  rows: this.products,
  actions: this.productActions(),
};

selectedProducts: Product[] = [];`,

    detail: `interface CategorySummary {
  category: string;
  totalValue: number;
  avgPrice: number;
  inventoryStatus: string;
}

readonly categoryColumns: TableColumn[] = [
  { field: 'category',        header: 'Category',    sortable: true },
  { field: 'totalValue',      header: 'Total Value', sortable: true, type: 'currency' },
  { field: 'avgPrice',        header: 'Avg Price',   sortable: true, type: 'currency' },
  { field: 'inventoryStatus', header: 'Status',      sortable: true },
];

private buildCategories(): CategorySummary[] {
  const map = new Map<string, Product[]>();
  this.products.forEach((p) => {
    const group = map.get(p.category) ?? [];
    group.push(p);
    map.set(p.category, group);
  });
  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    totalValue: items.reduce((s, p) => s + p.price * p.quantity, 0),
    avgPrice:   items.reduce((s, p) => s + p.price, 0) / items.length,
    inventoryStatus: items.every((p) => p.quantity === 0)
      ? 'Out of Stock'
      : items.some((p) => p.quantity === 0) ? 'Mixed' : 'Available',
  }));
}

detailGrid: GridData<CategorySummary, Product> = {
  columns: this.categoryColumns,
  rows: this.buildCategories(),
  actions: [
    {
      id: 'summarise', icon: 'pi pi-eye', severity: 'info',
      tooltip: 'View category',
      handler: (cat) => this.whisperService.add({
        severity: 'info', summary: cat.category,
      }),
    },
  ],
  details: {
    columns: this.baseColumns,
    rows: (cat) => this.products.filter((p) => p.category === cat.category),
    actions: this.productActions(),
  },
};`,

    icons: `interface Product {
  // ...base fields...
  statusIcon:     string; // e.g. 'pi pi-check-circle'
  statusSeverity: string; // e.g. 'success' | 'warn' | 'danger'
  tags:           string[];
}

readonly iconColumns: TableColumn[] = [
  { field: 'name',     header: 'Name',     sortable: true },
  { field: 'category', header: 'Category', sortable: true },
  {
    field: 'statusIcon',
    header: 'Status',
    type: 'icon',
    iconClass: 'statusIcon',       // field containing the icon class string
    severity:  'statusSeverity',   // field containing the severity token
  },
  { field: 'price', header: 'Price', type: 'currency' },
  { field: 'tags',  header: 'Tags',  type: 'list'     },
];

iconGrid: GridData<Product> = {
  columns: this.iconColumns,
  rows: this.products,
};`,

    large: `private generateLargeDataset(count: number): Product[] {
  const categories = ['Electronics', 'Accessories', 'Audio', 'Storage', 'Furniture'];
  const statuses   = ['In Stock', 'Low Stock', 'Out of Stock'];
  return Array.from({ length: count }, (_, i) => {
    const statusLabel = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id:       i + 1,
      name:     \`Product \${i + 1}\`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price:    parseFloat((Math.random() * 1000 + 10).toFixed(2)),
      quantity: Math.floor(Math.random() * 500),
      status:   statusLabel,
      statusIcon: statusLabel === 'In Stock'
        ? 'pi pi-check-circle'
        : statusLabel === 'Low Stock'
          ? 'pi pi-exclamation-circle'
          : 'pi pi-times-circle',
      statusSeverity: statusLabel === 'In Stock' ? 'success'
        : statusLabel === 'Low Stock'            ? 'warn' : 'danger',
      date: new Date(2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      ).toISOString().split('T')[0],
      tags: [],
    };
  });
}

largeGrid: GridData<Product> = {
  columns: this.baseColumns,
  rows: this.generateLargeDataset(10_000),
};`,
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  private generateLargeDataset(count: number): Product[] {
    const categories = [
      'Electronics',
      'Accessories',
      'Audio',
      'Storage',
      'Furniture',
    ];
    const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];
    return Array.from({ length: count }, (_, i) => {
      const statusLabel = statuses[Math.floor(Math.random() * statuses.length)];
      return {
        id: i + 1,
        name: `Product ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
        quantity: Math.floor(Math.random() * 500),
        status: statusLabel,
        statusIcon:
          statusLabel === 'In Stock'
            ? 'pi pi-check-circle'
            : statusLabel === 'Low Stock'
              ? 'pi pi-exclamation-circle'
              : 'pi pi-times-circle',
        statusSeverity:
          statusLabel === 'In Stock'
            ? 'success'
            : statusLabel === 'Low Stock'
              ? 'warn'
              : 'danger',
        date: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        )
          .toISOString()
          .split('T')[0],
        tags: [],
      };
    });
  }
}
