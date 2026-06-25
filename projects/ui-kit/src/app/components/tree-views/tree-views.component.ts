import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {
  ITreeView,
  ITreeNode,
  IButton,
} from '../../../../../invensys-ng/src/public-api';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-tree-views',
  imports: [
    ITreeView,
    IButton,
    DemoCardComponent,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    FeaturesListComponent,
  ],
  templateUrl: './tree-views.component.html',
  styleUrl: './tree-views.component.scss',
})
export class TreeViewsComponent {
  // Basic tree data
  basicTreeData: ITreeNode[] = [
    {
      key: '0',
      label: 'Documents',
      data: 'Documents Folder',
      icon: 'pi pi-folder',
      children: [
        {
          key: '0-0',
          label: 'Work',
          data: 'Work Folder',
          icon: 'pi pi-folder',
          children: [
            {
              key: '0-0-0',
              label: 'Expenses.doc',
              data: 'Expenses Document',
              icon: 'pi pi-file',
            },
            {
              key: '0-0-1',
              label: 'Resume.doc',
              data: 'Resume Document',
              icon: 'pi pi-file',
            },
          ],
        },
        {
          key: '0-1',
          label: 'Home',
          data: 'Home Folder',
          icon: 'pi pi-folder',
          children: [
            {
              key: '0-1-0',
              label: 'Invoices.txt',
              data: 'Invoices for this month',
              icon: 'pi pi-file',
            },
          ],
        },
      ],
    },
    {
      key: '1',
      label: 'Pictures',
      data: 'Pictures Folder',
      icon: 'pi pi-folder',
      children: [
        {
          key: '1-0',
          label: 'barcelona.jpg',
          data: 'Barcelona Photo',
          icon: 'pi pi-image',
        },
        {
          key: '1-1',
          label: 'logo.jpg',
          data: 'PrimeFaces Logo',
          icon: 'pi pi-image',
        },
        {
          key: '1-2',
          label: 'primeui.png',
          data: 'PrimeUI Logo',
          icon: 'pi pi-image',
        },
      ],
    },
  ];

  // Organization structure data
  organizationData: ITreeNode[] = [
    {
      key: '0',
      label: 'Invensys Corporation',
      data: 'Root Organization',
      icon: 'pi pi-building',
      expanded: true,
      children: [
        {
          key: '0-0',
          label: 'Engineering Division',
          data: 'Engineering Department',
          icon: 'pi pi-cog',
          expanded: true,
          children: [
            {
              key: '0-0-0',
              label: 'Software Engineering',
              data: 'Software Team',
              icon: 'pi pi-code',
              children: [
                {
                  key: '0-0-0-0',
                  label: 'Frontend Team',
                  data: 'Frontend Developers',
                  icon: 'pi pi-users',
                },
                {
                  key: '0-0-0-1',
                  label: 'Backend Team',
                  data: 'Backend Developers',
                  icon: 'pi pi-users',
                },
                {
                  key: '0-0-0-2',
                  label: 'DevOps Team',
                  data: 'DevOps Engineers',
                  icon: 'pi pi-users',
                },
              ],
            },
            {
              key: '0-0-1',
              label: 'Hardware Engineering',
              data: 'Hardware Team',
              icon: 'pi pi-microchip',
              children: [
                {
                  key: '0-0-1-0',
                  label: 'Design Team',
                  data: 'Hardware Designers',
                  icon: 'pi pi-users',
                },
                {
                  key: '0-0-1-1',
                  label: 'Testing Team',
                  data: 'Hardware Testers',
                  icon: 'pi pi-users',
                },
              ],
            },
          ],
        },
        {
          key: '0-1',
          label: 'Sales Division',
          data: 'Sales Department',
          icon: 'pi pi-chart-line',
          children: [
            {
              key: '0-1-0',
              label: 'North America',
              data: 'NA Sales',
              icon: 'pi pi-globe',
            },
            {
              key: '0-1-1',
              label: 'Europe',
              data: 'EU Sales',
              icon: 'pi pi-globe',
            },
            {
              key: '0-1-2',
              label: 'Asia Pacific',
              data: 'APAC Sales',
              icon: 'pi pi-globe',
            },
          ],
        },
        {
          key: '0-2',
          label: 'Support Division',
          data: 'Support Department',
          icon: 'pi pi-headphones',
          children: [
            {
              key: '0-2-0',
              label: 'Technical Support',
              data: 'Tech Support',
              icon: 'pi pi-wrench',
            },
            {
              key: '0-2-1',
              label: 'Customer Success',
              data: 'Customer Success',
              icon: 'pi pi-heart',
            },
          ],
        },
      ],
    },
  ];

  // Selection examples
  singleSelection: ITreeNode | null = null;
  multipleSelection: ITreeNode[] = [];
  checkboxSelection: ITreeNode[] = [];

  // Filter example
  filteredTreeData = [...this.basicTreeData];

  // Features list
  features: Feature[] = [
    {
      title: 'Multiple Selection Modes',
      description: 'Single, multiple, and checkbox selection modes',
    },
    {
      title: 'Node Expansion',
      description: 'Expand/collapse nodes with children',
    },
    {
      title: 'Filtering',
      description: 'Built-in filtering with customizable filter function',
    },
    {
      title: 'Custom Icons',
      description: 'Support for custom icons per node',
    },
    {
      title: 'Event Handling',
      description: 'Rich set of events for selection, expansion, and filtering',
    },
    {
      title: 'Hierarchical Data',
      description: 'Support for deep nested tree structures',
    },
    {
      title: 'Accessibility',
      description: 'Full keyboard navigation and ARIA support',
    },
    {
      title: 'Scrollable Content',
      description: 'Configurable scroll height for large trees',
    },
  ];

