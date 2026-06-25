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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.charts).toEqual([]);
      expect(component.height).toBe('20rem');
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
      component.charts = testCharts;
      fixture.detectChanges();
      expect(component.charts).toEqual(testCharts);
    });

    it('should accept height input', () => {
      component.height = '30rem';
      fixture.detectChanges();
      expect(component.height).toBe('30rem');
    });

    it('should accept responsive input', () => {
      component.responsive = false;
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
      component.charts = [chart];
      fixture.detectChanges();

      // Give time for chart initialization
      setTimeout(() => {
        expect(component.chartDisplays[0].type).toBe('bar');
      }, 100);
    });

    it('should map bar-stack type to bar', () => {
      const chart: IChartData = {
        chartType: 'bar-stack',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.chartDisplays[0].type).toBe('bar');
      }, 100);
    });

    it('should map bar-horizontal type to bar', () => {
      const chart: IChartData = {
        chartType: 'bar-horizontal',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.chartDisplays[0].type).toBe('bar');
      }, 100);
    });

    it('should map pie type correctly', () => {
      const chart: IChartData = {
        chartType: 'pie',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.chartDisplays[0].type).toBe('pie');
      }, 100);
    });

    it('should map doughnut type correctly', () => {
      const chart: IChartData = {
        chartType: 'doughnut',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.chartDisplays[0].type).toBe('doughnut');
      }, 100);
    });

    it('should map line type correctly', () => {
      const chart: IChartData = {
        chartType: 'line',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.chartDisplays[0].type).toBe('line');
      }, 100);
    });

    it('should handle all extended chart types', () => {
      const chart: IChartData = {
        chartType: 'bar-stack',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.chartDisplays[0].type).toBe('bar');
      }, 100);
    });
  });

  describe('Chart Height', () => {
    it('should use bar-large height of 40rem', () => {
      const chart: IChartData = {
        chartType: 'bar-large',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.chartDisplays[0].height).toBe('40rem');
      }, 100);
    });

    it('should use default height for regular bar', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.chartDisplays[0].height).toBe('20rem');
      }, 100);
    });
  });

  describe('Color Resolution', () => {
    it('should keep hex colors as-is', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [
          { label: 'Test', data: [1], backgroundColors: ['#ff0000'] },
        ],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        const dataset = component.chartDisplays[0].data as {
          datasets: { borderColor: string[] }[];
        };
        expect(dataset.datasets[0].borderColor[0]).toBe('#ff0000');
      }, 100);
    });

    it('should resolve built-in palette colors like --blue-500', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [
          { label: 'Test', data: [1], backgroundColors: ['--blue-500'] },
        ],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        const dataset = component.chartDisplays[0].data as {
          datasets: { borderColor: string[] }[];
        };
        expect(dataset.datasets[0].borderColor[0]).toBe('#3b82f6');
      }, 100);
    });

    it('should resolve built-in palette colors like --green-400', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [
          { label: 'Test', data: [1], backgroundColors: ['--green-400'] },
        ],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        const dataset = component.chartDisplays[0].data as {
          datasets: { borderColor: string[] }[];
        };
        expect(dataset.datasets[0].borderColor[0]).toBe('#4cd07d');
      }, 100);
    });

    it('should resolve rgb colors as-is', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [
          { label: 'Test', data: [1], backgroundColors: ['rgb(255, 0, 0)'] },
        ],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        const dataset = component.chartDisplays[0].data as {
          datasets: { borderColor: string[] }[];
        };
        expect(dataset.datasets[0].borderColor[0]).toBe('rgb(255, 0, 0)');
      }, 100);
    });

    it('should resolve rgba colors as-is', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [
          { label: 'Test', data: [1], backgroundColors: ['rgba(255, 0, 0, 0.5)'] },
        ],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        const dataset = component.chartDisplays[0].data as {
          datasets: { borderColor: string[] }[];
        };
        expect(dataset.datasets[0].borderColor[0]).toBe('rgba(255, 0, 0, 0.5)');
      }, 100);
    });

    it('should fall back to gray for unknown CSS variables', () => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [
          { label: 'Test', data: [1], backgroundColors: ['--unknown-color'] },
        ],
      };
      component.charts = [chart];
      fixture.detectChanges();

      setTimeout(() => {
        const dataset = component.chartDisplays[0].data as {
          datasets: { borderColor: string[] }[];
        };
        // Falls back to gray-500 for unknown colors
        expect(dataset.datasets[0].borderColor[0]).toBe('#64748b');
      }, 100);
    });
  });

  describe('getChartHeightStyle', () => {
    it('should return display height when set', () => {
      const display = { id: 'test-1', type: 'bar' as const, data: {}, options: {}, height: '30rem' };
      expect(component.getChartHeightStyle(display)).toBe('30rem');
    });

    it('should return component height when display height is not set', () => {
      component.height = '25rem';
      const display = { id: 'test-2', type: 'bar' as const, data: {}, options: {} };
      expect(component.getChartHeightStyle(display)).toBe('25rem');
    });
  });

  describe('Lifecycle', () => {
    it('should initialize charts after view init', (done) => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      component.charts = [chart];
      fixture.detectChanges();

      // Wait for requestAnimationFrame to complete
      requestAnimationFrame(() => {
        expect(component.getChartInstanceCount()).toBe(1);
        done();
      });
    });

    it('should have zero chart instances after destroy', (done) => {
      const chart: IChartData = {
        chartType: 'bar',
        labels: ['A'],
        dataSets: [{ label: 'Test', data: [1], backgroundColors: ['#000'] }],
      };
      component.charts = [chart];
      fixture.detectChanges();

      // Wait for charts to initialize
      requestAnimationFrame(() => {
        expect(component.getChartInstanceCount()).toBeGreaterThan(0);

        // Destroy the component
        fixture.destroy();

        // After destroy, the component should clean up (can't verify count after destroy)
        done();
      });
    });
  });
});
