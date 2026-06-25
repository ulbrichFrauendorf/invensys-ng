import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  ElementRef,
  QueryList,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {
  IChartData,
  IChartDataSet,
  IChartDisplay,
  IChartType,
  IChartTypeExtended,
} from './chart.interfaces';

// Register all Chart.js components
Chart.register(...registerables);

/**
 * Built-in color palette for chart colors.
 * Users can reference these colors using shorthand like '--blue-500' or direct hex values.
 * @internal
 */
const CHART_COLOR_PALETTE: Record<string, Record<string | number, string>> = {
  blue: {
    50: '#f5f9ff',
    100: '#d0e1fd',
    200: '#abc9fb',
    300: '#85b2f9',
    400: '#609af8',
    500: '#3b82f6',
    600: '#326fd1',
    700: '#295bac',
    800: '#204887',
    900: '#183462',
  },
  green: {
    50: '#f4fcf7',
    100: '#caf1d8',
    200: '#a0e6ba',
    300: '#76db9b',
    400: '#4cd07d',
    500: '#22c55e',
    600: '#1da750',
    700: '#188a42',
    800: '#136c34',
    900: '#0e4f26',
  },
  yellow: {
    50: '#fefbf3',
    100: '#faedc4',
    200: '#f6de95',
    300: '#f2d066',
    400: '#eec137',
    500: '#eab308',
    600: '#c79807',
    700: '#a47d06',
    800: '#816204',
    900: '#5e4803',
  },
  cyan: {
    50: '#f3fbfd',
    100: '#c3edf5',
    200: '#94e0ed',
    300: '#65d2e4',
    400: '#35c4dc',
    500: '#06b6d4',
    600: '#059bb4',
    700: '#047f94',
    800: '#036475',
    900: '#024955',
  },
  pink: {
    50: '#fef6fa',
    100: '#fad3e7',
    200: '#f7b0d3',
    300: '#f38ec0',
    400: '#f06bac',
    500: '#ec4899',
    600: '#c93d82',
    700: '#a5326b',
    800: '#822854',
    900: '#5e1d3d',
  },
  indigo: {
    50: '#f7f7fe',
    100: '#dadafc',
    200: '#bcbdf9',
    300: '#9ea0f6',
    400: '#8183f4',
    500: '#6366f1',
    600: '#5457cd',
    700: '#4547a9',
    800: '#363885',
    900: '#282960',
  },
  teal: {
    50: '#f3fbfb',
    100: '#c7eeea',
    200: '#9ae0d9',
    300: '#6dd3c8',
    400: '#41c5b7',
    500: '#14b8a6',
    600: '#119c8d',
    700: '#0e8174',
    800: '#0b655b',
    900: '#084a42',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  bluegray: {
    50: '#f7f8f9',
    100: '#dadee3',
    200: '#bcc3cd',
    300: '#9fa9b7',
    400: '#818ea1',
    500: '#64748b',
    600: '#556376',
    700: '#465161',
    800: '#37404c',
    900: '#282e38',
  },
  purple: {
    50: '#fbf7ff',
    100: '#ead6fd',
    200: '#dab6fc',
    300: '#c996fa',
    400: '#b975f9',
    500: '#a855f7',
    600: '#8f48d2',
    700: '#763cad',
    800: '#5c2f88',
    900: '#432263',
  },
  red: {
    50: '#fff5f5',
    100: '#ffd0ce',
    200: '#ffaca7',
    300: '#ff8780',
    400: '#ff6259',
    500: '#ff3d32',
    600: '#d9342b',
    700: '#b32b23',
    800: '#8c221c',
    900: '#661814',
  },
  gray: {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#111827',
    950: '#020617',
  },
};

/**
 * Chart Component
 *
 * A Chart.js-based chart component for displaying various chart types.
 * Supports multiple charts in a responsive grid layout.
 *
 * @example
 * ```html
 * <i-chart
 *   [charts]="myCharts"
 *   height="25rem">
 * </i-chart>
 * ```
 *
 * @example
 * ```typescript
 * myCharts: IChartData[] = [
 *   {
 *     chartId: 'sales-chart',
 *     chartType: 'bar',
 *     labels: ['Jan', 'Feb', 'Mar'],
 *     dataSets: [{
 *       label: 'Sales',
 *       data: [100, 200, 150],
 *       backgroundColors: ['--blue-500', '--green-500', '--orange-500']
 *     }]
 *   }
 * ];
 * ```
 */
@Component({
  selector: 'i-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class IChart implements AfterViewInit, OnDestroy, OnChanges {
  /**
   * Array of chart data objects to render
   */
  @Input() charts: IChartData[] = [];

  /**
   * Default height for charts
   * @default '20rem'
   */
  @Input() height = '20rem';

  /**
   * Whether charts should be responsive
   * @default true
   */
  @Input() responsive = true;

  /**
   * Reference to all canvas elements
   * @internal
   */
  @ViewChildren('chartCanvas')
  canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;

  /**
   * Array of display configurations for each chart
   * @internal
   */
  chartDisplays: IChartDisplay[] = [];

  /**
   * Chart.js instances for cleanup
   * @internal
   */
  private chartInstances: Chart[] = [];

  /**
   * Flag to track if component has initialized
   * @internal
   */
  private initialized = false;

  /**
   * Reference to pending animation frame for cleanup
   * @internal
   */
  private pendingAnimationFrame: number | null = null;

  /**
   * Change detector reference for manual change detection
   * @internal
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * Reference to the host element
   * @internal
   */
  private el = inject(ElementRef);

  ngAfterViewInit(): void {
    this.initialized = true;
    this.initializeCharts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['charts'] && this.initialized) {
      this.destroyCharts();
      this.initializeCharts();
    }
  }

  ngOnDestroy(): void {
    this.cancelPendingInitialization();
    this.destroyCharts();
  }

  /**
   * Cancel any pending chart initialization
   * @internal
   */
  private cancelPendingInitialization(): void {
    if (this.pendingAnimationFrame !== null) {
      cancelAnimationFrame(this.pendingAnimationFrame);
      this.pendingAnimationFrame = null;
    }
  }

  /**
   * Initialize all charts
   * @internal
   */
  private initializeCharts(): void {
    this.chartDisplays = this.charts.map((chart, index) =>
      this.transformToChartDisplay(chart, index)
    );

    // Cancel any pending initialization
    this.cancelPendingInitialization();

    // Trigger change detection to ensure DOM is updated with canvas elements
    this.cdr.detectChanges();

    // Use requestAnimationFrame for proper timing after view update
    this.pendingAnimationFrame = requestAnimationFrame(() => {
      this.pendingAnimationFrame = null;
      this.createChartInstances();
    });
  }

  /**
   * Create Chart.js instances for all canvas elements
   * @internal
   */
  private createChartInstances(): void {
    this.canvasElements.forEach((canvasRef, index) => {
      const chartDisplay = this.chartDisplays[index];
      if (chartDisplay && canvasRef?.nativeElement) {
        const chartInstance = this.createChartInstance(
          canvasRef.nativeElement,
          chartDisplay
        );
        this.chartInstances.push(chartInstance);
      }
    });
  }

  /**
   * Destroy all chart instances
   * @internal
   */
  private destroyCharts(): void {
    this.chartInstances.forEach((chart) => {
      chart.destroy();
    });
    this.chartInstances = [];
    this.chartDisplays = [];
  }

  /**
   * Create a Chart.js instance
   * @internal
   */
  private createChartInstance(
    canvas: HTMLCanvasElement,
    display: IChartDisplay
  ): Chart {
    const config: ChartConfiguration = {
      type: display.type,
      data: display.data as ChartConfiguration['data'],
      options: display.options as ChartConfiguration['options'],
    };

    return new Chart(canvas, config);
  }

  /**
   * Transform IChartData to IChartDisplay
   * @internal
   */
  private transformToChartDisplay(
    chart: IChartData,
    index: number
  ): IChartDisplay {
    // Read resolved CSS variables from the host element
    // This picks up the values defined in chart.component.scss which map to the global theme
    const computedStyle = getComputedStyle(this.el.nativeElement);
    const documentStyle = getComputedStyle(document.documentElement);

    const getStyle = (name: string, fallback: string) => {
      const value = computedStyle.getPropertyValue(name).trim();
      return value && !value.startsWith('var(') ? value : fallback;
    };

    // Use the chart-specific variables defined in SCSS
    const textColor = getStyle('--chart-text-color', '#334155');
    const textColorSecondary = getStyle('--chart-text-secondary', '#64748b');
    const surfaceBorder = getStyle('--chart-grid-color', '#e2e8f0');

    const chartType = this.mapChartType(chart.chartType);
    const height = this.getChartHeight(chart.chartType);
    const options = this.getChartOptions(
      chart.chartType,
      textColor,
      textColorSecondary,
      surfaceBorder
    );

    const data = {
      labels: chart.labels,
      datasets: chart.dataSets.map((dataset) =>
        this.transformDataset(dataset, documentStyle)
      ),
    };

    return {
      id: chart.chartId || `chart-${index}`,
      type: chartType,
      data,
      options,
      height,
    };
  }

  /**
   * Map custom chart type strings to Chart.js types
   * @internal
   */
  private mapChartType(chartType: IChartTypeExtended): IChartType {
    const typeMap: Record<IChartTypeExtended, IChartType> = {
      bar: 'bar',
      'bar-stack': 'bar',
      'bar-large': 'bar',
      'bar-horizontal': 'bar',
      pie: 'pie',
      doughnut: 'doughnut',
      line: 'line',
      scatter: 'scatter',
      bubble: 'bubble',
      polarArea: 'polarArea',
      radar: 'radar',
    };

    return typeMap[chartType] || 'bar';
  }

  /**
   * Get chart height based on chart type
   * @internal
   */
  private getChartHeight(chartType: IChartTypeExtended): string {
    if (chartType === 'bar-large') {
      return '40rem';
    }
    return this.height;
  }

  /**
   * Get chart options based on chart type
   * @internal
   */
  private getChartOptions(
    chartType: IChartTypeExtended,
    textColor: string,
    textColorSecondary: string,
    surfaceBorder: string
  ): unknown {
    const baseOptions = {
      maintainAspectRatio: false,
      responsive: this.responsive,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };

    switch (chartType) {
      case 'bar':
        return {
          ...baseOptions,
          scales: this.getBarScales(textColorSecondary, surfaceBorder),
        };

      case 'bar-stack':
        return {
          ...baseOptions,
          scales: this.getStackedBarScales(textColorSecondary, surfaceBorder),
        };

      case 'bar-large':
        return {
          ...baseOptions,
          scales: this.getBarScales(textColorSecondary, surfaceBorder),
        };

      case 'bar-horizontal':
        return {
          ...baseOptions,
          indexAxis: 'y' as const,
          scales: this.getBarScales(textColorSecondary, surfaceBorder),
        };

      case 'pie':
      case 'doughnut':
        return {
          ...baseOptions,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
              position: 'bottom' as const,
            },
          },
        };

      case 'line':
        return {
          ...baseOptions,
          scales: this.getBarScales(textColorSecondary, surfaceBorder),
        };

      case 'radar':
        return {
          ...baseOptions,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          scales: {
            r: {
              grid: {
                color: surfaceBorder,
              },
              pointLabels: {
                color: textColorSecondary,
              },
            },
          },
        };

      case 'polarArea':
        return {
          ...baseOptions,
          scales: {
            r: {
              grid: {
                color: surfaceBorder,
              },
            },
          },
        };

      default:
        return baseOptions;
    }
  }

  /**
   * Get scales configuration for bar charts
   * @internal
   */
  private getBarScales(textColorSecondary: string, surfaceBorder: string) {
    return {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    };
  }

  /**
   * Get scales configuration for stacked bar charts
   * @internal
   */
  private getStackedBarScales(
    textColorSecondary: string,
    surfaceBorder: string
  ) {
    return {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    };
  }

  /**
   * Transform dataset with resolved colors
   * @internal
   */
  private transformDataset(
    dataset: IChartDataSet,
    documentStyle: CSSStyleDeclaration
  ) {
    return {
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColors.map((color) => {
        const resolvedColor = this.resolveColor(color, documentStyle);
        return this.addTransparency(resolvedColor);
      }),
      borderColor: dataset.backgroundColors.map((color) =>
        this.resolveColor(color, documentStyle)
      ),
      borderWidth: 1,
    };
  }

  /**
   * Resolve color to hex value. Supports:
   * - Direct hex colors (e.g., '#ff0000')
   * - RGB/RGBA colors (e.g., 'rgb(255, 0, 0)', 'rgba(255, 0, 0, 0.5)')
   * - Built-in palette shorthand (e.g., '--blue-500', '--green-400')
   * - CSS custom properties (e.g., '--my-custom-color')
   * @internal
   */
  private resolveColor(
    color: string,
    documentStyle: CSSStyleDeclaration
  ): string {
    // If it's already a hex color or rgb/rgba, return as-is
    if (
      color.startsWith('#') ||
      color.startsWith('rgb(') ||
      color.startsWith('rgba(')
    ) {
      return color;
    }

    // Handle CSS variable format (--color-name or --color-shade)
    if (color.startsWith('--')) {
      // Try to resolve from built-in palette first (e.g., --blue-500)
      const paletteColor = this.resolveFromPalette(color);
      if (paletteColor) {
        return paletteColor;
      }

      // Fall back to CSS custom property lookup
      const cssValue = documentStyle.getPropertyValue(color).trim();
      if (cssValue) {
        return cssValue;
      }

      // If CSS variable is not found, return a fallback color
      return '#64748b'; // Default gray-500
    }

    return color;
  }

  /**
   * Resolve color from built-in palette using shorthand format (e.g., '--blue-500')
   * @internal
   */
  private resolveFromPalette(colorVar: string): string | null {
    // Remove leading '--' and split by '-'
    const colorName = colorVar.substring(2); // Remove '--'
    const lastDashIndex = colorName.lastIndexOf('-');

    if (lastDashIndex === -1) {
      return null;
    }

    const name = colorName.substring(0, lastDashIndex);
    const shade = colorName.substring(lastDashIndex + 1);

    const colorGroup = CHART_COLOR_PALETTE[name];
    if (colorGroup) {
      // Try as string key first, then as number for numeric shades like 500
      if (colorGroup[shade]) {
        return colorGroup[shade];
      }
      const numericShade = parseInt(shade, 10);
      if (!isNaN(numericShade) && colorGroup[numericShade]) {
        return colorGroup[numericShade];
      }
    }

    return null;
  }

  /**
   * Add transparency to a color. Supports hex and rgb/rgba formats.
   * @internal
   */
  private addTransparency(color: string): string {
    // If it's a hex color, add transparency
    if (color.startsWith('#')) {
      return color + 'bf'; // ~75% opacity
    }
    // If it's an rgb color, convert to rgba with transparency
    if (color.startsWith('rgb(')) {
      // Extract the rgb values and convert to rgba
      const rgbMatch = color.match(
        /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/
      );
      if (rgbMatch) {
        return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0.75)`;
      }
    }
    // If it's already rgba, leave as-is (user specified their own alpha)
    return color;
  }

  /**
   * Get the height style for a chart display
   * @param display - The chart display configuration
   * @returns The height CSS value
   */
  getChartHeightStyle(display: IChartDisplay): string {
    return display.height || this.height;
  }

  /**
   * Get the number of active chart instances (for testing)
   * @returns The count of active chart instances
   */
  getChartInstanceCount(): number {
    return this.chartInstances.length;
  }
}
