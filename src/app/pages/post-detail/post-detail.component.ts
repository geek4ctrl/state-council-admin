import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';
import { ConfirmationService } from '../../services/confirmation.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule],
  template: `
    @if (blog(); as blog) {
      <div class="post-detail">
        <div class="post-header">
          <button class="btn-back" (click)="onBack()">{{ copy().postDetailBack }}</button>
          <div class="post-actions">
            <button class="btn-secondary" (click)="onEdit()">{{ copy().postDetailEdit }}</button>
            <button class="btn-danger" (click)="onDelete()">{{ copy().postDetailDelete }}</button>
          </div>
        </div>

        <div class="post-content">
          <span class="post-category">{{ blog.category }}</span>
          <h1>{{ blog.title }}</h1>

          <div class="post-meta">
            <span>📅 {{ formatDate(blog.date) }}</span>
            <span>⏰ {{ blog.time }}</span>
            @if (blog.location) {
              <span>📍 {{ blog.location }}</span>
            }
            <span>✍️ {{ blog.authorName }}</span>
          </div>

          <div class="post-image">
            <img
              [src]="blog.imageUrl"
              [alt]="blog.title"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              (error)="onImageError($event)"
            />
          </div>

          <div class="post-body">
            <p class="post-excerpt">{{ blog.excerpt }}</p>
            <div class="post-text" [innerHTML]="blog.content"></div>
          </div>

          @if (blog.externalLink) {
            <div class="post-link">
              <a [href]="blog.externalLink" target="_blank" rel="noopener">
                {{ copy().postDetailExternalLink }}
              </a>
            </div>
          }

          <div class="post-flags">
            @if (blog.showOnHomePage) {
              <span class="flag">{{ copy().postDetailShownHome }}</span>
            }
            @if (blog.showOnRegistration) {
              <span class="flag">{{ copy().postDetailShownRegistration }}</span>
            }
          </div>

          <div class="post-footer">
            <p class="post-dates">
              {{ copy().postDetailCreated }} {{ formatDateTime(blog.createdAt) }} |
              {{ copy().postDetailUpdated }} {{ formatDateTime(blog.updatedAt) }}
            </p>
          </div>
        </div>
      </div>
    } @else {
      <div class="error-state">
        <h2>{{ copy().postDetailNotFound }}</h2>
        <button class="btn-primary" (click)="onBack()">{{ copy().postDetailGoBack }}</button>
      </div>
    }
  `,
  styles: [`
    .post-detail {
      max-width: 900px;
      margin: 0 auto;
    }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .btn-back {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 12px;
      cursor: pointer;
      padding: 8px 0;
    }

    .btn-back:hover {
      text-decoration: underline;
    }

    .post-actions {
      display: flex;
      gap: 12px;
    }

    .btn-secondary, .btn-danger {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: var(--surface);
      color: var(--primary);
      border: 1px solid var(--primary);
    }

    .btn-secondary:hover {
      background: color-mix(in srgb, var(--primary) 12%, var(--surface));
    }

    .btn-danger {
      background: var(--surface);
      color: var(--danger);
      border: 1px solid var(--danger);
    }

    .btn-danger:hover {
      background: color-mix(in srgb, var(--danger) 12%, var(--surface));
    }

    .post-content {
      background: var(--surface);
      border-radius: 12px;
      padding: 48px;
      box-shadow: var(--shadow-soft);
    }

    .post-category {
      display: inline-block;
      background: var(--primary);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 34px;
      font-weight: 700;
      margin: 0 0 24px 0;
      color: var(--text);
      line-height: 1.3;
    }

    .post-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }

    .post-image {
      margin-bottom: 32px;
      border-radius: 12px;
      overflow: hidden;
    }

    .post-image img {
      width: 100%;
      height: auto;
      display: block;
    }

    .post-body {
      margin-bottom: 32px;
    }

    .post-excerpt {
      font-size: 16px;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .post-text {
      font-size: 14px;
      color: var(--text);
      line-height: 1.8;
    }

    .post-text :deep(h1) {
      font-size: 28px;
      font-weight: 600;
      margin: 24px 0 16px;
      color: var(--text);
    }

    .post-text :deep(h2) {
      font-size: 24px;
      font-weight: 600;
      margin: 20px 0 14px;
      color: var(--text);
    }

    .post-text :deep(h3) {
      font-size: 20px;
      font-weight: 600;
      margin: 18px 0 12px;
      color: var(--text);
    }

    .post-text :deep(p) {
      margin: 12px 0;
      line-height: 1.8;
    }

    .post-text :deep(strong) {
      font-weight: 600;
      color: var(--text);
    }

    .post-text :deep(em) {
      font-style: italic;
    }

    .post-text :deep(u) {
      text-decoration: underline;
    }

    .post-text :deep(s) {
      text-decoration: line-through;
    }

    .post-text :deep(ul),
    .post-text :deep(ol) {
      margin: 16px 0;
      padding-left: 32px;
    }

    .post-text :deep(li) {
      margin: 8px 0;
      line-height: 1.6;
    }

    .post-text :deep(blockquote) {
      border-left: 4px solid var(--primary);
      padding-left: 20px;
      margin: 20px 0;
      color: var(--text-muted);
      font-style: italic;
    }

    .post-text :deep(pre) {
      background: var(--surface-alt);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 16px;
      margin: 16px 0;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }

    .post-text :deep(code) {
      background: var(--surface-alt);
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }

    .post-text :deep(pre code) {
      background: none;
      padding: 0;
    }

    .post-text :deep(a) {
      color: var(--primary);
      text-decoration: underline;
    }

    .post-text :deep(a:hover) {
      color: var(--primary-strong);
    }

    .post-text :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 20px 0;
      display: block;
    }

    .post-link {
      margin-bottom: 24px;
      padding: 16px;
      background: var(--surface-alt);
      border-radius: 8px;
    }

    .post-link a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }

    .post-link a:hover {
      text-decoration: underline;
    }

    .post-flags {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 32px;
    }

    .flag {
      background: color-mix(in srgb, var(--success) 18%, var(--surface));
      color: var(--success);
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }

    .post-footer {
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }

    .post-dates {
      font-size: 11px;
      color: var(--text-muted);
      margin: 0;
    }

    .error-state {
      text-align: center;
      padding: 64px 20px;
    }

    .error-state h2 {
      font-size: 22px;
      margin-bottom: 24px;
      color: #6c757d;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary:hover {
      background: #0056b3;
    }
  `]
})
export class PostDetailComponent implements OnInit {
  private blogService = inject(BlogService);
  private languageService = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private toastService = inject(ToastService);

