import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule],
  template: `
    @if (blog(); as blog) {
      <div class="post-detail">
        <div class="post-header">
          <button class="btn-back" (click)="onBack()">« Back to Posts</button>
          <div class="post-actions">
            <button class="btn-secondary" (click)="onEdit()">Edit Post</button>
            <button class="btn-danger" (click)="onDelete()">Delete</button>
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
            <div class="post-text">{{ blog.content }}</div>
          </div>

          @if (blog.externalLink) {
            <div class="post-link">
              <a [href]="blog.externalLink" target="_blank" rel="noopener">
                🔗 External Link
              </a>
            </div>
          }

          <div class="post-flags">
            @if (blog.showOnHomePage) {
              <span class="flag">✓ Shown on Home Page</span>
            }
            @if (blog.showOnRegistration) {
              <span class="flag">✓ Shown on Registration</span>
            }
          </div>

          <div class="post-footer">
            <p class="post-dates">
              Created: {{ formatDateTime(blog.createdAt) }} |
              Updated: {{ formatDateTime(blog.updatedAt) }}
            </p>
          </div>
        </div>
      </div>
    } @else {
      <div class="error-state">
        <h2>Post not found</h2>
        <button class="btn-primary" (click)="onBack()">Go Back</button>
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
      color: #007bff;
      font-size: 14px;
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
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: white;
      color: #007bff;
      border: 1px solid #007bff;
    }

    .btn-secondary:hover {
      background: #e7f3ff;
    }

    .btn-danger {
      background: white;
      color: #dc3545;
      border: 1px solid #dc3545;
    }

    .btn-danger:hover {
      background: #fee;
    }

    .post-content {
      background: white;
      border-radius: 12px;
      padding: 48px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .post-category {
      display: inline-block;
      background: #007bff;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 36px;
      font-weight: 700;
      margin: 0 0 24px 0;
      color: #212529;
      line-height: 1.3;
    }

    .post-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      font-size: 14px;
      color: #6c757d;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e9ecef;
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
      font-size: 18px;
      color: #495057;
      font-weight: 500;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .post-text {
      font-size: 16px;
      color: #212529;
      line-height: 1.8;
      white-space: pre-wrap;
    }

    .post-link {
      margin-bottom: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .post-link a {
      color: #007bff;
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
      background: #d4edda;
      color: #155724;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
    }

    .post-footer {
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
    }

    .post-dates {
      font-size: 13px;
      color: #6c757d;
      margin: 0;
    }

    .error-state {
      text-align: center;
      padding: 64px 20px;
    }

    .error-state h2 {
      font-size: 24px;
      margin-bottom: 24px;
      color: #6c757d;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary:hover {
      background: #0056b3;
    }
  `]
})
export class PostDetailComponent implements OnInit {
  protected blog = signal<Blog | undefined>(undefined);

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const foundBlog = this.blogService.getBlogById(id);
      this.blog.set(foundBlog);
    }
  }

  protected formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  protected formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
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

  protected onDelete(): void {
    const blog = this.blog();
    if (blog && confirm('Are you sure you want to delete this post?')) {
      this.blogService.deleteBlog(blog.id);
      this.router.navigate(['/posts']);
    }
  }
}
