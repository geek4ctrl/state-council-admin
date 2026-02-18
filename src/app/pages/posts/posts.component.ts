import { Component, computed, signal, inject, OnInit, effect, HostListener } from '@angular/core';
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
      <section class="page-hero" aria-labelledby="page-title">
        <div class="page-header">
          <div class="title-stack">
            <h1 id="page-title">{{ copy().postsTitle }}</h1>
            <span class="page-count">{{ totalBlogs() }} {{ copy().postsCountSuffix }}</span>
          </div>
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

        @if (activeFilters().length) {
          <div class="active-filters" role="group" [attr.aria-label]="copy().postsFilterReset">
            @for (filter of activeFilters(); track filter.key) {
              <button
                class="filter-chip"
                type="button"
                (click)="clearFilter(filter.key)"
                [attr.aria-label]="copy().postsRemoveFilterLabel + ' ' + filter.label"
              >
                <span class="chip-label">{{ filter.label }}</span>
                <span class="chip-remove" aria-hidden="true">×</span>
              </button>
            }
            <button class="btn-link" type="button" (click)="resetFilters()">{{ copy().postsFilterReset }}</button>
          </div>
        }
      </section>

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
              <div class="title-row">
                <h3 class="post-title">{{ blog.title }}</h3>
                <div class="status-selector" [attr.aria-label]="copy().postsFilterStatus + ': ' + statusLabel(blog.status)">
                  <button
                    class="post-status-badge"
                    [class]="'status-' + blog.status"
                    (click)="toggleStatusDropdown(blog.id)"
                    type="button"
                  >
                    {{ blog.status | uppercase }}
                    <span class="dropdown-arrow" aria-hidden="true">▼</span>
                  </button>
                  <span
                    class="status-tooltip"
                    [attr.data-tooltip]="copy().postsFilterStatus + ': ' + statusLabel(blog.status)"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <circle cx="12" cy="12" r="9"></circle>
                      <path d="M12 10v6"></path>
                      <circle cx="12" cy="7" r="1"></circle>
                    </svg>
                  </span>
                  @if (statusDropdownOpen() === blog.id) {
                    <div class="status-dropdown" role="menu">
                      <button
                        class="status-option"
                        [class.is-active]="blog.status === 'draft'"
                        (click)="changePostStatus(blog.id, 'draft')"
                        type="button"
                        role="menuitem"
                      >
                        {{ copy().postsFilterDraft }}
                      </button>
                      <button
                        class="status-option"
                        [class.is-active]="blog.status === 'review'"
                        (click)="changePostStatus(blog.id, 'review')"
                        type="button"
                        role="menuitem"
                      >
                        {{ copy().postsFilterReview }}
                      </button>
                      <button
                        class="status-option"
                        [class.is-active]="blog.status === 'published'"
                        (click)="changePostStatus(blog.id, 'published')"
                        type="button"
                        role="menuitem"
                      >
                        {{ copy().postsFilterPublished }}
                      </button>
                    </div>
                  }
                </div>
              </div>
              <p class="post-date">
                <span class="ui-icon is-calendar" aria-hidden="true"></span>
                <time [attr.datetime]="blog.date.toISOString()">{{ formatDate(blog.date) }}</time>
              </p>
              <p class="post-excerpt">{{ blog.excerpt }}</p>

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
                <div class="action-menu" role="group" [attr.aria-label]="copy().postsActionsLabel">
                  <button
                    class="btn-icon btn-kebab"
                    (click)="toggleActionMenu(blog.id)"
                    [attr.aria-label]="copy().postsActionsLabel"
                    type="button"
                  >
                    <span class="kebab" aria-hidden="true">···</span>
                  </button>
                  @if (actionMenuOpen() === blog.id) {
                    <div class="action-dropdown" role="menu">
                      @if (blog.status !== 'published') {
                        <button
                          class="action-item is-success"
                          (click)="onPublish(blog.id)"
                          type="button"
                          role="menuitem"
                        >
                          {{ copy().postsFilterPublished }}
                        </button>
                      }
                      <a
                        class="action-item"
                        [routerLink]="['/posts/edit', blog.id]"
                        (click)="closeActionMenu()"
                        role="menuitem"
                      >
                        {{ copy().postsEditPrefix }}
                      </a>
                      <button
                        class="action-item is-danger"
                        (click)="onDelete(blog.id)"
                        type="button"
                        role="menuitem"
                      >
                        {{ copy().postsDeletePrefix }}
                      </button>
                    </div>
                  }
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

    .page-hero {
      padding: 18px 20px 20px;
      margin: -8px 0 24px;
      border-radius: 16px;
      background: linear-gradient(180deg, color-mix(in srgb, var(--surface) 85%, transparent) 0%, var(--surface-elev) 100%);
      border: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
      box-shadow: var(--shadow-soft);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .title-stack {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 600;
      margin: 0;
      color: var(--text);
    }

    .page-count {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: var(--text-subtle);
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--surface);
      border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      align-items: end;
      padding: 12px;
      background: var(--surface);
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-group label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .filter-control {
      width: 100%;
      border: 1px solid var(--border);
      background: var(--surface-alt);
      color: var(--text);
      border-radius: 10px;
      padding: 8px 10px;
      font-size: 11px;
      font-weight: 600;
    }

    .btn-reset {
      align-self: flex-end;
      margin-top: 18px;
    }

    .active-filters {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
      background: var(--surface);
      font-size: 10px;
      font-weight: 600;
      color: var(--text);
      cursor: pointer;
    }

    .chip-remove {
      font-size: 12px;
      color: var(--text-muted);
    }

    .btn-link {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      cursor: pointer;
      padding: 6px 8px;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }


    .post-card {
      background: var(--surface);
      border-radius: 12px;
      overflow: visible;
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
      border-radius: 12px 12px 0 0;
    }

    .post-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .post-image.is-fallback {
      background: linear-gradient(135deg, #eef2f7 0%, #e2e8f0 100%);
    }

    .post-image.is-fallback img {
      object-fit: contain;
      padding: 22px;
      filter: grayscale(0.1);
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
      padding: 20px 22px 22px;
    }

    .title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .post-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 6px 0;
      color: var(--text);
      line-height: 1.4;
    }

    .post-date {
      font-size: 10px;
      color: var(--text-muted);
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .post-excerpt {
      font-size: 12px;
      color: var(--text-subtle);
      margin: 0 0 12px 0;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .status-selector {
      position: relative;
      display: inline-block;
      margin-top: 2px;
    }

    .status-tooltip {
      width: 18px;
      height: 18px;
      margin-left: 6px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
      background: var(--surface);
      color: var(--text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      cursor: default;
      position: relative;
    }

    .status-tooltip svg {
      width: 12px;
      height: 12px;
      stroke: currentColor;
      stroke-width: 1.8;
      fill: none;
    }

    .status-tooltip::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 130%;
      left: 50%;
      transform: translateX(-50%);
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 10px;
      white-space: nowrap;
      box-shadow: var(--shadow-soft);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }

    .status-tooltip:hover::after {
      opacity: 1;
    }

    .post-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 6px 12px;
      border-radius: 999px;
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
      background: color-mix(in srgb, var(--accent-3) 18%, var(--surface));
      color: color-mix(in srgb, var(--accent-3) 70%, var(--text));
    }

    .post-status-badge.status-review {
      background: color-mix(in srgb, var(--accent-2) 18%, var(--surface));
      color: color-mix(in srgb, var(--accent-2) 70%, var(--text));
    }

    .post-status-badge.status-published {
      background: color-mix(in srgb, var(--accent-1) 18%, var(--surface));
      color: color-mix(in srgb, var(--accent-1) 70%, var(--text));
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

    .post-meta {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px 16px;
      margin-bottom: 14px;
      padding-bottom: 12px;
      border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
    }

    .post-time, .post-location {
      font-size: 10px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .post-meta .ui-icon {
      font-size: 12px;
      width: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .post-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .action-menu {
      position: relative;
      display: inline-flex;
      align-items: center;
      opacity: 0.4;
      transition: opacity 0.2s;
    }

    .post-card:hover .action-menu,
    .post-card:focus-within .action-menu {
      opacity: 1;
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

    .btn-icon.btn-kebab {
      border-radius: 10px;
      background: var(--surface-alt);
    }

    .kebab {
      font-size: 18px;
      letter-spacing: 1px;
    }

    .action-dropdown {
      position: absolute;
      right: 0;
      top: calc(100% + 6px);
      min-width: 160px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: var(--shadow-strong);
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 10;
    }

    .action-item {
      border: none;
      background: none;
      padding: 9px 12px;
      font-size: 11px;
      font-weight: 600;
      text-align: left;
      border-radius: 8px;
      color: var(--text);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }

    .action-item:hover {
      background: var(--surface-alt);
      color: var(--primary);
    }

    .action-item.is-danger {
      color: var(--danger);
    }

    .action-item.is-danger:hover {
      background: color-mix(in srgb, var(--danger) 10%, var(--surface));
    }

    .action-item.is-success {
      color: #10b981;
    }

    .action-item.is-success:hover {
      background: color-mix(in srgb, #10b981 12%, var(--surface));
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

      .page-hero {
        padding: 16px;
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

      .title-stack {
        flex-wrap: wrap;
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

      .btn-icon {
        background: var(--surface-alt);
        border: 1px solid var(--border);
        width: 40px;
        height: 40px;
        border-radius: 12px;
      }

      .action-menu {
        opacity: 1;
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
  protected actionMenuOpen = signal<string>('');

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

  protected activeFilters = computed(() => {
    const filters: Array<{ key: string; label: string }> = [];
    const copy = this.copy();

    const query = this.searchQuery().trim();
    if (query) {
      filters.push({ key: 'search', label: `${copy.postsFilterSearch}: ${query}` });
    }

    const status = this.statusFilter();
    if (status) {
      filters.push({ key: 'status', label: `${copy.postsFilterStatus}: ${this.statusLabel(status)}` });
    }

    const author = this.authorFilter();
    if (author) {
      filters.push({ key: 'author', label: `${copy.postsFilterAuthor}: ${author}` });
    }

    const from = this.dateFrom();
    const to = this.dateTo();
    if (from || to) {
      const range = [from || '...', to || '...'].join(' - ');
      filters.push({ key: 'date', label: `${copy.postsFilterFrom}/${copy.postsFilterTo}: ${range}` });
    }

    return filters;
  });

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

  protected closeStatusDropdown(): void {
    this.statusDropdownOpen.set('');
  }

  protected toggleActionMenu(postId: string): void {
    if (this.actionMenuOpen() === postId) {
      this.actionMenuOpen.set('');
    } else {
      this.actionMenuOpen.set(postId);
    }
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) {
      this.closeActionMenu();
      this.closeStatusDropdown();
      return;
    }

    if (this.actionMenuOpen() && !target.closest('.action-menu')) {
      this.closeActionMenu();
    }

    if (this.statusDropdownOpen() && !target.closest('.status-selector')) {
      this.closeStatusDropdown();
    }
  }

  protected closeActionMenu(): void {
    this.actionMenuOpen.set('');
  }

  protected clearFilter(key: string): void {
    switch (key) {
      case 'search':
        this.searchQuery.set('');
        break;
      case 'status':
        this.statusFilter.set('');
        break;
      case 'author':
        this.authorFilter.set('');
        break;
      case 'date':
        this.dateFrom.set('');
        this.dateTo.set('');
        break;
      default:
        break;
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
        this.toastService.success(this.copy().postsPublishSuccess);
      } else if (newStatus === 'review') {
        await this.blogService.submitForReview(id);
        this.toastService.success(this.copy().postsSubmitReviewSuccess);
      } else {
        // Draft - just update status
        await this.blogService.updateBlog(id, { status: 'draft' } as any);
        this.toastService.success(this.copy().postsDraftSuccess);
      }
    } catch (error) {
      this.toastService.error(this.copy().postsStatusChangeError);
    }
  }

  protected async onPublish(id: string): Promise<void> {
    this.closeActionMenu();
    const blog = this.blogs().find(b => b.id === id);
    if (!blog) return;

    const confirmed = await this.confirmationService.confirm({
      title: this.copy().postsPublishTitle,
      message: this.copy().postsPublishMessage.replace('{title}', blog.title),
      confirmText: this.copy().postsPublishConfirm,
      cancelText: this.copy().commonCancel,
      confirmButtonClass: 'primary'
    });

    if (confirmed) {
      try {
        await this.blogService.publishBlog(id);
        this.toastService.success(this.copy().postsPublishSuccess);
      } catch (error) {
        this.toastService.error(this.copy().postsPublishError);
      }
    }
  }

  protected async onSubmitForReview(id: string): Promise<void> {
    const blog = this.blogs().find(b => b.id === id);
    if (!blog) return;

    const confirmed = await this.confirmationService.confirm({
      title: this.copy().postsSubmitReviewTitle,
      message: this.copy().postsSubmitReviewMessage.replace('{title}', blog.title),
      confirmText: this.copy().postsSubmitReviewConfirm,
      cancelText: this.copy().commonCancel,
      confirmButtonClass: 'primary'
    });

    if (confirmed) {
      try {
        await this.blogService.submitForReview(id);
        this.toastService.success(this.copy().postsSubmitReviewSuccess);
      } catch (error) {
        this.toastService.error(this.copy().postsSubmitReviewError);
      }
    }
  }

  protected async onDelete(id: string): Promise<void> {
    this.closeActionMenu();
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
    const text = encodeURIComponent(this.copy().postsImageFallbackText);
    img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%23f1f5f9"/><stop offset="1" stop-color="%23e2e8f0"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><rect x="210" y="140" width="180" height="120" rx="16" fill="%23e2e8f0" stroke="%23cbd5f5" stroke-width="2"/><circle cx="255" cy="180" r="14" fill="%2394a3b8"/><path d="M230 230l35-35 25 25 30-30 50 40" fill="none" stroke="%2394a3b8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="290" text-anchor="middle" font-family="Segoe UI, Arial" font-size="16" fill="%2394a3b8">${text}</text></svg>`;
    img.parentElement?.classList.add('is-fallback');
  }

  protected statusLabel(status: string): string {
    const copy = this.copy();
    switch (status) {
      case 'draft':
        return copy.postsFilterDraft;
      case 'review':
        return copy.postsFilterReview;
      case 'published':
        return copy.postsFilterPublished;
      default:
        return status;
    }
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

