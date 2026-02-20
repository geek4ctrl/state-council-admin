import { 
  Component, 
  forwardRef, 
  input, 
  effect,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Quill from 'quill';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-rich-text-editor',
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ],
  template: `
    <div class="rich-text-editor-wrapper">
      @if (label()) {
        <label class="editor-label">{{ label() }}</label>
      }
      <div #toolbar class="editor-toolbar">
        <!-- Text formatting -->
        <button class="ql-bold" type="button" [attr.aria-label]="copy().editorBold"></button>
        <button class="ql-italic" type="button" [attr.aria-label]="copy().editorItalic"></button>
        <button class="ql-underline" type="button" [attr.aria-label]="copy().editorUnderline"></button>
        <button class="ql-strike" type="button" [attr.aria-label]="copy().editorStrike"></button>
        
        <span class="toolbar-separator"></span>
        
        <!-- Headings -->
        <select class="ql-header" [attr.aria-label]="copy().editorHeading">
          <option value="1">{{ copy().editorHeading1 }}</option>
          <option value="2">{{ copy().editorHeading2 }}</option>
          <option value="3">{{ copy().editorHeading3 }}</option>
          <option selected>{{ copy().editorNormal }}</option>
        </select>
        
        <span class="toolbar-separator"></span>
        
        <!-- Lists -->
        <button class="ql-list" value="ordered" type="button" [attr.aria-label]="copy().editorOrderedList"></button>
        <button class="ql-list" value="bullet" type="button" [attr.aria-label]="copy().editorBulletList"></button>
        
        <span class="toolbar-separator"></span>
        
        <!-- Alignment -->
        <select class="ql-align" [attr.aria-label]="copy().editorAlign">
          <option selected></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
        
        <span class="toolbar-separator"></span>
        
        <!-- Links and images -->
        <button class="ql-link" type="button" [attr.aria-label]="copy().editorLink"></button>
        <button class="ql-image" type="button" [attr.aria-label]="copy().editorImage"></button>
        
        <span class="toolbar-separator"></span>
        
        <!-- Code and quotes -->
        <button class="ql-blockquote" type="button" [attr.aria-label]="copy().editorBlockquote"></button>
        <button class="ql-code-block" type="button" [attr.aria-label]="copy().editorCodeBlock"></button>
        
        <span class="toolbar-separator"></span>
        
        <!-- Clear formatting -->
        <button class="ql-clean" type="button" [attr.aria-label]="copy().editorClearFormat"></button>
      </div>
      
      <div 
        #editor 
        class="editor-content"
        [class.is-disabled]="disabled()"
        [attr.aria-label]="placeholder()"
      ></div>
      
      @if (showCharCount()) {
        <div class="editor-footer">
          <span class="char-count">
            {{ characterCount() }} {{ copy().editorCharacters }}
          </span>
        </div>
      }
    </div>
  `,
  styles: [`
    .rich-text-editor-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .editor-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .editor-toolbar {
      background: var(--surface-alt);
      border: 1px solid var(--border);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }

    .toolbar-separator {
      width: 1px;
      height: 24px;
      background: var(--border);
      margin: 0 4px;
    }

    :host ::ng-deep .ql-toolbar button,
    :host ::ng-deep .ql-toolbar select {
      border: none;
      background: var(--surface);
      color: var(--text);
      border-radius: 4px;
      padding: 6px 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }

    :host ::ng-deep .ql-toolbar button:hover,
    :host ::ng-deep .ql-toolbar select:hover {
      background: var(--primary);
      color: white;
    }

    :host ::ng-deep .ql-toolbar button.ql-active,
    :host ::ng-deep .ql-toolbar select.ql-active {
      background: var(--primary);
      color: white;
    }

    :host ::ng-deep .ql-toolbar button svg,
    :host ::ng-deep .ql-toolbar select svg {
      width: 16px;
      height: 16px;
    }

    :host ::ng-deep .ql-toolbar .ql-stroke {
      stroke: currentColor;
    }

    :host ::ng-deep .ql-toolbar .ql-fill {
      fill: currentColor;
    }

    .editor-content {
      min-height: 300px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0 0 8px 8px;
      font-size: 14px;
      line-height: 1.6;
      color: var(--text);
    }

    .editor-content.is-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--surface-alt);
    }

    :host ::ng-deep .ql-container {
      font-family: inherit;
      font-size: 14px;
    }

    :host ::ng-deep .ql-editor {
      min-height: 300px;
      padding: 16px;
      color: var(--text);
    }

    :host ::ng-deep .ql-editor.ql-blank::before {
      color: var(--text-subtle);
      font-style: normal;
    }

    :host ::ng-deep .ql-editor h1 {
      font-size: 28px;
      font-weight: 600;
      margin: 16px 0;
      color: var(--text);
    }

    :host ::ng-deep .ql-editor h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 14px 0;
      color: var(--text);
    }

    :host ::ng-deep .ql-editor h3 {
      font-size: 20px;
      font-weight: 600;
      margin: 12px 0;
      color: var(--text);
    }

    :host ::ng-deep .ql-editor p {
      margin: 8px 0;
    }

    :host ::ng-deep .ql-editor ul,
    :host ::ng-deep .ql-editor ol {
      padding-left: 24px;
      margin: 8px 0;
    }

    :host ::ng-deep .ql-editor blockquote {
      border-left: 4px solid var(--primary);
      padding-left: 16px;
      margin: 16px 0;
      color: var(--text-muted);
      font-style: italic;
    }

    :host ::ng-deep .ql-editor pre {
      background: var(--surface-alt);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 12px;
      margin: 12px 0;
      overflow-x: auto;
    }

    :host ::ng-deep .ql-editor code {
      background: var(--surface-alt);
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 13px;
    }

    :host ::ng-deep .ql-editor a {
      color: var(--primary);
      text-decoration: underline;
    }

    :host ::ng-deep .ql-editor img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 12px 0;
    }

    .editor-footer {
      display: flex;
      justify-content: flex-end;
      padding: 8px 12px;
      background: var(--surface-alt);
      border: 1px solid var(--border);
      border-top: none;
      border-radius: 0 0 8px 8px;
      margin-top: -8px;
    }

    .char-count {
      font-size: 11px;
      color: var(--text-subtle);
    }

    @media (max-width: 768px) {
      .editor-toolbar {
        padding: 6px 8px;
      }

      :host ::ng-deep .ql-toolbar button,
      :host ::ng-deep .ql-toolbar select {
        padding: 4px 6px;
      }

      :host ::ng-deep .ql-editor {
        min-height: 200px;
      }
    }
  `]
})
export class RichTextEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('editor', { static: false }) editorElement!: ElementRef;
  @ViewChild('toolbar', { static: false }) toolbarElement!: ElementRef;

  private languageService = inject(LanguageService);
  protected copy = this.languageService.copy;

  label = input<string>('');
  placeholder = input<string>('Write your content here...');
  disabled = input<boolean>(false);
  showCharCount = input<boolean>(true);
  minHeight = input<number>(300);

  private quill?: Quill;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  protected characterCount = () => this.getCharacterCount();

  ngAfterViewInit(): void {
    this.initializeEditor();
  }

  ngOnDestroy(): void {
    if (this.quill) {
      this.quill.off('text-change');
    }
  }

  private initializeEditor(): void {
    if (!this.editorElement || !this.toolbarElement) {
      return;
    }

    this.quill = new Quill(this.editorElement.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: this.toolbarElement.nativeElement
      },
      placeholder: this.placeholder()
    });

    // Listen to content changes
    this.quill.on('text-change', () => {
      const html = this.quill?.root.innerHTML || '';
      this.onChange(html);
      this.onTouched();
    });

    // Set minimum height
    const editor = this.editorElement.nativeElement.querySelector('.ql-editor');
    if (editor) {
      editor.style.minHeight = `${this.minHeight()}px`;
    }
  }

  private getCharacterCount(): number {
    if (!this.quill) {
      return 0;
    }
    return this.quill.getText().trim().length;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (this.quill && value !== this.quill.root.innerHTML) {
      this.quill.root.innerHTML = value || '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.quill) {
      this.quill.enable(!isDisabled);
    }
  }

  // Public methods
  getContent(): string {
    return this.quill?.root.innerHTML || '';
  }

  setContent(html: string): void {
    if (this.quill) {
      this.quill.root.innerHTML = html;
    }
  }

  clear(): void {
    if (this.quill) {
      this.quill.setText('');
    }
  }

  focus(): void {
    if (this.quill) {
      this.quill.focus();
    }
  }
}
