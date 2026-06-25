import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { IButton } from '../../../../../invensys-ng/src/lib/components/button/button.component';

@Component({
  selector: 'app-code-display',
  imports: [IButton],
  template: `
    <div class="code-display-container">
      <div class="code-section">
        <div class="code-header">
          @if (showTabs && (tsCode || scssCode)) {
            <div class="tab-container">
              @if (sourceCode) {
                <i-button
                  [size]="'xtra-small'"
                  severity="primary"
                  [text]="true"
                  [class.active]="activeTab === 'html'"
                  (clicked)="activeTab = 'html'"
                  >
                  HTML
                </i-button>
              }
              @if (tsCode) {
                <i-button
                  [size]="'xtra-small'"
                  severity="primary"
                  [text]="true"
                  [class.active]="activeTab === 'ts'"
                  (clicked)="activeTab = 'ts'"
                  >
                  TypeScript
                </i-button>
              }
              @if (scssCode) {
                <i-button
                  [size]="'xtra-small'"
                  severity="primary"
                  [text]="true"
                  [class.active]="activeTab === 'scss'"
                  (clicked)="activeTab = 'scss'"
                  >
                  SCSS
                </i-button>
              }
            </div>
          }
          @if (!showTabs || (!tsCode && !scssCode)) {
            <span class="code-title">
              {{
              activeTab === 'html'
              ? 'HTML'
              : activeTab === 'ts'
              ? 'TypeScript'
              : 'SCSS'
              }}
            </span>
          }
          <i-button
            [size]="'small'"
            severity="secondary"
            [text]="true"
            (clicked)="copyCode()"
            [title]="'Copy code'"
            >
            <i class="pi pi-copy"></i>
          </i-button>
        </div>
        <div class="code-block">
          <div class="code-scroll" role="region" aria-label="Code block scroll">
            @if (activeTab === 'html') {
              <pre
                ><code [innerHTML]="formattedCode"></code></pre>
              }
              @if (activeTab === 'ts') {
                <pre
                  ><code [innerHTML]="formattedTsCode"></code></pre>
                }
                @if (activeTab === 'scss') {
                  <pre
                    ><code [innerHTML]="formattedScssCode"></code></pre>
                  }
                </div>
                <div class="scroll-indicator left" aria-hidden="true"></div>
                <div class="scroll-indicator right" aria-hidden="true"></div>
              </div>
            </div>
          </div>
    `,
  styleUrls: ['./code-display.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CodeDisplayComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() sourceCode: string = '';
  @Input() tsCode: string = '';
  @Input() scssCode: string = '';
  @Input() language: 'html' | 'ts' | 'scss' = 'html';
  @Input() showTabs: boolean = false;
  @ViewChild('uiContent', { static: false }) uiContent!: ElementRef;

  formattedCode: string = '';
  formattedTsCode: string = '';
  formattedScssCode: string = '';
  rawSourceCode: string = '';
  rawTsCode: string = '';
  rawScssCode: string = '';
  activeTab: 'html' | 'ts' | 'scss' = 'html';
  hasFluidComponents: boolean = false;
  private observer: MutationObserver | null = null;

  ngOnInit() {
    // Set activeTab based on language input
    this.activeTab = this.language;

    if (this.sourceCode) {
      this.rawSourceCode = this.sourceCode;

      // Format based on language parameter
      if (this.language === 'ts') {
        this.formattedTsCode = this.formatTypeScriptCode(this.sourceCode);
        this.rawTsCode = this.sourceCode;
      } else if (this.language === 'scss') {
        this.formattedScssCode = this.formatScssCode(this.sourceCode);
        this.rawScssCode = this.sourceCode;
      } else {
        this.formattedCode = this.formatSourceCode(this.sourceCode);
        this.detectFluidButtons();
      }
    }
    if (this.tsCode) {
      this.rawTsCode = this.tsCode;
      this.formattedTsCode = this.formatTypeScriptCode(this.tsCode);
      this.showTabs = true;
    }
    if (this.scssCode) {
      this.rawScssCode = this.scssCode;
      this.formattedScssCode = this.formatScssCode(this.scssCode);
      this.showTabs = true;
    }
  }

  ngAfterViewInit() {
    // Check for fluid buttons in the content
    this.detectFluidButtons();

    if (!this.sourceCode && this.uiContent) {
      // Fallback: generate code from DOM if no source code provided
      this.generateCode();
      this.setupMutationObserver();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private detectFluidButtons() {
    // Check if sourceCode contains fluid="true" or [fluid]="true"
    if (this.sourceCode) {
      this.hasFluidComponents =
        this.sourceCode.includes('fluid]="true"') ||
        this.sourceCode.includes('fluid="true"');
    } else {
      // Check DOM for fluid buttons
      setTimeout(() => {
        if (this.uiContent?.nativeElement) {
          const fluidButtons = this.uiContent.nativeElement.querySelectorAll(
            'i-button[ng-reflect-fluid="true"]'
          );
          this.hasFluidComponents = fluidButtons.length > 0;
        }
      }, 0);
    }
  }

  private setupMutationObserver() {
    if (!this.uiContent?.nativeElement) return;

    this.observer = new MutationObserver(() => {
      this.generateCode();
    });

    this.observer.observe(this.uiContent.nativeElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
    });
  }

  private generateCode() {
    if (!this.uiContent?.nativeElement) return;

    const htmlContent = this.uiContent.nativeElement.innerHTML;
    this.formattedCode = this.formatHtml(htmlContent);
  }

  private formatSourceCode(sourceCode: string): string {
    // Store the raw source code
    this.rawSourceCode = sourceCode;

    // Apply syntax highlighting to the source code
    return this.applySyntaxHighlighting(sourceCode);
  }

  private formatTypeScriptCode(tsCode: string): string {
    // Store the raw TypeScript code
    this.rawTsCode = tsCode;

    // Apply TypeScript syntax highlighting
    return this.applyTypeScriptHighlighting(tsCode);
  }

  private formatScssCode(scssCode: string): string {
    // Store the raw SCSS code
    this.rawScssCode = scssCode;

    // Apply SCSS syntax highlighting
    return this.applyScssHighlighting(scssCode);
  }

  private formatHtml(html: string): string {
    // Clean up the HTML and format it properly
    html = html.trim();

    // Remove Angular generated attributes and comments
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    html = html.replace(/\s+ng-reflect-\w+="[^"]*"/g, '');
    html = html.replace(/\s+_ngcontent-[^=]*="[^"]*"/g, '');
    html = html.replace(/\s+_nghost-[^=]*="[^"]*"/g, '');

    // Format the HTML with proper indentation
    const formatted = this.prettifyHtml(html);

    // Apply syntax highlighting
    return this.applySyntaxHighlighting(formatted);
  }

  private prettifyHtml(html: string): string {
    let result = '';
    let indent = 0;
    const tab = '  ';

    // Split by tags while preserving the tags
    const tokens = html.split(/(<[^>]*>)/);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim();
      if (!token) continue;

      if (token.startsWith('<')) {
        if (token.startsWith('</')) {
          // Closing tag - decrease indent
          indent = Math.max(0, indent - 1);
          result += tab.repeat(indent) + token + '\n';
        } else if (token.endsWith('/>')) {
          // Self-closing tag
          result += tab.repeat(indent) + token + '\n';
        } else {
          // Opening tag - add current indent then increase
          result += tab.repeat(indent) + token + '\n';
          indent++;
        }
      } else {
        // Text content
        if (token) {
          result += tab.repeat(indent) + token + '\n';
        }
      }
    }

    return result.trim();
  }

  private applySyntaxHighlighting(code: string): string {
    // Escape HTML first
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    // 1. HTML/XML tags (opening and closing)
    highlighted = highlighted.replace(
      /(&lt;\/?)([a-zA-Z][-a-zA-Z0-9]*)/g,
      '<span class="html-tag">$1$2</span>'
    );

    // 2. Closing brackets > and self-closing />
    highlighted = highlighted.replace(
      /(\s*\/?)(&gt;)/g,
      '<span class="html-tag">$1$2</span>'
    );

    // 3. Angular property bindings [property]="value"
    highlighted = highlighted.replace(
      /(\[[\w-]+\])(\s*=\s*)(&quot;[^&quot;]*&quot;)/g,
      '<span class="angular-binding">$1</span>$2<span class="html-attr-value">$3</span>'
    );

    // 4. Angular event bindings (event)="value"
    highlighted = highlighted.replace(
      /(\([\w-]+\))(\s*=\s*)(&quot;[^&quot;]*&quot;)/g,
      '<span class="angular-event">$1</span>$2<span class="html-attr-value">$3</span>'
    );

    // 5. Regular HTML attributes (not already processed)
    highlighted = highlighted.replace(
      /(\s)([a-zA-Z_:][-a-zA-Z0-9_:]*)(\s*=\s*)(&quot;[^&quot;]*&quot;)/g,
      function (match, space, attrName, equals, value) {
        // Don't replace if already wrapped in spans
        if (match.includes('<span')) {
          return match;
        }
        return `${space}<span class="html-attr-name">${attrName}</span>${equals}<span class="html-attr-value">${value}</span>`;
      }
    );

    // 6. Angular interpolation {{ ... }}
    highlighted = highlighted.replace(
      /({{[^}]*}})/g,
      '<span class="angular-interpolation">$1</span>'
    );

    // 7. Numbers
    highlighted = highlighted.replace(
      /\b(\d+)\b/g,
      '<span class="code-number">$1</span>'
    );

    return highlighted;
  }

  private applyTypeScriptHighlighting(code: string): string {
    // First, protect strings by temporarily replacing them with placeholders
    const stringMap = new Map();
    let stringCounter = 0;

    // Extract and replace all string literals
    let processed = code.replace(
      /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g,
      (match, quote, content) => {
        const placeholder = `__STRING_${stringCounter++}__`;
        stringMap.set(placeholder, match);
        return placeholder;
      }
    );

    // Extract and replace all comments
    const commentMap = new Map();
    let commentCounter = 0;
    processed = processed.replace(/(\/\/.*$)/gm, (match) => {
      const placeholder = `__COMMENT_${commentCounter++}__`;
      commentMap.set(placeholder, match);
      return placeholder;
    });

    // Now escape HTML in the remaining content
    processed = processed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // Apply highlighting to keywords, numbers, functions, etc.
    processed = processed.replace(
      /\b(import|from|export|class|interface|type|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|readonly|static|abstract|async|await|enum|namespace|module|declare)\b/g,
      '<span class="code-keyword">$1</span>'
    );

    processed = processed.replace(
      /\b(\d+)\b/g,
      '<span class="code-number">$1</span>'
    );

    processed = processed.replace(
      /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
      '<span class="code-function">$1</span>('
    );

    processed = processed.replace(
      /:\s*([A-Z][a-zA-Z0-9_$]*)/g,
      ': <span class="code-function">$1</span>'
    );

    // Restore comments with highlighting
    commentMap.forEach((original, placeholder) => {
      const highlighted = `<span class="code-comment">${original
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')}</span>`;
      processed = processed.replace(placeholder, highlighted);
    });

    // Restore strings with highlighting
    stringMap.forEach((original, placeholder) => {
      const highlighted = `<span class="code-string">${original
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')}</span>`;
      processed = processed.replace(placeholder, highlighted);
    });

    return processed;
  }

  private applyScssHighlighting(code: string): string {
    // First, protect strings by temporarily replacing them with placeholders
    const stringMap = new Map();
    let stringCounter = 0;

    // Extract and replace all string literals
    let processed = code.replace(
      /(["'])((?:\\.|(?!\1)[^\\])*)\1/g,
      (match, quote, content) => {
        const placeholder = `__STRING_${stringCounter++}__`;
        stringMap.set(placeholder, match);
        return placeholder;
      }
    );

    // Extract and replace all comments
    const commentMap = new Map();
    let commentCounter = 0;
    // Multi-line comments
    processed = processed.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
      const placeholder = `__COMMENT_${commentCounter++}__`;
      commentMap.set(placeholder, match);
      return placeholder;
    });
    // Single-line comments
    processed = processed.replace(/(\/\/.*$)/gm, (match) => {
      const placeholder = `__COMMENT_${commentCounter++}__`;
      commentMap.set(placeholder, match);
      return placeholder;
    });

    // Now escape HTML in the remaining content
    processed = processed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // SCSS @ directives and keywords
    processed = processed.replace(
      /(@use|@import|@mixin|@include|@extend|@if|@else|@for|@each|@while|@function|@return|@media|@keyframes|@supports)\b/g,
      '<span class="code-keyword">$1</span>'
    );

    // CSS properties (word followed by colon)
    processed = processed.replace(
      /\b([a-z-]+)(\s*:)/g,
      '<span class="scss-property">$1</span>$2'
    );

    // Class selectors
    processed = processed.replace(
      /(\.[a-zA-Z_-][a-zA-Z0-9_-]*)/g,
      '<span class="scss-selector">$1</span>'
    );

    // ID selectors
    processed = processed.replace(
      /(#[a-zA-Z_-][a-zA-Z0-9_-]*)/g,
      '<span class="scss-selector">$1</span>'
    );

    // Pseudo-classes and pseudo-elements
    processed = processed.replace(
      /(::?[a-z-]+)/g,
      '<span class="scss-pseudo">$1</span>'
    );

    // CSS variables
    processed = processed.replace(
      /(--[a-zA-Z0-9-]+)/g,
      '<span class="scss-variable">$1</span>'
    );

    // Color values (hex)
    processed = processed.replace(
      /(#[0-9a-fA-F]{3,8})\b/g,
      '<span class="code-number">$1</span>'
    );

    // Numbers with units
    processed = processed.replace(
      /\b(\d+(?:\.\d+)?)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch|vmin|vmax|s|ms)?\b/g,
      '<span class="code-number">$1$2</span>'
    );

    // Restore comments with highlighting
    commentMap.forEach((original, placeholder) => {
      const highlighted = `<span class="code-comment">${original
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')}</span>`;
      processed = processed.replace(placeholder, highlighted);
    });

    // Restore strings with highlighting
    stringMap.forEach((original, placeholder) => {
      const highlighted = `<span class="code-string">${original
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')}</span>`;
      processed = processed.replace(placeholder, highlighted);
    });

    return processed;
  }

  copyCode() {
    let codeToCopy = '';

    if (this.activeTab === 'html') {
      codeToCopy =
        this.sourceCode && this.rawSourceCode
          ? this.rawSourceCode
          : this.getCleanedHtml();
    } else if (this.activeTab === 'ts') {
      codeToCopy = this.rawTsCode;
    } else if (this.activeTab === 'scss') {
      codeToCopy = this.rawScssCode;
    }

    navigator.clipboard.writeText(codeToCopy).then(() => {
      console.log('Code copied to clipboard');
    });
  }

  private getCleanedHtml(): string {
    if (!this.uiContent?.nativeElement) return '';

    let htmlContent = this.uiContent.nativeElement.innerHTML;

    // Remove Angular generated attributes and comments
    htmlContent = htmlContent.replace(/<!--[\s\S]*?-->/g, '');
    htmlContent = htmlContent.replace(/\s+ng-reflect-\w+="[^"]*"/g, '');
    htmlContent = htmlContent.replace(/\s+_ngcontent-[^=]*="[^"]*"/g, '');
    htmlContent = htmlContent.replace(/\s+_nghost-[^=]*="[^"]*"/g, '');

    return this.prettifyHtml(htmlContent);
  }
}
