import { Component } from '@angular/core';
import { IChart } from '../../../../../invensys-ng/src/lib/components/chart/chart.component';
import { IChartData } from '../../../../../invensys-ng/src/lib/components/chart/chart.interfaces';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [IChart, DemoCardComponent, FeaturesListComponent],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent {
  // Bar Chart Data
  barChartData: IChartData[] = [
    {
      chartId: 'bar-chart',
      chartType: 'bar',
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      dataSets: [
        {
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColors: [
            '--blue-500',
            '--blue-500',
            '--blue-500',
            '--blue-500',
            '--blue-500',
            '--blue-500',
          ],
        },
      ],
    },
  ];

  // Stacked Bar Chart Data
  stackedBarChartData: IChartData[] = [
    {
      chartId: 'stacked-bar-chart',
      chartType: 'bar-stack',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      dataSets: [
        {
          label: 'Product A',
          data: [50, 60, 70, 80],
          backgroundColors: ['--blue-500', '--blue-500', '--blue-500', '--blue-500'],
        },
        {
          label: 'Product B',
          data: [30, 40, 35, 45],
          backgroundColors: ['--green-500', '--green-500', '--green-500', '--green-500'],
        },
        {
          label: 'Product C',
          data: [20, 25, 30, 35],
          backgroundColors: ['--orange-500', '--orange-500', '--orange-500', '--orange-500'],
        },
      ],
    },
  ];

  // Horizontal Bar Chart Data
  horizontalBarChartData: IChartData[] = [
    {
      chartId: 'horizontal-bar-chart',
      chartType: 'bar-horizontal',
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
      dataSets: [
        {
          label: 'Votes',
          data: [12, 19, 3, 5, 2],
          backgroundColors: [
            '--red-500',
            '--blue-500',
            '--yellow-500',
            '--green-500',
            '--purple-500',
          ],
        },
      ],
    },
  ];

  // Line Chart Data
  lineChartData: IChartData[] = [
    {
      chartId: 'line-chart',
      chartType: 'line',
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      dataSets: [
        {
          label: 'Dataset 1',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColors: ['--blue-500'],
        },
        {
          label: 'Dataset 2',
          data: [28, 48, 40, 19, 86, 27],
          backgroundColors: ['--green-500'],
        },
      ],
    },
  ];

  // Pie Chart Data
  pieChartData: IChartData[] = [
    {
      chartId: 'pie-chart',
      chartType: 'pie',
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
      dataSets: [
        {
          label: 'Dataset',
          data: [12, 19, 3, 5, 2],
          backgroundColors: [
            '--red-500',
            '--blue-500',
            '--yellow-500',
            '--green-500',
            '--purple-500',
          ],
        },
      ],
    },
  ];

  // Doughnut Chart Data
  doughnutChartData: IChartData[] = [
    {
      chartId: 'doughnut-chart',
      chartType: 'doughnut',
      labels: ['Desktop', 'Mobile', 'Tablet'],
      dataSets: [
        {
          label: 'Traffic Sources',
          data: [55, 35, 10],
          backgroundColors: ['--blue-500', '--green-500', '--orange-500'],
        },
      ],
    },
  ];

  // Radar Chart Data
  radarChartData: IChartData[] = [
    {
      chartId: 'radar-chart',
      chartType: 'radar',
      labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling'],
      dataSets: [
        {
          label: 'Person A',
          data: [65, 59, 90, 81, 56, 55],
          backgroundColors: ['--blue-500'],
        },
        {
          label: 'Person B',
          data: [28, 48, 40, 19, 96, 27],
          backgroundColors: ['--green-500'],
        },
      ],
    },
  ];

  // Multiple Charts Data (for responsive grid demo)
  multipleChartsData: IChartData[] = [
    {
      chartId: 'multi-bar',
      chartType: 'bar',
      labels: ['Jan', 'Feb', 'Mar'],
      dataSets: [
        {
          label: 'Revenue',
          data: [100, 150, 200],
          backgroundColors: ['--blue-500', '--blue-500', '--blue-500'],
        },
      ],
    },
    {
      chartId: 'multi-pie',
      chartType: 'pie',
      labels: ['A', 'B', 'C'],
      dataSets: [
        {
          label: 'Distribution',
          data: [40, 35, 25],
          backgroundColors: ['--green-500', '--orange-500', '--purple-500'],
        },
      ],
    },
  ];

  // Code examples
  codeExamples = {
    bar: `<i-chart [charts]="barChartData"></i-chart>`,

    barTs: `barChartData: IChartData[] = [
  {
    chartId: 'bar-chart',
    chartType: 'bar',
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    dataSets: [{
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColors: ['--blue-500', '--blue-500', '--blue-500', '--blue-500', '--blue-500', '--blue-500']
    }]
  }
];`,

    stacked: `<i-chart [charts]="stackedBarChartData"></i-chart>`,

    stackedTs: `stackedBarChartData: IChartData[] = [
  {
    chartId: 'stacked-bar-chart',
    chartType: 'bar-stack',
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    dataSets: [
      { label: 'Product A', data: [50, 60, 70, 80], backgroundColors: ['--blue-500', ...] },
      { label: 'Product B', data: [30, 40, 35, 45], backgroundColors: ['--green-500', ...] },
      { label: 'Product C', data: [20, 25, 30, 35], backgroundColors: ['--orange-500', ...] }
    ]
  }
];`,

    horizontal: `<i-chart [charts]="horizontalBarChartData"></i-chart>`,

    horizontalTs: `horizontalBarChartData: IChartData[] = [
  {
    chartId: 'horizontal-bar-chart',
    chartType: 'bar-horizontal',
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    dataSets: [{
      label: 'Votes',
      data: [12, 19, 3, 5, 2],
      backgroundColors: ['--red-500', '--blue-500', '--yellow-500', '--green-500', '--purple-500']
    }]
  }
];`,

    line: `<i-chart [charts]="lineChartData"></i-chart>`,

    lineTs: `lineChartData: IChartData[] = [
  {
    chartId: 'line-chart',
    chartType: 'line',
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    dataSets: [
      { label: 'Dataset 1', data: [65, 59, 80, 81, 56, 55], backgroundColors: ['--blue-500'] },
      { label: 'Dataset 2', data: [28, 48, 40, 19, 86, 27], backgroundColors: ['--green-500'] }
    ]
  }
];`,

    pie: `<i-chart [charts]="pieChartData"></i-chart>`,

    pieTs: `pieChartData: IChartData[] = [
  {
    chartId: 'pie-chart',
    chartType: 'pie',
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    dataSets: [{
      label: 'Dataset',
      data: [12, 19, 3, 5, 2],
      backgroundColors: ['--red-500', '--blue-500', '--yellow-500', '--green-500', '--purple-500']
    }]
  }
];`,

    doughnut: `<i-chart [charts]="doughnutChartData"></i-chart>`,

    doughnutTs: `doughnutChartData: IChartData[] = [
  {
    chartId: 'doughnut-chart',
    chartType: 'doughnut',
    labels: ['Desktop', 'Mobile', 'Tablet'],
    dataSets: [{
      label: 'Traffic Sources',
      data: [55, 35, 10],
      backgroundColors: ['--blue-500', '--green-500', '--orange-500']
    }]
  }
];`,

    radar: `<i-chart [charts]="radarChartData"></i-chart>`,

    radarTs: `radarChartData: IChartData[] = [
  {
    chartId: 'radar-chart',
    chartType: 'radar',
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling'],
    dataSets: [
      { label: 'Person A', data: [65, 59, 90, 81, 56, 55], backgroundColors: ['--blue-500'] },
      { label: 'Person B', data: [28, 48, 40, 19, 96, 27], backgroundColors: ['--green-500'] }
    ]
  }
];`,

    multiple: `<i-chart [charts]="multipleChartsData" [responsive]="true"></i-chart>`,

    multipleTs: `multipleChartsData: IChartData[] = [
  {
    chartId: 'multi-bar',
    chartType: 'bar',
    labels: ['Jan', 'Feb', 'Mar'],
    dataSets: [{ label: 'Revenue', data: [100, 150, 200], backgroundColors: ['--blue-500', ...] }]
  },
  {
    chartId: 'multi-pie',
    chartType: 'pie',
    labels: ['A', 'B', 'C'],
    dataSets: [{ label: 'Distribution', data: [40, 35, 25], backgroundColors: ['--green-500', ...] }]
  }
];`,
  };

  // TypeScript initialization example
  initializationCode = `import { Component, Input } from '@angular/core';
import { Chart } from 'app/web-api-client';
import { IChart, IChartData } from 'invensys-ng';

@Component({
  selector: 'app-dashboard-chart',
  imports: [IChart],
  templateUrl: './dashboard-chart.component.html',
  styleUrl: './dashboard-chart.component.scss',
})
export class DashboardChartComponent {
  @Input() charts: Chart[];

  get chartData(): IChartData[] {
    return this.charts?.map((chart) => this.mapToChartData(chart)) ?? [];
  }

  private mapToChartData(chart: Chart): IChartData {
    return {
      chartId: chart.chartType,
      chartType: chart.chartType as IChartData['chartType'],
      labels: chart.labels,
      dataSets: chart.dataSets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColors: dataset.backgroundColors,
      })),
    };
  }
}`;

  // Template example
  templateCode = `<!-- dashboard-chart.component.html -->
<i-chart [charts]="chartData"></i-chart>`;

  // Simple direct usage example
  simpleUsageCode = `import { Component } from '@angular/core';
import { IChart, IChartData } from 'invensys-ng';

@Component({
  selector: 'app-simple-chart',
  imports: [IChart],
  template: '<i-chart [charts]="chartData"></i-chart>',
})
export class SimpleChartComponent {
  chartData: IChartData[] = [
    {
      chartId: 'sales-chart',
      chartType: 'bar',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      dataSets: [{
        label: 'Sales',
        data: [65, 59, 80, 81, 56],
        backgroundColors: ['--blue-500', '--blue-500', '--blue-500', '--blue-500', '--blue-500'],
      }],
    },
  ];
}`;

  // Features list
  features: Feature[] = [
    {
      title: 'Multiple Chart Types',
      description:
        'Supports bar, line, pie, doughnut, radar, polarArea, scatter, and bubble charts',
    },
    {
      title: 'Bar Chart Variants',
      description:
        'Standard, stacked, horizontal, and large bar chart configurations',
    },
    {
      title: 'CSS Variable Colors',
      description:
        'Use CSS custom properties like --blue-500 for theme-aware colors',
    },
    {
      title: 'Multiple Datasets',
      description: 'Display multiple datasets with legends for comparison charts',
    },
    {
      title: 'Responsive Layout',
      description:
        'Charts automatically adapt to container size with responsive grid',
    },
    {
      title: 'Theme Integration',
      description:
        'Automatically uses theme colors for text, borders, and surfaces',
    },
    {
      title: 'Configurable Height',
      description: 'Set custom heights per chart or use the default 20rem',
    },
    {
      title: 'Chart.js Powered',
      description:
        'Built on Chart.js for reliable, performant chart rendering',
    },
  ];
}
