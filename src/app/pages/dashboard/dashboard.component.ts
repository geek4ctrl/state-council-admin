import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard" role="main">
      <h1 id="dashboard-title">{{ copy().dashboardTitle }}</h1>

      <div class="recent-section">
        <div class="section-header">
          <h2 id="recent-posts-title">{{ copy().dashboardRecentPosts }}</h2>
          <button
            class="btn-link"
            (click)="viewAllPosts()"
            [attr.aria-label]="copy().dashboardViewAllAriaLabel"
          >
            {{ copy().dashboardViewAllText }}
          </button>
        </div>

        <div class="stats-strip" role="list" aria-label="Post stats">
          <div class="stat" role="listitem">
            <span class="stat-icon is-total" aria-hidden="true">T</span>
            <span class="stat-label">{{ copy().dashboardStatsTotalLabel }}</span>
            <span class="stat-value">{{ totalPosts() }}</span>
          </div>
          <div class="stat" role="listitem">
            <span class="stat-icon is-events" aria-hidden="true">E</span>
            <span class="stat-label">{{ copy().dashboardStatsEventsLabel }}</span>
            <span class="stat-value">{{ eventCount() }}</span>
          </div>
          <div class="stat" role="listitem">
            <span class="stat-icon is-announcements" aria-hidden="true">A</span>
            <span class="stat-label">{{ copy().dashboardStatsAnnouncementsLabel }}</span>
            <span class="stat-value">{{ announcementCount() }}</span>
          </div>
          <div class="stat" role="listitem">
            <span class="stat-icon is-news" aria-hidden="true">N</span>
            <span class="stat-label">{{ copy().dashboardStatsNewsLabel }}</span>
            <span class="stat-value">{{ newsCount() }}</span>
          </div>
        </div>

        <div class="recent-posts" role="list" aria-labelledby="recent-posts-title">
          @for (blog of recentPosts(); track blog.id) {
            <a
              class="recent-post-item"
              [routerLink]="['/posts', blog.id]"
              role="listitem"
              [attr.aria-label]="copy().dashboardViewPostPrefix + ' ' + blog.title"
            >
              <img
                [src]="blog.imageUrl"
                [alt]="copy().dashboardCoverAltPrefix + ' ' + blog.title"
                loading="lazy"
                decoding="async"
                (error)="onImageError($event)"
              />
              <div class="recent-post-content">
                <span class="recent-post-category" [attr.aria-label]="copy().dashboardCategoryLabel">{{ blog.category }}</span>
                <h3>{{ blog.title }}</h3>
                <p class="recent-post-date">
                  <span class="ui-icon is-calendar" aria-hidden="true"></span>
                  <time [attr.datetime]="blog.date.toISOString()">{{ formatDate(blog.date) }}</time>
                </p>
              </div>
            </a>
          } @empty {
            <p class="empty-message state-message is-empty" data-icon="-" role="status">{{ copy().dashboardEmptyText }}</p>
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
      font-size: 30px;
      font-weight: 400;
      margin: 0 0 32px 0;
      color: var(--text-muted);
    }

    .recent-section {
      background: var(--surface);
      border-radius: 12px;
      padding: 32px;
      box-shadow: var(--shadow-soft);
    }


    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .section-header h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: var(--text);
    }


    .btn-link {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s;
    }

    .btn-link:hover {
      color: var(--primary-strong);
      text-decoration: underline;
    }

    .stats-strip {
      display: none;
      gap: 10px;
      margin-bottom: 18px;
      padding: 10px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: linear-gradient(180deg, var(--surface-elev), var(--surface));
      box-shadow: var(--shadow-soft);
    }

    .stat {
      flex: 1 1 0;
      min-width: 0;
      padding: 8px 10px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--surface) 70%, transparent);
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
    }

    .stat-icon {
      width: 20px;
      height: 20px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.3px;
      color: var(--text);
      border: 1px solid var(--border);
      background: var(--surface);
    }

    .stat-icon.is-total {
      background: color-mix(in srgb, var(--primary) 18%, transparent);
      border-color: color-mix(in srgb, var(--primary) 35%, var(--border));
      color: var(--primary-strong);
    }

    .stat-icon.is-events {
      background: color-mix(in srgb, var(--accent-1) 22%, transparent);
      border-color: color-mix(in srgb, var(--accent-1) 36%, var(--border));
      color: color-mix(in srgb, var(--accent-1) 70%, var(--text));
    }

    .stat-icon.is-announcements {
      background: color-mix(in srgb, var(--accent-2) 20%, transparent);
      border-color: color-mix(in srgb, var(--accent-2) 36%, var(--border));
      color: color-mix(in srgb, var(--accent-2) 70%, var(--text));
    }

    .stat-icon.is-news {
      background: color-mix(in srgb, var(--accent-3) 20%, transparent);
      border-color: color-mix(in srgb, var(--accent-3) 36%, var(--border));
      color: color-mix(in srgb, var(--accent-3) 70%, var(--text));
    }

    .stat-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: var(--text-subtle);
    }

    .stat-value {
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
    }

    .recent-posts {
      display: grid;
      gap: 0;
    }

    .recent-post-item {
      display: flex;
      gap: 20px;
      padding: 20px 0;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.2s;
      outline: none;
    }

    .recent-post-item:focus {
      padding-left: 8px;
      background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 12%, transparent) 0%, transparent 100%);
      box-shadow: 0 0 0 2px var(--primary);
    }

    .recent-post-item:last-child {
      border-bottom: none;
    }

    .recent-post-item:hover {
      padding-left: 8px;
      background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 12%, transparent) 0%, transparent 100%);
    }

    .recent-post-item img {
      width: 140px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: var(--shadow-soft);
    }

    .recent-post-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .recent-post-category {
      display: inline-block;
      background: linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 18%, var(--surface)) 0%, color-mix(in srgb, var(--accent-2) 18%, var(--surface)) 100%);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: 14px;
      font-size: 9px;
      font-weight: 700;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: fit-content;
    }

    .recent-post-content h3 {
      font-size: 15px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--text);
      line-height: 1.4;
    }

    .recent-post-date {
      font-size: 11px;
      color: var(--text-subtle);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }


    @media (max-width: 768px) {
      .recent-post-item {
        flex-direction: column;
        gap: 12px;
      }

      .recent-post-item img {
        width: 100%;
        height: 200px;
        border-radius: 12px;
      }

      .recent-section {
        padding: 24px;
      }

    }

    @media (max-width: 640px) {
      h1 {
        font-size: 22px;
        color: var(--text);
        font-weight: 600;
        text-shadow: 0 2px 10px rgba(15, 23, 42, 0.12);
      }

      .recent-section {
        padding: 18px;
      }


      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .section-header h2 {
        font-size: 16px;
      }

      .stats-strip {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .recent-post-item {
        padding: 16px;
        border-radius: 16px;
        border: 1px solid var(--border);
        background: linear-gradient(180deg, var(--surface), var(--surface-elev));
        box-shadow: var(--shadow-card);
      }

      .recent-post-item img {
        height: 180px;
      }

      .recent-post-content h3 {
        font-size: 14px;
      }

      .recent-post-category {
        font-size: 8px;
        padding: 3px 10px;
      }

      .recent-posts {
        gap: 14px;
      }

      .recent-post-item:hover,
      .recent-post-item:focus {
        padding-left: 16px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private blogService = inject(BlogService);
  private languageService = inject(LanguageService);
  private router = inject(Router);
  private blogs = this.blogService.getBlogs();
  private toastService = inject(ToastService);

  protected copy = this.languageService.copy;

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
  );

  async ngOnInit(): Promise<void> {
    try {
      const loaded = await this.blogService.loadBlogs();
      if (!loaded) {
        this.toastService.error(this.copy().dashboardLoadError);
      }
    } catch {
      this.toastService.error(this.copy().dashboardLoadError);
    }

  }

  protected formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.languageService.locale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  protected viewAllPosts(): void {
    this.router.navigate(['/posts']);
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=Image+Not+Available';
  }
}