  protected copy = this.languageService.copy;

  protected blog = signal<Blog | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const foundBlog = await this.blogService.fetchBlogById(id);
        this.blog.set(foundBlog);
      } catch {
        this.toastService.error(this.copy().postDetailLoadError);
        this.blog.set(undefined);
      }
    }
  }

  protected formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.languageService.locale(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  protected formatDateTime(date: Date): string {
    return new Date(date).toLocaleString(this.languageService.locale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  protected onBack(): void {
    this.router.navigate(['/posts']);
  }

  protected onEdit(): void {
    const blog = this.blog();
    if (blog) {
      this.router.navigate(['/posts/edit', blog.id]);
    }
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/800x500/e5e7eb/6b7280?text=Image+Not+Available';
  }

  protected async onDelete(): Promise<void> {
    const blog = this.blog();
    if (!blog) {
      return;
    }

    const confirmed = await this.confirmationService.confirm({
      title: this.copy().postsDeleteTitle,
      message: this.copy().postsDeleteMessage,
      confirmText: this.copy().postsDeleteConfirm,
      cancelText: this.copy().commonCancel,
      confirmButtonClass: 'danger'
    });

    if (!confirmed) {
      return;
    }

    try {
      await this.blogService.deleteBlog(blog.id);
      this.toastService.success(this.copy().postsDeleteSuccess);
      this.router.navigate(['/posts']);
    } catch {
      this.toastService.error(this.copy().postsDeleteError);
    }
  }
}

