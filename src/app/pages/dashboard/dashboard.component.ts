import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuditLogService } from '../../services/audit-log.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { ExportService } from '../../services/export.service';
import { BlogStatus } from '../../models/blog.model';
import { AuditLog } from '../../models/audit-log.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard" role="main">
      <h1 id="dashboard-title">{{ copy().dashboardTitle }}</h1>
      <p class="page-subtitle">{{ copy().dashboardSubtitle }}</p>

      <section class="analytics-section" aria-labelledby="analytics-title">
        <div class="section-header">
          <div>
            <h2 id="analytics-title">{{ copy().dashboardAnalyticsTitle }}</h2>
            <p class="section-subtitle">{{ copy().dashboardAnalyticsSubtitle }}</p>
          </div>
          <div class="section-actions">
            <button class="btn-secondary" type="button" (click)="exportReportCsv()">
              {{ copy().dashboardReportExportCsv }}
            </button>
            <button class="btn-secondary" type="button" (click)="exportReportPdf()">
              {{ copy().dashboardReportExportPdf }}
            </button>
          </div>
        </div>

        @if (analyticsLoading()) {
          <p class="empty-message state-message is-loading" data-icon="..." role="status">
            {{ copy().dashboardAnalyticsLoading }}
          </p>
        } @else if (analyticsError()) {
          <p class="empty-message state-message is-error" data-icon="!" role="status">
            {{ copy().dashboardAnalyticsError }}
          </p>
        } @else {
          <div class="analytics-grid">
            <article class="kpi-card">
              <div class="kpi-header">
                <h3>{{ copy().dashboardAnalyticsPostsLabel }}</h3>
                <span class="kpi-range">{{ activityWindowLabel() }}</span>
              </div>
              <div class="kpi-main">{{ totalPosts() }}</div>
              <div class="kpi-sub">
                <span>{{ copy().dashboardAnalyticsPublishedLabel }}: {{ publishedPosts() }}</span>
                <span>{{ copy().dashboardAnalyticsDraftLabel }}: {{ draftPosts() }}</span>
                <span>{{ copy().dashboardAnalyticsReviewLabel }}: {{ reviewPosts() }}</span>
              </div>
            </article>

            <article class="kpi-card">
              <div class="kpi-header">
                <h3>{{ copy().dashboardAnalyticsUsersLabel }}</h3>
                <span class="kpi-range">{{ activityWindowLabel() }}</span>
              </div>
              <div class="kpi-main">{{ totalUsers() }}</div>
              <div class="kpi-sub">
                <span>{{ copy().dashboardAnalyticsActiveUsersLabel }}: {{ activeUsers() }}</span>
                <span>{{ copy().dashboardAnalyticsNewUsersLabel }}: {{ newUsersCount() }}</span>
              </div>
            </article>

            <article class="kpi-card">
              <div class="kpi-header">
                <h3>{{ copy().dashboardAnalyticsLoginsLabel }}</h3>
                <span class="kpi-range">{{ activityWindowLabel() }}</span>
              </div>
              <div class="kpi-main">{{ loginCount() }}</div>
              <div class="kpi-sub">
                <span>{{ copy().dashboardAnalyticsUserActivityLabel }}: {{ userActivityCount() }}</span>
                <span>{{ copy().dashboardAnalyticsPostActivityLabel }}: {{ postActivityCount() }}</span>
              </div>
            </article>

            <article class="kpi-card kpi-top-content">
              <div class="kpi-header">
                <h3>{{ copy().dashboardAnalyticsTopContentLabel }}</h3>
                <span class="kpi-range">{{ copy().dashboardAnalyticsTopContentHint }}</span>
              </div>
              <div class="kpi-list" role="list">
                @for (post of topContent(); track post.id) {
                  <div class="kpi-list-item" role="listitem">
                    <div>
                      <div class="kpi-title">{{ post.title }}</div>
                      <div class="kpi-meta">
                        <span>{{ statusLabel(post.status) }}</span>
                        <span>•</span>
                        <span>{{ formatDate(post.updatedAt) }}</span>
                      </div>
                    </div>
                    <span class="kpi-pill">{{ post.category }}</span>
                  </div>
                } @empty {
                  <p class="empty-message state-message is-empty" data-icon="-" role="status">
                    {{ copy().dashboardAnalyticsTopContentEmpty }}
                  </p>
                }
              </div>
            </article>
          </div>
        }
      </section>

      <div class="recent-section">
        <div class="section-header">
          <h2 id="recent-posts-title">{{ copy().dashboardRecentPosts }}</h2>
          <div class="section-actions">
            <button
              class="btn-primary"
              type="button"
              (click)="createPost()"
              [attr.aria-label]="copy().postsCreateAriaLabel"
            >
              {{ copy().postsNewButton }}
            </button>
            <button
              class="btn-link"
              type="button"
              (click)="viewAllPosts()"
              [attr.aria-label]="copy().dashboardViewAllAriaLabel"
            >
              {{ copy().dashboardViewAllText }}
            </button>
          </div>
        </div>

        <div class="filter-bar" role="group" [attr.aria-label]="copy().postsFilterStatus + ' / ' + copy().postsFilterAuthor">
          <label class="filter-group">
            <span class="filter-label">{{ copy().postsFilterStatus }}</span>
            <select
              class="filter-select"
              [value]="selectedStatus()"
              (change)="onStatusChange($event)"
            >
              <option value="all">{{ copy().postsFilterAllStatuses }}</option>
              <option value="draft">{{ copy().postsFilterDraft }}</option>
              <option value="review">{{ copy().postsFilterReview }}</option>
              <option value="published">{{ copy().postsFilterPublished }}</option>
            </select>
          </label>
          <label class="filter-group">
            <span class="filter-label">{{ copy().postsFilterAuthor }}</span>
            <select
              class="filter-select"
              [value]="selectedAuthor()"
              (change)="onAuthorChange($event)"
            >
              <option value="all">{{ copy().postsFilterAllAuthors }}</option>
              @for (author of authorOptions(); track author) {
                <option [value]="author">{{ author }}</option>
              }
            </select>
          </label>
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
          @for (blog of filteredPosts(); track blog.id) {
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
                <div class="recent-post-meta" [attr.aria-label]="copy().postsMetaLabel">
                  <div class="meta-top">
                    <span class="meta-pill is-category" [attr.aria-label]="copy().dashboardCategoryLabel">{{ blog.category }}</span>
                    <span
                      class="meta-pill is-status"
                      [class.is-draft]="blog.status === 'draft'"
                      [class.is-review]="blog.status === 'review'"
                      [class.is-published]="blog.status === 'published'"
                      [attr.aria-label]="copy().postsFilterStatus"
                    >
                      {{ statusLabel(blog.status) }}
                    </span>
                  </div>
                </div>
                <h3>{{ blog.title }}</h3>
                <div class="meta-bottom">
                  <span class="meta-item">
                    <span class="meta-label">{{ copy().postsFilterAuthor }}</span>
                    <span class="meta-value">{{ blog.authorName || copy().commonNotAvailable }}</span>
                  </span>
                  <span class="meta-item">
                    <span class="meta-label">{{ copy().postFormDateLabel }}</span>
                    <time [attr.datetime]="blog.date.toISOString()">{{ formatDate(blog.date) }}</time>
                  </span>
                </div>
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
      font-size: 34px;
      font-weight: 600;
      margin: 0 0 24px 0;
      color: var(--text);
    }

    .page-subtitle {
      margin: -14px 0 24px 0;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      color: var(--text-subtle);
    }

    .recent-section {
      background: linear-gradient(180deg, var(--surface) 0%, var(--surface-elev) 100%);
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
      border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
    }

    .section-header h2 {
      font-size: 14px;
      font-weight: 700;
      margin: 0;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .section-actions {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .filter-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: -6px 0 16px 0;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
      background: var(--surface-alt);
    }

    .filter-group {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--text);
    }

    .filter-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .filter-select {
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary {
      border: none;
      background: linear-gradient(120deg, var(--primary), var(--primary-strong));
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.2px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 26px rgba(15, 23, 42, 0.25);
    }


    .btn-link {
      background: var(--surface);
      border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
      color: var(--primary);
      font-size: 11px;
      font-weight: 600;
      padding: 7px 12px;
      border-radius: 999px;
      cursor: pointer;
      transition: color 0.2s;
    }

    .btn-link:hover {
      color: var(--primary-strong);
      border-color: var(--primary);
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
      padding: 14px 0;
      border-bottom: 1px solid color-mix(in srgb, var(--border) 55%, transparent);
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
      width: 132px;
      height: 88px;
      object-fit: cover;
      aspect-ratio: 16 / 10;
      border-radius: 8px;
      background: var(--surface-alt);
      box-shadow: var(--shadow-soft);
    }

    .recent-post-item img.is-fallback {
      object-fit: contain;
      padding: 10px;
    }

    .recent-post-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .recent-post-meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 8px;
    }

    .meta-top,
    .meta-bottom {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 12px;
    }

    .meta-bottom {
      align-items: flex-end;
    }

    .meta-pill {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 18%, var(--surface)) 0%, color-mix(in srgb, var(--accent-2) 18%, var(--surface)) 100%);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 14px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      align-self: flex-start;
    }

    .meta-pill.is-status {
      background: color-mix(in srgb, var(--primary) 14%, var(--surface));
      color: var(--primary-strong);
    }

    .meta-pill.is-status.is-draft {
      background: color-mix(in srgb, var(--accent-3) 18%, var(--surface));
      color: color-mix(in srgb, var(--accent-3) 70%, var(--text));
    }

    .meta-pill.is-status.is-review {
      background: color-mix(in srgb, var(--accent-2) 18%, var(--surface));
      color: color-mix(in srgb, var(--accent-2) 70%, var(--text));
    }

    .meta-pill.is-status.is-published {
      background: color-mix(in srgb, var(--accent-1) 18%, var(--surface));
      color: color-mix(in srgb, var(--accent-1) 70%, var(--text));
    }

    .meta-item {
      display: inline-flex;
      align-items: flex-end;
      gap: 6px;
      font-size: 11px;
      color: var(--text-subtle);
    }

    .meta-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      color: var(--text-muted);
    }

    .meta-value {
      color: var(--text);
    }

    .recent-post-content h3 {
      font-size: 15px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--text);
      line-height: 1.4;
    }


    @media (max-width: 768px) {
      .recent-post-item {
        flex-direction: column;
        gap: 12px;
      }

      .recent-post-item img {
        width: 100%;
        height: 180px;
        border-radius: 12px;
      }

      .recent-section {
        padding: 24px;
      }

      .filter-bar {
        flex-direction: column;
        align-items: flex-start;
      }

    }

    @media (max-width: 640px) {
      h1 {
        font-size: 24px;
        font-weight: 600;
      }

      .page-subtitle {
        margin-top: -10px;
      }

      .recent-section {
        padding: 18px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .section-actions {
        flex-wrap: wrap;
      }

      .section-header h2 {
        font-size: 16px;
      }

      .stats-strip {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .recent-post-item {
        padding: 14px;
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
  private auditLogService = inject(AuditLogService);
  private languageService = inject(LanguageService);
  private userService = inject(UserService);
  private router = inject(Router);
  private exportService = inject(ExportService);
  private blogs = this.blogService.getBlogs();
  private users = this.userService.getUsers();
  private toastService = inject(ToastService);
  private auditLogs = signal<AuditLog[]>([]);
  private activityWindowDays = 30;

  protected selectedStatus = signal<BlogStatus | 'all'>('all');
  protected selectedAuthor = signal<string>('all');
  protected analyticsLoading = signal(true);
  protected analyticsError = signal(false);

  protected copy = this.languageService.copy;

  protected activityWindowStart = computed(() => {
    const start = new Date();
    start.setDate(start.getDate() - this.activityWindowDays);
    start.setHours(0, 0, 0, 0);
    return start;
  });

  protected activityWindowLabel = computed(() =>
    this.copy().dashboardAnalyticsRangeLabel.replace('{days}', String(this.activityWindowDays))
  );

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
    [...this.blogs()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  protected publishedPosts = computed(() => this.blogs().filter((blog) => blog.status === 'published').length);
  protected draftPosts = computed(() => this.blogs().filter((blog) => blog.status === 'draft').length);
  protected reviewPosts = computed(() => this.blogs().filter((blog) => blog.status === 'review').length);

  protected totalUsers = computed(() => this.users().length);
  protected activeUsers = computed(() => this.users().filter((user) => !user.locked).length);
  protected newUsersCount = computed(() =>
    this.users().filter((user) => user.createdAt >= this.activityWindowStart()).length
  );

  protected recentLogs = computed(() =>
    this.auditLogs().filter((log) => log.createdAt >= this.activityWindowStart())
  );

  protected loginCount = computed(() =>
    this.recentLogs().filter((log) => log.action === 'auth.login').length
  );

  protected userActivityCount = computed(() =>
    this.recentLogs().filter((log) => log.action.startsWith('users.') || log.action === 'auth.register').length
  );

  protected postActivityCount = computed(() =>
    this.recentLogs().filter((log) => log.action.startsWith('posts.')).length
  );

  protected topContent = computed(() =>
    [...this.blogs()]
      .filter((blog) => blog.status === 'published')
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)
  );

  protected authorOptions = computed(() => {
    const names = this.blogs()
      .map(blog => blog.authorName)
      .filter((name): name is string => !!name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  });

  protected filteredPosts = computed(() => {
    const status = this.selectedStatus();
    const author = this.selectedAuthor();

    return this.recentPosts().filter(blog => {
      const statusMatch = status === 'all' || blog.status === status;
      const authorMatch = author === 'all' || blog.authorName === author;
      return statusMatch && authorMatch;
    });
  });

  async ngOnInit(): Promise<void> {
    try {
      const [postsLoaded, usersLoaded, auditLoaded] = await Promise.all([
        this.blogService.loadBlogs(),
        this.userService.loadUsers(),
        this.loadAuditLogs()
      ]);

      if (!postsLoaded) {
        this.toastService.error(this.copy().dashboardLoadError);
      }

      if (!usersLoaded) {
        this.toastService.error(this.copy().dashboardUsersError);
      }

      if (!auditLoaded) {
        this.toastService.error(this.copy().dashboardAnalyticsError);
      }

      this.analyticsError.set(!usersLoaded || !auditLoaded);
    } catch {
      this.analyticsError.set(true);
      this.toastService.error(this.copy().dashboardAnalyticsError);
    } finally {
      this.analyticsLoading.set(false);
    }

  }

  private async loadAuditLogs(): Promise<boolean> {
    try {
      const from = this.activityWindowStart().toISOString();
      const to = new Date().toISOString();
      const { logs } = await this.auditLogService.listLogs({
        from,
        to,
        limit: 200,
        offset: 0
      });
      this.auditLogs.set(logs);
      return true;
    } catch {
      this.auditLogs.set([]);
      return false;
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

  protected createPost(): void {
    this.router.navigate(['/posts/new']);
  }

  protected onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as BlogStatus | 'all';
    this.selectedStatus.set(value);
  }

  protected onAuthorChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedAuthor.set(value);
  }

  protected statusLabel(status: BlogStatus): string {
    switch (status) {
      case 'draft':
        return this.copy().postsFilterDraft;
      case 'review':
        return this.copy().postsFilterReview;
      case 'published':
        return this.copy().postsFilterPublished;
      default:
        return status;
    }
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=Image+Not+Available';
    img.classList.add('is-fallback');
  }

  protected exportReportCsv(): void {
    const rows = this.buildReportRows();
    if (!rows.length) {
      this.toastService.info(this.copy().exportNoData);
      return;
    }

    const filename = `dashboard-report-${this.exportDateStamp()}.csv`;
    this.exportService.downloadCsv(filename, this.reportHeaders(), rows);
    this.toastService.success(this.copy().exportStarted);
  }

  protected exportReportPdf(): void {
    const rows = this.buildReportRows();
    if (!rows.length) {
      this.toastService.info(this.copy().exportNoData);
      return;
    }

    const title = this.copy().dashboardAnalyticsReportTitle;
    const meta = [
      {
        label: this.copy().dashboardAnalyticsRangeLabel.replace('{days}', String(this.activityWindowDays)),
        value: `${this.formatDate(this.activityWindowStart())} - ${this.formatDate(new Date())}`
      },
      { label: this.copy().dashboardAnalyticsPostsLabel, value: String(this.totalPosts()) },
      { label: this.copy().dashboardAnalyticsUsersLabel, value: String(this.totalUsers()) }
    ];

    const filename = `dashboard-report-${this.exportDateStamp()}.pdf`;
    this.exportService.downloadPdf(filename, title, this.reportHeaders(), rows, meta);
    this.toastService.success(this.copy().exportStarted);
  }

  private reportHeaders(): string[] {
    return [
      this.copy().dashboardAnalyticsReportSection,
      this.copy().dashboardAnalyticsReportMetric,
      this.copy().dashboardAnalyticsReportValue
    ];
  }

  private buildReportRows(): Array<Array<string | number>> {
    const rows: Array<Array<string | number>> = [];

    rows.push([
      this.copy().dashboardAnalyticsPostsLabel,
      this.copy().dashboardStatsTotalLabel,
      this.totalPosts()
    ]);
    rows.push([
      this.copy().dashboardAnalyticsPostsLabel,
      this.copy().dashboardAnalyticsPublishedLabel,
      this.publishedPosts()
    ]);
    rows.push([
      this.copy().dashboardAnalyticsPostsLabel,
      this.copy().dashboardAnalyticsDraftLabel,
      this.draftPosts()
    ]);
    rows.push([
      this.copy().dashboardAnalyticsPostsLabel,
      this.copy().dashboardAnalyticsReviewLabel,
      this.reviewPosts()
    ]);

    rows.push([
      this.copy().dashboardAnalyticsUsersLabel,
      this.copy().dashboardAnalyticsTotalUsersLabel,
      this.totalUsers()
    ]);
    rows.push([
      this.copy().dashboardAnalyticsUsersLabel,
      this.copy().dashboardAnalyticsActiveUsersLabel,
      this.activeUsers()
    ]);
    rows.push([
      this.copy().dashboardAnalyticsUsersLabel,
      this.copy().dashboardAnalyticsNewUsersLabel,
      this.newUsersCount()
    ]);

    rows.push([
      this.copy().dashboardAnalyticsLoginsLabel,
      this.copy().dashboardAnalyticsRangeLabel.replace('{days}', String(this.activityWindowDays)),
      this.loginCount()
    ]);
    rows.push([
      this.copy().dashboardAnalyticsUserActivityLabel,
      this.copy().dashboardAnalyticsRangeLabel.replace('{days}', String(this.activityWindowDays)),
      this.userActivityCount()
    ]);
    rows.push([
      this.copy().dashboardAnalyticsPostActivityLabel,
      this.copy().dashboardAnalyticsRangeLabel.replace('{days}', String(this.activityWindowDays)),
      this.postActivityCount()
    ]);

    this.topContent().forEach((post, index) => {
      rows.push([
        this.copy().dashboardAnalyticsTopContentLabel,
        `${index + 1}. ${post.title}`,
        this.formatDate(post.updatedAt)
      ]);
    });

    return rows;
  }

  private exportDateStamp(): string {
    return new Date().toISOString().slice(0, 10);
  }
}

