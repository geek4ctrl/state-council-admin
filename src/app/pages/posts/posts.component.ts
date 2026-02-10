import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-posts',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="posts-page" role="main">
      <div class="page-header">
        <h1 id="page-title">{{ copy().postsTitle }}</h1>
        <button
          class="btn-primary"
          (click)="onCreatePost()"
          [attr.aria-label]="copy().postsCreateAriaLabel"
        >
          <span class="icon" aria-hidden="true">+</span> {{ copy().postsNewButton }}
        </button>
      </div>

      <div class="posts-grid" role="list" aria-labelledby="page-title">
        @for (blog of paginatedBlogs(); track blog.id) {
          <article class="post-card" role="listitem">
            <div class="post-image">
              <img
                [src]="blog.imageUrl"
                [alt]="copy().postsCoverAltPrefix + ' ' + blog.title"
                loading="lazy"
                decoding="async"
                (error)="onImageError($event)"
              />
              <span class="post-category" [attr.aria-label]="copy().postsCategoryLabel">{{ blog.category }}</span>
            </div>
            <div class="post-content">
              <h3 class="post-title">{{ blog.title }}</h3>
              <p class="post-date">
                <time [attr.datetime]="blog.date.toISOString()">{{ formatDate(blog.date) }}</time>
              </p>
              <p class="post-excerpt">{{ blog.excerpt }}</p>

              <div class="post-meta" [attr.aria-label]="copy().postsMetaLabel">
                <span class="post-time" [attr.aria-label]="copy().postsTimeLabel"><span aria-hidden="true">⏰</span> {{ blog.time }}</span>
                @if (blog.location) {
                  <span class="post-location" [attr.aria-label]="copy().postsLocationLabel"><span aria-hidden="true">📍</span> {{ blog.location }}</span>
                }
              </div>

              <div class="post-actions">
                <a
                  class="btn-secondary"
                  [routerLink]="['/posts', blog.id]"
                  [attr.aria-label]="copy().postsViewDetailsPrefix + ' ' + blog.title"
                >
                  {{ copy().postsViewDetailsText }}
                </a>
                <div class="action-buttons" role="group" [attr.aria-label]="copy().postsActionsLabel">
                  <a
                    class="btn-icon"
                    [routerLink]="['/posts/edit', blog.id]"
                    [attr.aria-label]="copy().postsEditPrefix + ' ' + blog.title"
                  >
                    <span aria-hidden="true">✏️</span>
                  </a>
                  <button
                    class="btn-icon btn-danger"
                    (click)="onDelete(blog.id)"
                    [attr.aria-label]="copy().postsDeletePrefix + ' ' + blog.title"
                    type="button"
                  >
                    <span aria-hidden="true">🗑️</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        } @empty {
          <div class="empty-state" role="status" aria-live="polite">
            <p>{{ copy().postsEmptyText }}</p>
            <button
              class="btn-primary"
              (click)="onCreatePost()"
              [attr.aria-label]="copy().postsCreateFirstAriaLabel"
            >
              {{ copy().postsCreateFirstButton }}
            </button>
          </div>
        }
      </div>

      @if (totalPages() > 1) {
        <nav class="pagination" role="navigation" [attr.aria-label]="copy().postsPaginationLabel">
          <button
            class="pagination-btn"
            (click)="previousPage()"
            [disabled]="currentPage() === 1"
            [attr.aria-label]="copy().postsPrevAriaLabel"
          >
            <span aria-hidden="true">←</span> {{ copy().postsPrevText }}
          </button>

          <div class="pagination-info" role="status" aria-live="polite" aria-atomic="true">
            <span class="current-page">{{ copy().postsPageLabel }} {{ currentPage() }} {{ copy().postsOfText }} {{ totalPages() }}</span>
            <span class="post-count">{{ startIndex() + 1 }}-{{ endIndex() }} {{ copy().postsOfText }} {{ totalBlogs() }} {{ copy().postsCountSuffix }}</span>
          </div>

          <button
            class="pagination-btn"
            (click)="nextPage()"
            [disabled]="currentPage() === totalPages()"
            [attr.aria-label]="copy().postsNextAriaLabel"
          >
            {{ copy().postsNextText }} <span aria-hidden="true">→</span>
          </button>
        </nav>
      }
    </div>
  `,
  styles: [`
    .posts-page {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 30px;
      font-weight: 400;
      margin: 0;
      color: var(--text-muted);
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .post-card {
      background: var(--surface);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-soft);
      transition: all 0.3s;
    }

    .post-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-strong);
    }

    .post-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .post-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .post-card:hover .post-image img {
      transform: scale(1.05);
    }

    .post-category {
      position: absolute;
      top: 12px;
      right: 12px;
      background: linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 18%, var(--surface)) 0%, color-mix(in srgb, var(--accent-2) 18%, var(--surface)) 100%);
      color: var(--primary);
      padding: 6px 14px;
      border-radius: 14px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(8, 145, 178, 0.2);
    }

    .post-content {
      padding: 24px;
    }

    .post-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--text);
      line-height: 1.4;
    }

    .post-date {
      font-size: 11px;
      color: var(--text-subtle);
      margin: 0 0 12px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .post-date::before {
      content: '📅';
      font-size: 10px;
    }

    .post-excerpt {
      font-size: 12px;
      color: var(--text-muted);
      margin: 0 0 16px 0;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .post-time, .post-location {
      font-size: 11px;
      color: var(--text-subtle);
    }

    .post-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(8, 145, 178, 0.2);
    }

    .btn-primary:hover {
      background: var(--primary-strong);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
    }

    .btn-secondary {
      background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 12%, var(--surface)) 0%, transparent 100%);
      color: var(--primary);
      border: 1px solid color-mix(in srgb, var(--primary) 35%, var(--border));
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-secondary:hover {
      background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 22%, var(--surface)) 0%, color-mix(in srgb, var(--primary) 12%, var(--surface)) 100%);
      border-color: var(--primary);
      transform: translateX(2px);
    }

    .btn-icon {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-icon:hover {
      background: color-mix(in srgb, var(--primary) 12%, var(--surface));
      transform: scale(1.1);
    }

    .btn-danger:hover {
      background: color-mix(in srgb, var(--danger) 12%, var(--surface));
      color: var(--danger);
    }

    .icon {
      font-size: 16px;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 64px 20px;
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow-soft);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .empty-state p {
      font-size: 14px;
      color: var(--text-subtle);
      margin-bottom: 24px;
      font-weight: 400;
    }

    .empty-state .btn-primary {
      align-self: center;
    }

    @media (max-width: 768px) {
      .posts-grid {
        grid-template-columns: 1fr;
      }

      .post-card {
        padding: 20px;
      }

      .post-image {
        height: 200px;
      }
    }

    @media (max-width: 640px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .page-header h1 {
        font-size: 22px;
      }

      .btn-primary {
        width: 100%;
        justify-content: center;
      }

      .post-card {
        padding: 16px;
      }

      .post-image {
        height: 180px;
      }

      .post-title {
        font-size: 16px;
      }

      .post-category {
        font-size: 8px;
        padding: 3px 10px;
      }

      .post-actions {
        flex-wrap: wrap;
      }

      .btn-secondary {
        flex: 1;
        min-width: 120px;
      }
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
      padding: 24px 32px;
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow-soft);
      gap: 16px;
    }

    .pagination-btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(8, 145, 178, 0.2);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--primary-strong);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(8, 145, 178, 0.3);
    }

    .pagination-btn:disabled {
      background: var(--surface-alt);
      color: var(--text-subtle);
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    .pagination-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .current-page {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
    }

    .post-count {
      font-size: 10px;
      color: var(--text-subtle);
    }

    @media (max-width: 640px) {
      .pagination {
        flex-direction: column;
        padding: 20px;
        gap: 12px;
      }

      .pagination-btn {
        width: 100%;
        justify-content: center;
      }

      .pagination-info {
        order: -1;
        width: 100%;
      }
    }
  `]
})
export class PostsComponent implements OnInit {
  private blogService = inject(BlogService);
  private languageService = inject(LanguageService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);

  protected copy = this.languageService.copy;

  protected blogs = this.blogService.getBlogs();
  protected currentPage = signal(1);
  protected itemsPerPage = 6;

  protected totalBlogs = computed(() => this.blogs().length);
  protected totalPages = computed(() => Math.ceil(this.totalBlogs() / this.itemsPerPage));
  protected startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage);
  protected endIndex = computed(() => Math.min(this.startIndex() + this.itemsPerPage, this.totalBlogs()));

  protected paginatedBlogs = computed(() => {
    const start = this.startIndex();
    const end = this.endIndex();
    return this.blogs().slice(start, end);
  });

  async ngOnInit(): Promise<void> {
    try {
      const loaded = await this.blogService.loadBlogs();
      if (!loaded) {
        this.toastService.error(this.copy().postsLoadError);
      }
    } catch {
      this.toastService.error(this.copy().postsLoadError);
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.scrollToTop();
    }
  }

  protected previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.scrollToTop();
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.languageService.locale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  protected onCreatePost(): void {
    this.router.navigate(['/posts/new']);
  }

  protected onEdit(id: string): void {
    this.router.navigate(['/posts/edit', id]);
  }

  protected async onDelete(id: string): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: this.copy().postsDeleteTitle,
      message: this.copy().postsDeleteMessage,
      confirmText: this.copy().postsDeleteConfirm,
      cancelText: this.copy().commonCancel,
      confirmButtonClass: 'danger'
    });

    if (confirmed) {
      try {
        await this.blogService.deleteBlog(id);
        this.toastService.success(this.copy().postsDeleteSuccess);
      } catch {
        this.toastService.error(this.copy().postsDeleteError);
      }
    }
  }

  protected onViewDetails(id: string): void {
    this.router.navigate(['/posts', id]);
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=Image+Not+Available';
  }
}

