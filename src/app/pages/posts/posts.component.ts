import { Component, computed, signal, inject, OnInit, effect } from '@angular/core';
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

      <div class="filters filter-panel" role="search" aria-label="Post filters">
        <div class="filter-group">
          <label for="post-search">{{ copy().postsFilterSearch }}</label>
          <input
            id="post-search"
            type="search"
            class="filter-control"
            [value]="searchQuery()"
            (input)="onSearchChange($event)"
            [placeholder]="copy().postsFilterSearchPlaceholder"
          />
        </div>

        <div class="filter-group">
          <label for="post-status">{{ copy().postsFilterStatus }}</label>
          <select id="post-status" class="filter-control" [value]="statusFilter()" (change)="onStatusChange($event)">
            <option value="">{{ copy().postsFilterAllStatuses }}</option>
            <option value="draft">{{ copy().postsFilterDraft }}</option>
            <option value="review">{{ copy().postsFilterReview }}</option>
            <option value="published">{{ copy().postsFilterPublished }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="post-author">{{ copy().postsFilterAuthor }}</label>
          <select id="post-author" class="filter-control" [value]="authorFilter()" (change)="onAuthorChange($event)">
            <option value="">{{ copy().postsFilterAllAuthors }}</option>
            @for (author of authorOptions(); track author) {
              <option [value]="author">{{ author }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label for="post-from">{{ copy().postsFilterFrom }}</label>
          <input id="post-from" type="date" class="filter-control" [value]="dateFrom()" (input)="onDateFromChange($event)" />
        </div>

        <div class="filter-group">
          <label for="post-to">{{ copy().postsFilterTo }}</label>
          <input id="post-to" type="date" class="filter-control" [value]="dateTo()" (input)="onDateToChange($event)" />
        </div>

        <button class="btn-secondary btn-reset" type="button" (click)="resetFilters()">{{ copy().postsFilterReset }}</button>
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
                <span class="ui-icon is-calendar" aria-hidden="true"></span>
                <time [attr.datetime]="blog.date.toISOString()">{{ formatDate(blog.date) }}</time>
              </p>
              <p class="post-excerpt">{{ blog.excerpt }}</p>

              <div class="status-selector" [attr.aria-label]="'Post status: ' + blog.status">
                <button
                  class="post-status-badge"
                  [class]="'status-' + blog.status"
                  (click)="toggleStatusDropdown(blog.id)"
                  type="button"
                  title="Click to change status"
                >
                  {{ blog.status | uppercase }}
                  <span class="dropdown-arrow" aria-hidden="true">▼</span>
                </button>
                @if (statusDropdownOpen() === blog.id) {
                  <div class="status-dropdown" role="menu">
                    <button
                      class="status-option"
                      [class.is-active]="blog.status === 'draft'"
                      (click)="changePostStatus(blog.id, 'draft')"
                      type="button"
                      role="menuitem"
                    >
                      Draft
                    </button>
                    <button
                      class="status-option"
                      [class.is-active]="blog.status === 'review'"
                      (click)="changePostStatus(blog.id, 'review')"
                      type="button"
                      role="menuitem"
                    >
                      Review
                    </button>
                    <button
                      class="status-option"
                      [class.is-active]="blog.status === 'published'"
                      (click)="changePostStatus(blog.id, 'published')"
                      type="button"
                      role="menuitem"
                    >
                      Published
                    </button>
                  </div>
                }
              </div>

              <div class="post-meta" [attr.aria-label]="copy().postsMetaLabel">
                <span class="post-time" [attr.aria-label]="copy().postsTimeLabel">
                  <span class="ui-icon is-clock" aria-hidden="true"></span>
                  {{ blog.time }}
                </span>
                @if (blog.location) {
                  <span class="post-location" [attr.aria-label]="copy().postsLocationLabel">
                    <span class="ui-icon is-location" aria-hidden="true"></span>
                    {{ blog.location }}
                  </span>
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
                  @if (blog.status !== 'published') {
                    <button
                      class="btn-icon btn-success"
                      (click)="onPublish(blog.id)"
                      [attr.aria-label]="'Publish ' + blog.title"
                      type="button"
                      title="Publish post"
                    >
                      <span class="ui-icon is-check" aria-hidden="true"></span>
                    </button>
                  }
                  <a
                    class="btn-icon"
                    [routerLink]="['/posts/edit', blog.id]"
                    [attr.aria-label]="copy().postsEditPrefix + ' ' + blog.title"
                  >
                    <span class="ui-icon is-edit" aria-hidden="true"></span>
                  </a>
                  <button
                    class="btn-icon btn-danger"
                    (click)="onDelete(blog.id)"
                    [attr.aria-label]="copy().postsDeletePrefix + ' ' + blog.title"
                    type="button"
                  >
                    <span class="ui-icon is-trash" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        } @empty {
          <div class="empty-state" role="status" aria-live="polite">
            <p class="state-message is-empty" data-icon="-">{{ copy().postsEmptyText }}</p>
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

    .status-selector {
      position: relative;
      display: inline-block;
      margin-bottom: 12px;
    }

    .post-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid transparent;
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.2s;
      background: none;
    }

    .post-status-badge:hover {
      transform: translateY(-1px);
      border-color: currentColor;
      opacity: 0.9;
    }

    .post-status-badge.status-draft {
      background: color-mix(in srgb, #f59e0b 15%, var(--surface));
      color: #b45309;
    }

    .post-status-badge.status-review {
      background: color-mix(in srgb, #6366f1 15%, var(--surface));
      color: #4338ca;
    }

    .post-status-badge.status-published {
      background: color-mix(in srgb, #10b981 15%, var(--surface));
      color: #065f46;
    }

    .dropdown-arrow {
      font-size: 6px;
      transition: transform 0.2s;
    }

    .post-status-badge:hover .dropdown-arrow {
      transform: translateY(1px);
    }

    .status-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: var(--shadow-strong);
      min-width: 120px;
      z-index: 100;
      margin-top: 4px;
      overflow: hidden;
    }

    .status-option {
      display: block;
      width: 100%;
      padding: 10px 12px;
      border: none;
      background: none;
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: all 0.15s;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .status-option:hover {
      background: var(--surface-alt);
      color: var(--primary);
    }

    .status-option.is-active {
      background: color-mix(in srgb, var(--primary) 10%, var(--surface));
      color: var(--primary);
      font-weight: 700;
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
      display: flex;
      align-items: center;
      gap: 6px;
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
      border: 1px solid var(--border);
      color: var(--text);
      width: 36px;
      height: 36px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
      padding: 0;
    }

    .btn-icon:hover {
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-2px);
    }

    .btn-icon.btn-danger {
      color: var(--danger);
      border-color: var(--danger);
    }

    .btn-icon.btn-danger:hover {
      background: color-mix(in srgb, var(--danger) 10%, var(--surface));
    }

    .btn-icon.btn-success {
      color: #10b981;
      border-color: #10b981;
    }

    .btn-icon.btn-success:hover {
      background: color-mix(in srgb, #10b981 10%, var(--surface));
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
        padding: 0;
        border-radius: 16px;
        border: 1px solid var(--border);
        background: linear-gradient(180deg, var(--surface), var(--surface-elev));
        box-shadow: var(--shadow-card);
      }

      .post-image {
        height: 200px;
      }

      .post-content {
        padding: 18px;
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
        gap: 10px;
      }

      .btn-secondary {
        flex: 1 1 100%;
        min-width: 0;
        padding: 10px 14px;
        border-radius: 10px;
      }

      .action-buttons {
        width: 100%;
        justify-content: center;
        gap: 12px;
      }

      .btn-icon {
        background: var(--surface-alt);
        border: 1px solid var(--border);
        width: 40px;
        height: 40px;
        border-radius: 12px;
      }

      .btn-icon:hover {
        transform: translateY(-1px);
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
  protected searchQuery = signal('');
  protected statusFilter = signal('');
  protected authorFilter = signal('');
  protected dateFrom = signal('');
  protected dateTo = signal('');
  protected currentPage = signal(1);
  protected itemsPerPage = 6;
  protected statusDropdownOpen = signal<string>('');

  protected authorOptions = computed(() => {
    const names = this.blogs()
      .map((blog) => blog.authorName)
      .filter((name): name is string => Boolean(name));
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  });

  protected filteredBlogs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    const author = this.authorFilter();
    const from = this.dateFrom();
    const to = this.dateTo();

    return this.blogs().filter((blog) => {
      if (status && blog.status !== status) {
        return false;
      }

      if (author && blog.authorName !== author) {
        return false;
      }

      if (!this.matchesDateRange(blog.date, from, to)) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = [
        blog.title,
        blog.excerpt,
        blog.content,
        blog.authorName,
        blog.location,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  protected totalBlogs = computed(() => this.filteredBlogs().length);
  protected totalPages = computed(() => Math.ceil(this.totalBlogs() / this.itemsPerPage));
  protected startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage);
  protected endIndex = computed(() => Math.min(this.startIndex() + this.itemsPerPage, this.totalBlogs()));

  protected paginatedBlogs = computed(() => {
    const start = this.startIndex();
    const end = this.endIndex();
    return this.filteredBlogs().slice(start, end);
  });

  private filterEffect = effect(() => {
    this.searchQuery();
    this.statusFilter();
    this.authorFilter();
    this.dateFrom();
    this.dateTo();
    this.currentPage.set(1);
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

  protected onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  protected onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.statusFilter.set(value);
  }

  protected onAuthorChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.authorFilter.set(value);
  }

  protected onDateFromChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dateFrom.set(value);
  }

  protected onDateToChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dateTo.set(value);
  }

  protected resetFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('');
    this.authorFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.currentPage.set(1);
  }

  protected onEdit(id: string): void {
    this.router.navigate(['/posts/edit', id]);
  }

  protected toggleStatusDropdown(postId: string): void {
    if (this.statusDropdownOpen() === postId) {
      this.statusDropdownOpen.set('');
    } else {
      this.statusDropdownOpen.set(postId);
    }
  }

  protected async changePostStatus(id: string, newStatus: 'draft' | 'review' | 'published'): Promise<void> {
    const blog = this.blogs().find(b => b.id === id);
    if (!blog) return;

    this.statusDropdownOpen.set('');

    if (blog.status === newStatus) {
      return;
    }

    try {
      if (newStatus === 'published') {
        await this.blogService.publishBlog(id);
        this.toastService.success('Post published successfully');
      } else if (newStatus === 'review') {
        await this.blogService.submitForReview(id);
        this.toastService.success('Post submitted for review');
      } else {
        // Draft - just update status
        await this.blogService.updateBlog(id, { status: 'draft' } as any);
        this.toastService.success('Post status changed to draft');
      }
    } catch (error) {
      this.toastService.error('Failed to change post status');
    }
  }

  protected async onPublish(id: string): Promise<void> {
    const blog = this.blogs().find(b => b.id === id);
    if (!blog) return;

    const confirmed = await this.confirmationService.confirm({
      title: 'Publish Post',
      message: `Are you sure you want to publish "${blog.title}"? Once published, it will be visible to all users.`,
      confirmText: 'Publish',
      cancelText: this.copy().commonCancel,
      confirmButtonClass: 'primary'
    });

    if (confirmed) {
      try {
        await this.blogService.publishBlog(id);
        this.toastService.success('Post published successfully');
      } catch (error) {
        this.toastService.error('Failed to publish post');
      }
    }
  }

  protected async onSubmitForReview(id: string): Promise<void> {
    const blog = this.blogs().find(b => b.id === id);
    if (!blog) return;

    const confirmed = await this.confirmationService.confirm({
      title: 'Submit for Review',
      message: `Submit "${blog.title}" for review? An admin will need to approve it before it's published.`,
      confirmText: 'Submit',
      cancelText: this.copy().commonCancel,
      confirmButtonClass: 'primary'
    });

    if (confirmed) {
      try {
        await this.blogService.submitForReview(id);
        this.toastService.success('Post submitted for review');
      } catch (error) {
        this.toastService.error('Failed to submit post for review');
      }
    }
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

  private matchesDateRange(date: Date, from: string, to: string): boolean {
    if (!from && !to) {
      return true;
    }

    const value = date.getTime();
    if (from) {
      const fromDate = new Date(`${from}T00:00:00`).getTime();
      if (value < fromDate) {
        return false;
      }
    }

    if (to) {
      const toDate = new Date(`${to}T23:59:59`).getTime();
      if (value > toDate) {
        return false;
      }
    }

    return true;
  }
}

