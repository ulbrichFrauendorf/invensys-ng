import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  QueryList,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { IButton } from '@shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { IRadioButton } from '@shared/components/radio-button/radio-button.component';
import { UniqueComponentId } from '@shared/utils/uniquecomponentid';
import { CodeDisplayComponent } from '../code-display/code-display.component';
import { PageLayoutComponent } from '@shared/components/page-layout/page-layout.component';
import {
  PageHeaderActionsDirective,
  PageSidebarDirective,
} from '@shared/components/page-layout/page-layout-slots.directive';
import {
  DemoOptionDirective,
  DemoOptionsDirective,
  DemoPreviewDirective,
  DemoUsageDirective,
} from './demo-option.directive';

@Component({
  selector: 'app-demo-playground',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    IButton,
    FormsModule,
    IRadioButton,
    CodeDisplayComponent,
    PageLayoutComponent,
    PageHeaderActionsDirective,
    PageSidebarDirective,
  ],
  templateUrl: './demo-playground.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './demo-playground.component.scss',
})
export class DemoPlaygroundComponent implements AfterContentInit {
  @Input() title = 'Component';
  @Input() eyebrow = '';
  @Input() description = '';
  @Input() sourceCode = '';
  @Input() tsCode = '';
  @Input() scssCode = '';
  @Input() language: 'html' | 'ts' | 'scss' = 'html';

  @ContentChildren(DemoOptionDirective)
  optionTemplates!: QueryList<DemoOptionDirective>;
  @ContentChild(DemoOptionsDirective) customOptions?: DemoOptionsDirective;
  @ContentChild(DemoPreviewDirective) customPreview?: DemoPreviewDirective;
  @ContentChild(DemoUsageDirective) usageNotes?: DemoUsageDirective;

  readonly options = signal<DemoOptionDirective[]>([]);
  readonly selectedKey = signal<string | null>(null);
  readonly optionGroupName = UniqueComponentId('demo-options-');
  readonly showCode = signal(false);

  ngAfterContentInit(): void {
    const options = this.optionTemplates.toArray();
    this.options.set(options);
    this.selectedKey.set((options.find((option) => option.selected) ?? options[0])?.key ?? null);
  }

  readonly selectedOption = computed(() =>
    this.options().find((option) => option.key === this.selectedKey()),
  );

  htmlCode(): string {
    return this.sourceCode || this.selectedOption()?.code || '';
  }

  typescriptCode(): string {
    return this.tsCode || this.selectedOption()?.tsCode || '';
  }

  stylesheetCode(): string {
    return this.scssCode || this.selectedOption()?.scssCode || '';
  }
}
