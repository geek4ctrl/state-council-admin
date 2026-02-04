import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <div class="recent-section">
        <div class="section-header">
          <h2>Recent Posts</h2>
          <button class="btn-link" (click)="viewAllPosts()">View All →</button>
        </div>

        <div class="recent-posts">
          @for (blog of recentPosts(); track blog.id) {
            <div class="recent-post-item" (click)="viewPost(blog.id)">
              <img [src]="blog.imageUrl" [alt]="blog.title" />
              <div class="recent-post-content">
                <span class="recent-post-category">{{ blog.category }}</span>
                <h3>{{ blog.title }}</h3>
                <p class="recent-post-date">{{ formatDate(blog.date) }}</p>
              </div>
            </div>
          } @empty {
            <p class="empty-message">No posts yet</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-size: 32px;
      font-weight: 400;
      margin: 0 0 32px 0;
      color: #6b7280;
    }

    .recent-section {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .section-header h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      color: #374151;
    }

    .btn-link {
      background: none;
      border: none;
      color: #0891b2;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s;
    }

    .btn-link:hover {
      color: #0e7490;
      text-decoration: underline;
    }

    .recent-posts {
      display: grid;
      gap: 0;
    }

    .recent-post-item {
      display: flex;
      gap: 20px;
      padding: 20px 0;
      border-bottom: 1px solid #f3f4f6;
      cursor: pointer;
      transition: all 0.2s;
    }

    .recent-post-item:last-child {
      border-bottom: none;
    }

    .recent-post-item:hover {
      padding-left: 8px;
      background: linear-gradient(90deg, #ecfeff 0%, transparent 100%);
    }

    .recent-post-item img {
      width: 140px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .recent-post-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .recent-post-category {
      display: inline-block;
      background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
      color: #0891b2;
      padding: 4px 12px;
      border-radius: 14px;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: fit-content;
    }

    .recent-post-content h3 {
      font-size: 17px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1f2937;
      line-height: 1.4;
    }

    .recent-post-date {
      font-size: 13px;
      color: #9ca3af;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .recent-post-date::before {
      content: '📅';
      font-size: 12px;
    }

    .empty-message {
      text-align: center;
      color: #9ca3af;
      padding: 64px 20px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .recent-post-item {
        flex-direction: column;
        gap: 12px;
      }

      .recent-post-item img {
        width: 100%;
        height: 180px;
      }
    }

    @media (max-width: 640px) {
      h1 {
        font-size: 24px;
      }

      .recent-section {
        padding: 20px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .recent-post-item {
        padding: 16px 0;
      }

      .recent-post-content h3 {
        font-size: 16px;
      }
    }
  `]
})
export class DashboardComponent {
  private blogService = inject(BlogService);
  private router = inject(Router);
  private blogs = this.blogService.getBlogs();

  protected totalPosts = computed(() => this.blogs().length);
  protected eventCount = computed(() =>
    this.blogs().filter(b => b.category === 'Event').length
  );
  protected announcementCount = computed(() =>
    this.blogs().filter(b => b.category === 'Announcement').length
  );
  protected newsCount = computed(() =>
    this.blogs().filter(b => b.category === 'News').length
  );
  protected recentPosts = computed(() =>
    [...this.blogs()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  );

  protected formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  protected viewAllPosts(): void {
    this.router.navigate(['/posts']);
  }

  protected viewPost(id: string): void {
    this.router.navigate(['/posts', id]);
  }
}
