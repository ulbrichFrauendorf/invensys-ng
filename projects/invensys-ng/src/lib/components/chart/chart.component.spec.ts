import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IChart } from './chart.component';
import { IChartData } from './chart.interfaces';

describe('IChart', () => {
  let component: IChart;
  let fixture: ComponentFixture<IChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IChart],
    }).compileComponents();

    fixture = TestBed.createComponent(IChart);
    component = fixture.componentInstance;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.charts).toEqual([]);
      expect(component.height).toBe('240px');
      expect(component.responsive).toBe(true);
    });

    it('should accept charts input', () => {
      const testCharts: IChartData[] = [
        {
          chartId: 'test-chart',
          chartType: 'bar',
          labels: ['A', 'B', 'C'],
          dataSets: [
            {
              label: 'Test',
              data: [1, 2, 3],
              backgroundColors: ['#ff0000', '#00ff00', '#0000ff'],
            },
          ],
        },
      ];
      fixture.componentRef.setInput('charts', testCharts);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.charts).toEqual(testCharts);
    });

    it('should accept height input', () => {
      fixture.componentRef.setInput('height', '30rem');
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.height).toBe('30rem');
    });

    it('should accept responsive input', () => {
      fixture.componentRef.setInput('responsive', false);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.responsive).toBe(false);
    });
  });

  describe('Chart Type Mapping', () => {
    it('should map bar type correctly', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      // Give time for chart initialization

      expect(component.chartDisplays[0].type).toBe('bar');
    });

    it('should map bar-stack type to bar', () => {
      const chart: IChartData = {
        chartType: 'bar-stack',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.chartDisplays[0].type).toBe('bar');
    });

    it('should map bar-horizontal type to bar', () => {
      const chart: IChartData = {
        chartType: 'bar-horizontal',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.chartDisplays[0].type).toBe('bar');
    });

    it('should map pie type correctly', () => {
      const chart: IChartData = {
        chartType: 'pie',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.chartDisplays[0].type).toBe('pie');
    });

    it('should map doughnut type correctly', () => {
      const chart: IChartData = {
        chartType: 'doughnut',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.chartDisplays[0].type).toBe('doughnut');
    });

    it('should map line type correctly', () => {
      const chart: IChartData = {
        chartType: 'line',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.chartDisplays[0].type).toBe('line');
    });

    it('should handle all extended chart types', () => {
      const chart: IChartData = {
        chartType: 'bar-stack',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.chartDisplays[0].type).toBe('bar');
    });
  });

  describe('Chart Height', () => {
    it('should use bar-large height of 480px', () => {
      const chart: IChartData = {
        chartType: 'bar-large',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.chartDisplays[0].height).toBe('480px');
    });

    it('should use default height for regular bar', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.chartDisplays[0].height).toBe('240px');
    });
  });

  describe('Color Resolution', () => {
    it('should keep hex colors as-is', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#ff0000'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const dataset = component.chartDisplays[0].data as {
        datasets: {
          borderColor: string[];
        }[];
      };
      expect(dataset.datasets[0].borderColor[0]).toBe('#ff0000');
    });

    it('should resolve built-in palette colors like --blue-500', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['--blue-500'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const dataset = component.chartDisplays[0].data as {
        datasets: {
          borderColor: string[];
        }[];
      };
      expect(dataset.datasets[0].borderColor[0]).toBe('#3b82f6');
    });

    it('should resolve built-in palette colors like --green-400', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['--green-400'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const dataset = component.chartDisplays[0].data as {
        datasets: {
          borderColor: string[];
        }[];
      };
      expect(dataset.datasets[0].borderColor[0]).toBe('#4cd07d');
    });

    it('should resolve rgb colors as-is', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['rgb(255, 0, 0)'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const dataset = component.chartDisplays[0].data as {
        datasets: {
          borderColor: string[];
        }[];
      };
      expect(dataset.datasets[0].borderColor[0]).toBe('rgb(255, 0, 0)');
    });

    it('should resolve rgba colors as-is', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [
          {
            label: 'Test',
            data: [1],
            backgroundColors: ['rgba(255, 0, 0, 0.5)'],
          },
        ],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const dataset = component.chartDisplays[0].data as {
        datasets: {
          borderColor: string[];
        }[];
      };
      expect(dataset.datasets[0].borderColor[0]).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should fall back to gray for unknown CSS variables', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['--unknown-color'] }],
      };
      fixture.componentRef.setInput('charts', [chart]);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const dataset = component.chartDisplays[0].data as {
        datasets: {
          borderColor: string[];
        }[];
      };
      // Falls back to gray-500 for unknown colors
      expect(dataset.datasets[0].borderColor[0]).toBe('#64748b');
    });
  });

  describe('getChartHeightStyle', () => {
    it('should return display height when set', () => {
      const display = {
        id: 'test-1',
        type: 'bar' as const,
        data: {},
        options: {},
        height: '30rem',
      };
      expect(component.getChartHeightStyle(display)).toBe('30rem');
    });

    it('should return component height when display height is not set', () => {
      fixture.componentRef.setInput('height', '25rem');
      const display = {
        id: 'test-2',
        type: 'bar' as const,
        data: {},
        options: {},
      };
      expect(component.getChartHeightStyle(display)).toBe('25rem');
    });
  });

  describe('Lifecycle', () => {
    it('initializes a chart after its input is rendered', async () => {
      fixture.componentRef.setInput('charts', [
        {
          chartType: 'bar',
          labels: ['A'],
          dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
        },
      ]);
      await fixture.whenStable();
      await expect.poll(() => component.getChartInstanceCount()).toBe(1);
    });

    it('destroys its chart instances with the fixture', async () => {
      fixture.componentRef.setInput('charts', [
        {
          chartType: 'bar',
          labels: ['A'],
          dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
        },
      ]);
      await fixture.whenStable();
      await expect.poll(() => component.getChartInstanceCount()).toBe(1);
      fixture.destroy();
      expect(component.getChartInstanceCount()).toBe(0);
    });
  });
});
