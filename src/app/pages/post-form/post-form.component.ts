import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';
import { BlogCategory } from '../../models/blog.model';

@Component({
  selector: 'app-post-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="post-form-page">
      <div class="form-header">
        <button class="btn-back" (click)="onBack()">{{ copy().postFormBack }}</button>
        <div class="header-content">
          <div class="title-block">
            @if (isEditMode()) {
              <h1>{{ copy().postFormEditTitle }}</h1>
            } @else {
              <h1>{{ copy().postFormNewTitle }}</h1>
            }
            <p class="subtitle">{{ copy().postFormSubtitle }}</p>
          </div>
          <div class="status-group">
            <span class="status-label">{{ copy().postFormStatusLabel }}</span>
            <div class="status-pills" role="radiogroup" [attr.aria-label]="copy().postFormStatusLabel">
              <button
                type="button"
                class="status-pill is-draft"
                [class.is-active]="formData.status === 'draft'"
                [attr.aria-pressed]="formData.status === 'draft'"
                (click)="setStatus('draft')"
              >
                {{ copy().postsFilterDraft }}
              </button>
              <button
                type="button"
                class="status-pill is-review"
                [class.is-active]="formData.status === 'review'"
                [attr.aria-pressed]="formData.status === 'review'"
                (click)="setStatus('review')"
              >
                {{ copy().postsFilterReview }}
              </button>
              <button
                type="button"
                class="status-pill is-published"
                [class.is-active]="formData.status === 'published'"
                [attr.aria-pressed]="formData.status === 'published'"
                (click)="setStatus('published')"
              >
                {{ copy().postsFilterPublished }}
              </button>
            </div>
            <span class="status-hint">{{ copy().postFormStatusHint }}</span>
          </div>
        </div>
      </div>

      <div class="form-container">
        <form (ngSubmit)="onSubmit()">
          <div class="form-shell">
            <div class="form-panel">
              <section class="form-section">
                <h2 class="section-title">{{ copy().postFormSectionContent }}</h2>
                <div class="form-group full-width">
                  <label for="title" class="label-row">
                    <span>{{ copy().postFormTitleLabel }}</span>
                    <span class="char-count">{{ formData.title.length }}/{{ titleMax }}</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    [(ngModel)]="formData.title"
                    name="title"
                    [placeholder]="copy().postFormTitlePlaceholder"
                    maxlength="{{ titleMax }}"
                    (ngModelChange)="onFormChange()"
                    required
                  />
                </div>

                <div class="form-group full-width">
                  <label for="excerpt" class="label-row">
                    <span>{{ copy().postFormExcerptLabel }}</span>
                    <span class="char-count">{{ formData.excerpt.length }}/{{ excerptMax }}</span>
                  </label>
                  <textarea
                    id="excerpt"
                    [(ngModel)]="formData.excerpt"
                    name="excerpt"
                    rows="2"
                    [placeholder]="copy().postFormExcerptPlaceholder"
                    maxlength="{{ excerptMax }}"
                    (ngModelChange)="onFormChange()"
                    required
                  ></textarea>
                </div>

                <div class="form-group full-width">
                  <label for="content">{{ copy().postFormContentLabel }}</label>
                  <textarea
                    id="content"
                    [(ngModel)]="formData.content"
                    name="content"
                    rows="8"
                    [placeholder]="copy().postFormContentPlaceholder"
                    (ngModelChange)="onFormChange()"
                    required
                  ></textarea>
                </div>
              </section>

              <section class="form-section">
                <h2 class="section-title">{{ copy().postFormSectionPublish }}</h2>
                <div class="form-row">
                  <div class="form-group">
                    <label for="category">{{ copy().postFormCategoryLabel }}</label>
                    <select
                      id="category"
                      [(ngModel)]="formData.category"
                      name="category"
                      (ngModelChange)="onFormChange()"
                      required
                    >
                      <option value="Event">{{ copy().postFormCategoryEvent }}</option>
                      <option value="Announcement">{{ copy().postFormCategoryAnnouncement }}</option>
                      <option value="News">{{ copy().postFormCategoryNews }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="date">{{ copy().postFormDateLabel }}</label>
                    <input
                      type="date"
                      id="date"
                      [(ngModel)]="dateString"
                      name="date"
                      (ngModelChange)="onFormChange()"
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="time">{{ copy().postFormTimeLabel }}</label>
                    <input
                      type="text"
                      id="time"
                      [(ngModel)]="formData.time"
                      name="time"
                      [placeholder]="copy().postFormTimePlaceholder"
                      (ngModelChange)="onFormChange()"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="location">{{ copy().postFormLocationLabel }}</label>
                    <input
                      type="text"
                      id="location"
                      [(ngModel)]="formData.location"
                      name="location"
                      [placeholder]="copy().postFormLocationPlaceholder"
                      (ngModelChange)="onFormChange()"
                    />
                  </div>
                </div>

                <div class="form-group full-width">
                  <label for="imageUrl">{{ copy().postFormImageUrlLabel }}</label>
                  <input
                    type="url"
                    id="imageUrl"
                    [(ngModel)]="formData.imageUrl"
                    name="imageUrl"
                    [placeholder]="copy().postFormImagePlaceholder"
                    (ngModelChange)="onFormChange()"
                    required
                  />
                  <p class="field-help">{{ copy().postFormImageHelp }}</p>
                  @if (formData.imageUrl && !isImageUrlValid()) {
                    <p class="field-warning">{{ copy().postFormImageInvalid }}</p>
                  }
                  @if (formData.imageUrl) {
                    <div class="image-preview">
                      <img
                        [src]="formData.imageUrl"
                        [alt]="copy().postFormImagePreviewAlt"
                        loading="eager"
                        decoding="async"
                        (error)="onImageError($event)"
                      />
                    </div>
                  }
                </div>

                <div class="form-group full-width">
                  <label for="externalLink">{{ copy().postFormExternalLinkLabel }}</label>
                  <input
                    type="url"
                    id="externalLink"
                    [(ngModel)]="formData.externalLink"
                    name="externalLink"
                    [placeholder]="copy().postFormExternalLinkPlaceholder"
                    (ngModelChange)="onFormChange()"
                  />
                  <p class="field-help">{{ copy().postFormExternalLinkHelp }}</p>
                </div>
              </section>

              <section class="form-section">
                <h2 class="section-title">{{ copy().postFormSectionVisibility }}</h2>
                <div class="form-group full-width checkbox-group">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      [(ngModel)]="formData.showOnHomePage"
                      name="showOnHomePage"
                      (ngModelChange)="onFormChange()"
                    />
                    <span>{{ copy().postFormShowHome }}</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      [(ngModel)]="formData.showOnRegistration"
                      name="showOnRegistration"
                      (ngModelChange)="onFormChange()"
                    />
                    <span>{{ copy().postFormShowRegistration }}</span>
                  </label>
                </div>
              </section>
            </div>

            <aside class="preview-panel" aria-label="{{ copy().postFormPreviewTitle }}">
              <h3 class="preview-title">{{ copy().postFormPreviewTitle }}</h3>
              <p class="preview-subtitle">{{ copy().postFormPreviewSubtitle }}</p>
              <div class="preview-card">
                <div class="preview-image">
                  <img
                    [src]="previewImageUrl()"
                    [alt]="copy().postFormImagePreviewAlt"
                    loading="lazy"
                    decoding="async"
                    (error)="onPreviewImageError($event)"
                  />
                </div>
                <div class="preview-body">
                  <div class="preview-meta">
                    <span class="preview-category">{{ formData.category }}</span>
                    <span
                      class="preview-status"
                      [class.is-draft]="formData.status === 'draft'"
                      [class.is-review]="formData.status === 'review'"
                      [class.is-published]="formData.status === 'published'"
                    >
                      {{ statusLabel(formData.status) }}
                    </span>
                  </div>
                  <h4>{{ formData.title || copy().postFormPreviewTitlePlaceholder }}</h4>
                  <p>{{ formData.excerpt || copy().postFormPreviewExcerptPlaceholder }}</p>
                </div>
              </div>
              <button class="btn-secondary btn-preview" type="button" (click)="openPreview()">
                {{ copy().postFormPreviewButton }}
              </button>
            </aside>
          </div>

          <div class="sticky-actions">
            <button type="button" class="btn-secondary" (click)="onBack()">
              {{ copy().postFormCancel }}
            </button>
            <button type="button" class="btn-secondary" (click)="submitWithStatus('draft')">
              {{ copy().postFormSaveDraft }}
            </button>
            <button type="submit" class="btn-primary">
              @if (isEditMode()) {
                <span>{{ copy().postFormUpdate }}</span>
              } @else {
                <span>{{ copy().postFormPublish }}</span>
              }
            </button>
          </div>
        </form>
      </div>

      @if (isPreviewOpen()) {
        <div class="preview-modal" role="dialog" aria-modal="true" [attr.aria-label]="copy().postFormPreviewTitle">
          <div class="modal-backdrop" (click)="closePreview()"></div>
          <div class="modal-card">
            <div class="modal-header">
              <div>
                <h2>{{ formData.title || copy().postFormPreviewTitlePlaceholder }}</h2>
                <p>{{ copy().postFormPreviewSubtitle }}</p>
              </div>
              <button type="button" class="btn-icon" (click)="closePreview()" [attr.aria-label]="copy().postFormPreviewClose">
                ×
              </button>
            </div>
            <div class="modal-body">
              <img
                class="modal-image"
                [src]="previewImageUrl()"
                [alt]="copy().postFormImagePreviewAlt"
                loading="lazy"
                decoding="async"
                (error)="onPreviewImageError($event)"
              />
              <div class="modal-meta">
                <span class="preview-category">{{ formData.category }}</span>
                <span
                  class="preview-status"
                  [class.is-draft]="formData.status === 'draft'"
                  [class.is-review]="formData.status === 'review'"
                  [class.is-published]="formData.status === 'published'"
                >
                  {{ statusLabel(formData.status) }}
                </span>
              </div>
              <p class="modal-excerpt">{{ formData.excerpt || copy().postFormPreviewExcerptPlaceholder }}</p>
              <div class="modal-content">{{ formData.content || copy().postFormPreviewContentPlaceholder }}</div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class PostFormComponent implements OnInit {
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private languageService = inject(LanguageService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected copy = this.languageService.copy;

  protected isEditMode = signal(false);
  protected dateString = '';

  protected formData = {
    title: '',
    content: '',
    excerpt: '',
    category: 'Event' as BlogCategory,
    imageUrl: '',
    date: new Date(),
    time: '',
    location: '',
    externalLink: '',
    showOnHomePage: false,
    showOnRegistration: false,
    status: 'draft' as 'draft' | 'review' | 'published'
  };

  protected titleMax = 120;
  protected excerptMax = 180;
  protected isPreviewOpen = signal(false);

  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;
  private autosaveKey = 'post-form-draft';

  private editId: string | null = null;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editId = id;
      await this.loadBlog(id);
    } else {
      this.loadDraft();
      // Set default date to today
      const today = new Date();
      this.dateString = today.toISOString().split('T')[0];
      this.formData.date = today;
    }
  }

  private async loadBlog(id: string): Promise<void> {
    try {
      const blog = await this.blogService.fetchBlogById(id);
      if (blog) {
        this.formData = {
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          category: blog.category,
          imageUrl: blog.imageUrl,
          date: new Date(blog.date),
          time: blog.time,
          location: blog.location || '',
          externalLink: blog.externalLink || '',
          showOnHomePage: blog.showOnHomePage,
          showOnRegistration: blog.showOnRegistration,
          status: blog.status
        };
        this.dateString = new Date(blog.date).toISOString().split('T')[0];
        return;
      }

      this.toastService.error(this.copy().postFormNotFound);
      this.router.navigate(['/posts']);
    } catch {
      this.toastService.error(this.copy().postFormLoadError);
      this.router.navigate(['/posts']);
    }
  }

  protected async onSubmit(): Promise<void> {
    // Update date from string input
    this.formData.date = new Date(this.dateString);

    const user = this.authService.getCurrentUser()();
    if (!user) {
      this.toastService.error(this.copy().postFormAuthRequired);
      return;
    }

    try {
      if (this.isEditMode() && this.editId) {
        await this.blogService.updateBlog(this.editId, this.formData);
        this.toastService.success(this.copy().postFormUpdateSuccess);
      } else {
        await this.blogService.createBlog(this.formData, user.id, user.name);
        this.toastService.success(this.copy().postFormCreateSuccess);
      }

      this.clearDraft();

      this.router.navigate(['/posts']);
    } catch {
      this.toastService.error(this.copy().postFormSaveError);
    }
  }

  protected onBack(): void {
    this.router.navigate(['/posts']);
  }

  protected submitWithStatus(status: 'draft' | 'review' | 'published'): void {
    this.formData.status = status;
    this.onSubmit();
  }

  protected setStatus(status: 'draft' | 'review' | 'published'): void {
    this.formData.status = status;
    this.onFormChange();
  }

  protected statusLabel(status: 'draft' | 'review' | 'published'): string {
    const copy = this.copy();
    switch (status) {
      case 'draft':
        return copy.postsFilterDraft;
      case 'review':
        return copy.postsFilterReview;
      case 'published':
        return copy.postsFilterPublished;
      default:
        return status;
    }
  }

  protected previewImageUrl(): string {
    return this.formData.imageUrl || this.previewFallback();
  }

  protected onPreviewImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.previewFallback();
  }

  protected openPreview(): void {
    this.isPreviewOpen.set(true);
  }

  protected closePreview(): void {
    this.isPreviewOpen.set(false);
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=Preview+Not+Available';
  }

  protected onFormChange(): void {
    if (this.isEditMode()) {
      return;
    }

    if (this.formData.status !== 'draft') {
      return;
    }

    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
    }

    this.autosaveTimer = setTimeout(() => {
      const draft = {
        ...this.formData,
        date: this.dateString,
      };
      localStorage.setItem(this.autosaveKey, JSON.stringify(draft));
    }, 600);
  }

  protected isImageUrlValid(): boolean {
    if (!this.formData.imageUrl) {
      return true;
    }

    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(this.formData.imageUrl);
  }

  private loadDraft(): void {
    const raw = localStorage.getItem(this.autosaveKey);
    if (!raw) {
      return;
    }

    try {
      const draft = JSON.parse(raw) as typeof this.formData & { date?: string };
      this.formData = {
        ...this.formData,
        ...draft,
        date: draft.date ? new Date(draft.date) : this.formData.date,
      };
      if (draft.date) {
        this.dateString = draft.date;
      }
    } catch {
      this.clearDraft();
    }
  }

  private clearDraft(): void {
    localStorage.removeItem(this.autosaveKey);
  }

  private previewFallback(): string {
    const text = encodeURIComponent(this.copy().postFormPreviewImageFallback);
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%23f1f5f9"/><stop offset="1" stop-color="%23e2e8f0"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><rect x="210" y="140" width="180" height="120" rx="16" fill="%23e2e8f0" stroke="%23cbd5f5" stroke-width="2"/><circle cx="255" cy="180" r="14" fill="%2394a3b8"/><path d="M230 230l35-35 25 25 30-30 50 40" fill="none" stroke="%2394a3b8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="290" text-anchor="middle" font-family="Segoe UI, Arial" font-size="16" fill="%2394a3b8">${text}</text></svg>`;
  }
}

