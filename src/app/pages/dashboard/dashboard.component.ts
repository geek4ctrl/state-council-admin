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
      font-weight: 600;
      margin: 0 0 32px 0;
      color: #212529;
    }

    .recent-section {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      color: #212529;
    }

    .btn-link {
      background: none;
      border: none;
      color: #007bff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s;
    }

    .btn-link:hover {
      color: #0056b3;
      text-decoration: underline;
    }

    .recent-posts {
      display: grid;
      gap: 16px;
    }

    .recent-post-item {
      display: flex;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .recent-post-item:hover {
      background: #f8f9fa;
    }

    .recent-post-item img {
      width: 120px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
    }

    .recent-post-content {
      flex: 1;
    }

    .recent-post-category {
      display: inline-block;
      background: #e7f3ff;
      color: #007bff;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .recent-post-content h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #212529;
    }

    .recent-post-date {
      font-size: 13px;
      color: #6c757d;
      margin: 0;
    }

    .empty-message {
      text-align: center;
      color: #6c757d;
      padding: 32px;
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
