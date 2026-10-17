import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  QueryList,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { IButton } from '@shared/components/button/button.component';
import { ICheckbox } from '@shared/components/checkbox/checkbox.component';
import { CodeDisplayComponent } from '../code-display/code-display.component';
import {
  DemoOptionDirective,
  DemoOptionsDirective,
  DemoPreviewDirective,
  DemoUsageDirective,
} from './demo-option.directive';

@Component({
  selector: 'app-demo-playground',
  standalone: true,
  imports: [NgTemplateOutlet, IButton, ICheckbox, CodeDisplayComponent],
  templateUrl: './demo-playground.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './demo-playground.component.scss',
})
export class DemoPlaygroundComponent implements AfterContentInit {
  @Input() title = 'Component';
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
  readonly selectedKeys = signal<ReadonlySet<string>>(new Set());
  readonly showCode = signal(false);

  ngAfterContentInit(): void {
    const options = this.optionTemplates.toArray();
    this.options.set(options);
    this.selectedKeys.set(
      new Set(options.filter(option => option.selected).map(option => option.key)),
    );
  }

  isSelected(key: string): boolean {
    return this.selectedKeys().has(key);
  }

  setSelected(key: string, selected: boolean): void {
    this.selectedKeys.update(current => {
      const next = new Set(current);
      if (selected) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  get selectedOptions(): DemoOptionDirective[] {
    const selected = this.selectedKeys();
    return this.options().filter(option => selected.has(option.key));
  }

  get htmlCode(): string {
    if (this.sourceCode) return this.sourceCode;

    const options = this.selectedOptions;
    if (!options.length) return '<!-- Select an option to generate code. -->';

    return options
      .map(
        option =>
          `<!-- ${option.label} -->\n${option.code || '<!-- Example markup is not available. -->'}`,
      )
      .join('\n\n');
  }

  get typescriptCode(): string {
    if (this.tsCode) return this.tsCode;
    return this.joinCode(this.selectedOptions.map(option => option.tsCode));
  }

  get stylesheetCode(): string {
    if (this.scssCode) return this.scssCode;
    return this.joinCode(this.selectedOptions.map(option => option.scssCode));
  }

  private joinCode(snippets: string[]): string {
    return [...new Set(snippets.filter(Boolean))].join('\n\n');
  }
}
