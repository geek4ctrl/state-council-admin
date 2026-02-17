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
        @if (isEditMode()) {
          <h1>{{ copy().postFormEditTitle }}</h1>
        } @else {
          <h1>{{ copy().postFormNewTitle }}</h1>
        }
      </div>

      <div class="form-container">
        <form (ngSubmit)="onSubmit()">
          <div class="form-section">
            <div class="form-row">
              <div class="form-group">
                <label for="category">{{ copy().postFormCategoryLabel }}</label>
                <select
                  id="category"
                  [(ngModel)]="formData.category"
                  name="category"
                  required
                >
                  <option value="Event">{{ copy().postFormCategoryEvent }}</option>
                  <option value="Announcement">{{ copy().postFormCategoryAnnouncement }}</option>
                  <option value="News">{{ copy().postFormCategoryNews }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="status">Status</label>
                <select
                  id="status"
                  [(ngModel)]="formData.status"
                  name="status"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div class="form-group full-width">
              <label for="title">{{ copy().postFormTitleLabel }}</label>
              <input
                type="text"
                id="title"
                [(ngModel)]="formData.title"
                name="title"
                [placeholder]="copy().postFormTitlePlaceholder"
                required
              />
            </div>

            <div class="form-group full-width">
              <label for="imageUrl">{{ copy().postFormImageUrlLabel }}</label>
              <input
                type="url"
                id="imageUrl"
                [(ngModel)]="formData.imageUrl"
                name="imageUrl"
                [placeholder]="copy().postFormImagePlaceholder"
                required
              />
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
              <label for="excerpt">{{ copy().postFormExcerptLabel }}</label>
              <textarea
                id="excerpt"
                [(ngModel)]="formData.excerpt"
                name="excerpt"
                rows="2"
                [placeholder]="copy().postFormExcerptPlaceholder"
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
                required
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="date">{{ copy().postFormDateLabel }}</label>
                <input
                  type="date"
                  id="date"
                  [(ngModel)]="dateString"
                  name="date"
                  required
                />
              </div>

              <div class="form-group">
                <label for="time">{{ copy().postFormTimeLabel }}</label>
                <input
                  type="text"
                  id="time"
                  [(ngModel)]="formData.time"
                  name="time"
                  [placeholder]="copy().postFormTimePlaceholder"
                  required
                />
              </div>
            </div>

            <div class="form-group full-width">
              <label for="location">{{ copy().postFormLocationLabel }}</label>
              <input
                type="text"
                id="location"
                [(ngModel)]="formData.location"
                name="location"
                [placeholder]="copy().postFormLocationPlaceholder"
              />
            </div>

            <div class="form-group full-width">
              <label for="externalLink">{{ copy().postFormExternalLinkLabel }}</label>
              <input
                type="url"
                id="externalLink"
                [(ngModel)]="formData.externalLink"
                name="externalLink"
                [placeholder]="copy().postFormExternalLinkPlaceholder"
              />
            </div>

            <div class="form-group full-width">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.showOnHomePage"
                  name="showOnHomePage"
                />
                <span>{{ copy().postFormShowHome }}</span>
              </label>

              <label class="checkbox-label">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.showOnRegistration"
                  name="showOnRegistration"
                />
                <span>{{ copy().postFormShowRegistration }}</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onBack()">
              {{ copy().postFormCancel }}
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
    </div>
  `,
  styles: [`
    .post-form-page {
      max-width: 900px;
      margin: 0 auto;
    }

    .form-header {
      margin-bottom: 32px;
    }

    .btn-back {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 0;
      margin-bottom: 12px;
      display: block;
      transition: color 0.2s;
    }

    .btn-back:hover {
      color: var(--primary);
    }

    .form-header h1 {
      font-size: 30px;
      font-weight: 400;
      margin: 0;
      color: var(--text-muted);
    }

    .form-container {
      background: var(--surface);
      border-radius: 12px;
      padding: 32px;
      box-shadow: var(--shadow-soft);
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 24px;
      }

      .form-header h1 {
        font-size: 26px;
      }
    }

    @media (max-width: 640px) {
      .form-container {
        padding: 20px;
      }

      .form-header h1 {
        font-size: 22px;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
      }

      .image-preview {
        max-height: 200px;
      }
    }

    .form-section {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    @media (max-width: 768px) {
      .form-section {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr !important;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-row {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    input, select, textarea {
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 12px;
      font-family: inherit;
      transition: border-color 0.2s;
      background: var(--surface);
      color: var(--text);
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
    }

    textarea {
      resize: vertical;
    }

    .image-preview {
      margin-top: 12px;
      border-radius: 8px;
      overflow: hidden;
      max-height: 300px;
    }

    .image-preview img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      cursor: pointer;
      font-weight: 400;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(8, 145, 178, 0.2);
    }

    .btn-primary:hover {
      background: var(--primary-strong);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(8, 145, 178, 0.3);
    }

    .btn-secondary {
      background: var(--surface);
      color: var(--text-muted);
      border: 1px solid var(--border);
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: var(--surface-alt);
      border-color: var(--text-muted);
    }
  `]
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

  private editId: string | null = null;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editId = id;
      await this.loadBlog(id);
    } else {
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

      this.router.navigate(['/posts']);
    } catch {
      this.toastService.error(this.copy().postFormSaveError);
    }
  }

  protected onBack(): void {
    this.router.navigate(['/posts']);
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=Preview+Not+Available';
  }
}

