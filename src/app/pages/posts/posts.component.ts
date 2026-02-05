import { Component, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';
import { ToastService } from '../../services/toast.service';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-posts',
  imports: [CommonModule],
  template: `
    <div class="posts-page" role="main">
      <div class="page-header">
        <h1 id="page-title">All Posts</h1>
        <button
          class="btn-primary"
          (click)="onCreatePost()"
          aria-label="Create a new blog post"
        >
          <span class="icon" aria-hidden="true">+</span> New Post
        </button>
      </div>

      <div class="posts-grid" role="list" aria-labelledby="page-title">
        @for (blog of paginatedBlogs(); track blog.id) {
          <article class="post-card" role="listitem">
            <div class="post-image">
              <img
                [src]="blog.imageUrl"
                [alt]="'Cover image for ' + blog.title"
                loading="lazy"
                decoding="async"
                (error)="onImageError($event)"
              />
              <span class="post-category" aria-label="Category">{{ blog.category }}</span>
            </div>
            <div class="post-content">
              <h3 class="post-title">{{ blog.title }}</h3>
              <p class="post-date">
                <time [attr.datetime]="blog.date.toISOString()">{{ formatDate(blog.date) }}</time>
              </p>
              <p class="post-excerpt">{{ blog.excerpt }}</p>

              <div class="post-meta" aria-label="Post metadata">
                <span class="post-time" aria-label="Time"><span aria-hidden="true">⏰</span> {{ blog.time }}</span>
                @if (blog.location) {
                  <span class="post-location" aria-label="Location"><span aria-hidden="true">📍</span> {{ blog.location }}</span>
                }
              </div>

              <div class="post-actions">
                <button
                  class="btn-secondary"
                  (click)="onViewDetails(blog.id)"
                  [attr.aria-label]="'View details for ' + blog.title"
                >
                  View Details
                </button>
                <div class="action-buttons" role="group" aria-label="Post actions">
                  <button
                    class="btn-icon"
                    (click)="onEdit(blog.id)"
                    [attr.aria-label]="'Edit ' + blog.title"
                  >
                    <span aria-hidden="true">✏️</span>
                  </button>
                  <button
                    class="btn-icon btn-danger"
                    (click)="onDelete(blog.id)"
                    [attr.aria-label]="'Delete ' + blog.title"
                  >
                    <span aria-hidden="true">🗑️</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        } @empty {
          <div class="empty-state" role="status" aria-live="polite">
            <p>No posts yet. Create your first post!</p>
            <button
              class="btn-primary"
              (click)="onCreatePost()"
              aria-label="Create your first post"
            >
              Create Post
            </button>
          </div>
        }
      </div>

      @if (totalPages() > 1) {
        <nav class="pagination" role="navigation" aria-label="Posts pagination">
          <button
            class="pagination-btn"
            (click)="previousPage()"
            [disabled]="currentPage() === 1"
            [attr.aria-label]="'Go to previous page'"
          >
            <span aria-hidden="true">←</span> Previous
          </button>

          <div class="pagination-info" role="status" aria-live="polite" aria-atomic="true">
            <span class="current-page">Page {{ currentPage() }} of {{ totalPages() }}</span>
            <span class="post-count">{{ startIndex() + 1 }}-{{ endIndex() }} of {{ totalBlogs() }} posts</span>
          </div>

          <button
            class="pagination-btn"
            (click)="nextPage()"
            [disabled]="currentPage() === totalPages()"
            [attr.aria-label]="'Go to next page'"
          >
            Next <span aria-hidden="true">→</span>
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
      font-size: 32px;
      font-weight: 400;
      margin: 0;
      color: #6b7280;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .post-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s;
    }

    .post-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
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
      background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
      color: #0891b2;
      padding: 6px 14px;
      border-radius: 14px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(8, 145, 178, 0.2);
    }

    .post-content {
      padding: 24px;
    }

    .post-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1f2937;
      line-height: 1.4;
    }

    .post-date {
      font-size: 13px;
      color: #9ca3af;
      margin: 0 0 12px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .post-date::before {
      content: '📅';
      font-size: 12px;
    }

    .post-excerpt {
      font-size: 14px;
      color: #6b7280;
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
      border-bottom: 1px solid #f3f4f6;
    }

    .post-time, .post-location {
      font-size: 13px;
      color: #9ca3af;
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
      background: #0891b2;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(8, 145, 178, 0.2);
    }

    .btn-primary:hover {
      background: #0e7490;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
    }

    .btn-secondary {
      background: linear-gradient(90deg, #ecfeff 0%, transparent 100%);
      color: #0891b2;
      border: 1px solid #cffafe;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: linear-gradient(90deg, #cffafe 0%, #ecfeff 100%);
      border-color: #0891b2;
      transform: translateX(2px);
    }

    .btn-icon {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #ecfeff;
      transform: scale(1.1);
    }

    .btn-danger:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .icon {
      font-size: 18px;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 64px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .empty-state p {
      font-size: 16px;
      color: #9ca3af;
      margin-bottom: 24px;
      font-weight: 400;
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
        font-size: 24px;
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
        font-size: 18px;
      }

      .post-category {
        font-size: 10px;
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
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      gap: 16px;
    }

    .pagination-btn {
      background: #0891b2;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(8, 145, 178, 0.2);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #0e7490;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(8, 145, 178, 0.3);
    }

    .pagination-btn:disabled {
      background: #e5e7eb;
      color: #9ca3af;
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
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
    }

    .post-count {
      font-size: 12px;
      color: #9ca3af;
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
export class PostsComponent {
  private blogService = inject(BlogService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);

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
    return new Date(date).toLocaleDateString('en-US', {
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
      title: 'Delete Post',
      message: 'Are you sure you want to delete this post? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmButtonClass: 'danger'
    });

    if (confirmed) {
      const success = this.blogService.deleteBlog(id);
      if (success) {
        this.toastService.success('Post deleted successfully');
      } else {
        this.toastService.error('Failed to delete post');
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
