import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ITabs } from './tabs.component';
import { ITabPanel } from './tab-panel.component';

// Test host component
@Component({
  template: `
    <i-tabs [(activeIndex)]="activeIndex" (onChange)="onChange($event)">
      <i-tab-panel header="Tab 1">Content 1</i-tab-panel>
      <i-tab-panel header="Tab 2" icon="pi pi-user">Content 2</i-tab-panel>
      <i-tab-panel icon="pi pi-home">Content 3</i-tab-panel>
      <i-tab-panel header="Disabled" [disabled]="true">Disabled content</i-tab-panel>
    </i-tabs>
  `,
  standalone: true,
  imports: [ITabs, ITabPanel],
})
class TestHostComponent {
  activeIndex = 0;
  lastChangeEvent: { originalEvent: Event; index: number } | null = null;

  onChange(event: { originalEvent: Event; index: number }): void {
    this.lastChangeEvent = event;
  }
}

describe('ITabs', () => {
  let component: ITabs;
  let fixture: ComponentFixture<ITabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITabs, ITabPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ITabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default values', () => {
    it('should have default activeIndex of 0', () => {
      expect(component.activeIndex).toBe(0);
    });

    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-tabs-');
    });
  });
});

describe('ITabs with host', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let tabsElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    tabsElement = fixture.debugElement.query(By.directive(ITabs));
  });

  it('should create host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  describe('Tab rendering', () => {
    it('should render all tabs', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      expect(tabs.length).toBe(4);
    });

    it('should render text-only tab correctly', () => {
      const firstTab = fixture.debugElement.query(
        By.css('.i-tabs__tab')
      );
      const label = firstTab.query(By.css('.i-tabs__tab-label'));
      const icon = firstTab.query(By.css('.i-tabs__tab-icon'));
      expect(label.nativeElement.textContent).toBe('Tab 1');
      expect(icon).toBeNull();
    });

    it('should render icon + text tab correctly', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      const secondTab = tabs[1];
      const label = secondTab.query(By.css('.i-tabs__tab-label'));
      const icon = secondTab.query(By.css('.i-tabs__tab-icon'));
      expect(label.nativeElement.textContent).toBe('Tab 2');
      expect(icon).toBeTruthy();
      expect(icon.nativeElement.classList.contains('pi-user')).toBe(true);
    });

    it('should render icon-only tab correctly', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      const thirdTab = tabs[2];
      const label = thirdTab.query(By.css('.i-tabs__tab-label'));
      const icon = thirdTab.query(By.css('.i-tabs__tab-icon'));
      expect(label).toBeNull();
      expect(icon).toBeTruthy();
      expect(icon.nativeElement.classList.contains('pi-home')).toBe(true);
      expect(thirdTab.nativeElement.classList.contains('i-tabs__tab--icon-only')).toBe(true);
    });
  });

  describe('Tab selection', () => {
    it('should mark first tab as active by default', () => {
      const firstTab = fixture.debugElement.query(
        By.css('.i-tabs__tab')
      );
      expect(
        firstTab.nativeElement.classList.contains('i-tabs__tab--active')
      ).toBe(true);
    });

    it('should change active tab on click', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      tabs[1].nativeElement.click();
      fixture.detectChanges();

      expect(hostComponent.activeIndex).toBe(1);
      expect(
        tabs[1].nativeElement.classList.contains('i-tabs__tab--active')
      ).toBe(true);
    });

    it('should emit onChange event when tab is clicked', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      tabs[1].nativeElement.click();
      fixture.detectChanges();

      expect(hostComponent.lastChangeEvent).toBeTruthy();
      expect(hostComponent.lastChangeEvent?.index).toBe(1);
    });

    it('should not change tab when disabled tab is clicked', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      tabs[3].nativeElement.click();
      fixture.detectChanges();

      expect(hostComponent.activeIndex).toBe(0);
    });
  });

  describe('Tab content', () => {
    it('should show content of active tab', () => {
      const panels = fixture.debugElement.queryAll(
        By.css('.i-tabs__panel')
      );
      const activePanel = panels.find((p) =>
        p.nativeElement.classList.contains('i-tabs__panel--active')
      );
      expect(activePanel?.nativeElement.textContent.trim()).toBe('Content 1');
    });

    it('should switch content when tab changes', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      tabs[1].nativeElement.click();
      fixture.detectChanges();

      const panels = fixture.debugElement.queryAll(
        By.css('.i-tabs__panel')
      );
      const activePanel = panels.find((p) =>
        p.nativeElement.classList.contains('i-tabs__panel--active')
      );
      expect(activePanel?.nativeElement.textContent.trim()).toBe('Content 2');
    });
  });

  describe('Accessibility', () => {
    it('should have role="tablist" on header', () => {
      const header = fixture.debugElement.query(
        By.css('.i-tabs__header')
      );
      expect(header.nativeElement.getAttribute('role')).toBe('tablist');
    });

    it('should have role="tab" on tabs', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      tabs.forEach((tab) => {
        expect(tab.nativeElement.getAttribute('role')).toBe('tab');
      });
    });

    it('should have role="tabpanel" on panels', () => {
      const panels = fixture.debugElement.queryAll(
        By.css('.i-tabs__panel')
      );
      panels.forEach((panel) => {
        expect(panel.nativeElement.getAttribute('role')).toBe('tabpanel');
      });
    });

    it('should set aria-selected on active tab', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      expect(tabs[0].nativeElement.getAttribute('aria-selected')).toBe('true');
      expect(tabs[1].nativeElement.getAttribute('aria-selected')).toBe('false');
    });

    it('should set tabindex correctly', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      expect(tabs[0].nativeElement.getAttribute('tabindex')).toBe('0');
      expect(tabs[1].nativeElement.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Disabled state', () => {
    it('should add disabled class to disabled tabs', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      expect(
        tabs[3].nativeElement.classList.contains('i-tabs__tab--disabled')
      ).toBe(true);
    });

    it('should set disabled attribute on disabled tabs', () => {
      const tabs = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab')
      );
      expect(tabs[3].nativeElement.disabled).toBe(true);
    });
  });
});

describe('ITabPanel', () => {
  let component: ITabPanel;
  let fixture: ComponentFixture<ITabPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITabPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ITabPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default values', () => {
    it('should have default disabled value of false', () => {
      expect(component.disabled).toBe(false);
    });

    it('should have default closable value of false', () => {
      expect(component.closable).toBe(false);
    });

    it('should have undefined header by default', () => {
      expect(component.header).toBeUndefined();
    });

    it('should have undefined icon by default', () => {
      expect(component.icon).toBeUndefined();
    });
  });

  describe('Inputs', () => {
    it('should accept header input', () => {
      component.header = 'Test Header';
      fixture.detectChanges();
      expect(component.header).toBe('Test Header');
    });

    it('should accept icon input', () => {
      component.icon = 'pi pi-home';
      fixture.detectChanges();
      expect(component.icon).toBe('pi pi-home');
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });

    it('should accept closable input', () => {
      component.closable = true;
      fixture.detectChanges();
      expect(component.closable).toBe(true);
    });
  });

  it('should have content template', () => {
    expect(component.contentTemplate).toBeTruthy();
  });
});
