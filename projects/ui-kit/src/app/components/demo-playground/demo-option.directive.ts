import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[appDemoOption]',
  standalone: true,
})
export class DemoOptionDirective {
  @Input('appDemoOption') key = '';
  @Input() label = '';
  @Input() sourceCode = '';
  @Input() sourceCodeEncoded = '';
  @Input() tsCode = '';
  @Input() scssCode = '';
  @Input() selected = false;

  constructor(readonly templateRef: TemplateRef<unknown>) {}

  get code(): string {
    if (this.sourceCode) return this.sourceCode;
    if (!this.sourceCodeEncoded) return '';

    try {
      return decodeURIComponent(this.sourceCodeEncoded);
    } catch {
      return '';
    }
  }
}

@Directive({
  selector: 'ng-template[appDemoOptions]',
  standalone: true,
})
export class DemoOptionsDirective {
  constructor(readonly templateRef: TemplateRef<unknown>) {}
}

@Directive({
  selector: 'ng-template[appDemoPreview]',
  standalone: true,
})
export class DemoPreviewDirective {
  constructor(readonly templateRef: TemplateRef<unknown>) {}
}

@Directive({
  selector: 'ng-template[appDemoUsage]',
  standalone: true,
})
export class DemoUsageDirective {
  constructor(readonly templateRef: TemplateRef<unknown>) {}
}
