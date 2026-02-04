import { Component, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-posts',
  imports: [CommonModule],
  template: `
    <div class="posts-page">
      <div class="page-header">
        <h1>All Posts</h1>
        <button class="btn-primary" (click)="onCreatePost()">
          <span class="icon">+</span> New Post
        </button>
      </div>

      <div class="posts-grid">
        @for (blog of blogs(); track blog.id) {
          <div class="post-card">
            <div class="post-image">
              <img [src]="blog.imageUrl" [alt]="blog.title" />
              <span class="post-category">{{ blog.category }}</span>
            </div>
            <div class="post-content">
              <h3 class="post-title">{{ blog.title }}</h3>
              <p class="post-date">{{ formatDate(blog.date) }}</p>
              <p class="post-excerpt">{{ blog.excerpt }}</p>

              <div class="post-meta">
                <span class="post-time">⏰ {{ blog.time }}</span>
                @if (blog.location) {
                  <span class="post-location">📍 {{ blog.location }}</span>
                }
              </div>

              <div class="post-actions">
                <button class="btn-secondary" (click)="onViewDetails(blog.id)">
                  View Details
                </button>
                <div class="action-buttons">
                  <button class="btn-icon" (click)="onEdit(blog.id)" title="Edit">
                    ✏️
                  </button>
                  <button class="btn-icon btn-danger" (click)="onDelete(blog.id)" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <p>No posts yet. Create your first post!</p>
            <button class="btn-primary" (click)="onCreatePost()">
              Create Post
            </button>
          </div>
        }
      </div>
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
      font-weight: 600;
      margin: 0;
      color: #212529;
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
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    @media (max-width: 768px) {
      .posts-grid {
        grid-template-columns: 1fr;
      }
    }

    .post-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .post-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
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
    }

    .post-category {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #007bff;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .post-content {
      padding: 20px;
    }

    .post-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #212529;
      line-height: 1.4;
    }

    .post-date {
      font-size: 14px;
      color: #6c757d;
      margin: 0 0 12px 0;
    }

    .post-excerpt {
      font-size: 14px;
      color: #495057;
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
      border-bottom: 1px solid #e9ecef;
    }

    .post-time, .post-location {
      font-size: 13px;
      color: #6c757d;
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
      background: #007bff;
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
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: white;
      color: #007bff;
      border: 1px solid #007bff;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #e7f3ff;
    }

    .btn-icon {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .btn-icon:hover {
      background: #f8f9fa;
    }

    .btn-danger:hover {
      background: #fee;
    }

    .icon {
      font-size: 18px;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 64px 20px;
    }

    .empty-state p {
      font-size: 18px;
      color: #6c757d;
      margin-bottom: 24px;
    }
  `]
})
export class PostsComponent {
  private blogService = inject(BlogService);
  private router = inject(Router);
  protected blogs = this.blogService.getBlogs();

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

  protected onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deleteBlog(id);
    }
  }

  protected onViewDetails(id: string): void {
    this.router.navigate(['/posts', id]);
  }
}