  // HTML Code examples
  codeExamples = {
    basic: `<i-tree-view [value]="treeData"></i-tree-view>`,

    selection: `<!-- Single selection -->
<i-tree-view 
  [value]="treeData" 
  selectionMode="single"
  [(selection)]="singleSelection">
</i-tree-view>

<!-- Multiple selection -->
<i-tree-view 
  [value]="treeData" 
  selectionMode="multiple"
  [(selection)]="multipleSelection">
</i-tree-view>

<!-- Checkbox selection -->
<i-tree-view 
  [value]="treeData" 
  selectionMode="checkbox"
  [(selection)]="checkboxSelection">
</i-tree-view>`,

    events: `<i-tree-view 
  [value]="treeData"
  (onNodeSelect)="onNodeSelect($event)"
  (onNodeUnselect)="onNodeUnselect($event)"
  (onNodeExpand)="onNodeExpand($event)"
  (onNodeCollapse)="onNodeCollapse($event)">
</i-tree-view>`,

    filtering: `<i-tree-view 
  [value]="treeData"
  [filter]="true"
  filterPlaceholder="Search nodes..."
  filterBy="label">
</i-tree-view>`,

    scrollable: `<i-tree-view 
  [value]="treeData"
  scrollHeight="400px">
</i-tree-view>`,

    customization: `<i-tree-view 
  [value]="customTreeData"
  [scrollHeight]="'400px'">
</i-tree-view>`,
  };

  // TypeScript examples
  tsExamples = {
    basic: `import { ITreeView, ITreeNode } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ITreeView],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  treeData: ITreeNode[] = [
    {
      key: '0',
      label: 'Documents',
      icon: 'pi pi-folder',
      children: [
        {
          key: '0-0',
          label: 'Work',
          icon: 'pi pi-folder',
          children: [
            { key: '0-0-0', label: 'Resume.doc', icon: 'pi pi-file' }
          ]
        }
      ]
    }
  ];
}`,

    selection: `// Selection handling
singleSelection: ITreeNode | null = null;
multipleSelection: ITreeNode[] = [];
checkboxSelection: ITreeNode[] = [];

onNodeSelect(event: any) {
  console.log('Node selected:', event.node);
}

onNodeUnselect(event: any) {
  console.log('Node unselected:', event.node);
}`,

    customization: `// Custom tree node interface
interface ITreeNode {
  key?: string;
  label?: string;
  data?: any;
  icon?: string;
  expandedIcon?: string;
  collapsedIcon?: string;
  children?: ITreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  selectable?: boolean;
  styleClass?: string;
}

// Custom icons example
customTreeData: ITreeNode[] = [
  {
    key: '0',
    label: 'Folder',
    expandedIcon: 'pi pi-folder-open',
    collapsedIcon: 'pi pi-folder',
    expanded: true,
    children: [
      {
        key: '0-0',
        label: 'Document',
        icon: 'pi pi-file-pdf',
        leaf: true
      }
    ]
  }
];`,
  };

  // Component setup
  initializationCode = `import { ITreeView, ITreeNode } from 'invensys-ng';

@Component({
  selector: 'app-example',
  imports: [ITreeView],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  treeData: ITreeNode[] = [];
}`;

  constructor() {
    // Initialize some nodes as expanded
    this.basicTreeData[0].expanded = true;
  }

  // Event handlers
  onSingleNodeSelect(event: any) {
    console.log('Single node selected:', event.node);
  }

  onSingleNodeUnselect(event: any) {
    console.log('Single node unselected:', event.node);
  }

  onMultipleNodeSelect(event: any) {
    console.log('Multiple node selected:', event.node);
    console.log('Object', this.checkboxSelection);
  }

  onMultipleNodeUnselect(event: any) {
    console.log('Multiple node unselected:', event.node);
  }

  onCheckboxNodeSelect(event: any) {
    console.log('Checkbox node selected:', event.node);
    console.log('Object', this.checkboxSelection);
  }

  onCheckboxNodeUnselect(event: any) {
    console.log('Checkbox node unselected:', event.node);
    console.log('Object', this.checkboxSelection);
  }

  onNodeExpand(event: any) {
    console.log('Node expanded:', event.node);
  }

  onNodeCollapse(event: any) {
    console.log('Node collapsed:', event.node);
  }

  // Reset selections
  clearSingleSelection() {
    this.singleSelection = null;
  }

  clearMultipleSelection() {
    this.multipleSelection = [];
  }

  clearCheckboxSelection() {
    this.checkboxSelection = [];
  }

  // Expand/collapse all
  expandAll() {
    this.expandCollapseRecursive(this.basicTreeData, true);
    this.expandCollapseRecursive(this.organizationData, true);
  }

  collapseAll() {
    this.expandCollapseRecursive(this.basicTreeData, false);
    this.expandCollapseRecursive(this.organizationData, false);
  }

  private expandCollapseRecursive(nodes: ITreeNode[], expanded: boolean) {
    nodes.forEach((node) => {
      node.expanded = expanded;
      if (node.children) {
        this.expandCollapseRecursive(node.children, expanded);
      }
    });
  }

  // Helper method to create a serializable node summary without circular references
  getNodeSummary(node: ITreeNode) {
    return {
      key: node.key,
      label: node.label,
      data: node.data,
      icon: node.icon,
      expanded: node.expanded,
      leaf: node.leaf,
      type: node.type,
      selectable: node.selectable,
      hasChildren: !!(node.children && node.children.length > 0),
      childrenCount: node.children?.length || 0,
    };
  }

  // Helper method to create summaries for multiple nodes
  getMultipleNodesSummary(nodes: ITreeNode[]) {
    return nodes.map((node) => this.getNodeSummary(node));
  }
}
