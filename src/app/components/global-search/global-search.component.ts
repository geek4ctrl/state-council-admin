import { Component, computed, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService, SearchResult } from '../../services/search.service';
import { LanguageService } from '../../services/language.service';
import { Blog } from '../../models/blog.model';
import { User } from '../../models/user.model';
import { AuditLog } from '../../models/audit-log.model';

@Component({
  selector: 'app-global-search',
  imports: [CommonModule],
  template: `
    <div class="global-search">
      <div class="search-input-wrapper">
        <input
          type="search"
          class="search-input"
          [placeholder]="copy().searchGlobalPlaceholder"
          [value]="searchQuery()"
          (input)="onSearchInput($event)"
          (focus)="onFocus()"
          (keydown.escape)="closeResults()"
          aria-label="Global search"
        />
        <span class="search-icon" aria-hidden="true">🔍</span>
        @if (searchQuery()) {
          <button
            class="clear-button"
            type="button"
            (click)="clearSearch()"
            aria-label="Clear search"
          >
            ✕
          </button>
        }
      </div>

      @if (showResults() && searchResults().length > 0) {
        <div class="search-results">
          <div class="results-header">
            <span class="results-count">
              {{ copy().searchResultsCount.replace('{count}', searchResults().length.toString()) }}
            </span>
          </div>
          <div class="results-list">
            @for (result of searchResults(); track result.item.id) {
              <button
                class="result-item"
                type="button"
                (click)="navigateToResult(result)"
              >
                <div class="result-type-badge" [class]="'badge-' + result.type">
                  {{ getResultTypeName(result.type) }}
                </div>
                <div class="result-content">
                  <div class="result-title">{{ getResultTitle(result) }}</div>
                  <div class="result-subtitle">{{ getResultSubtitle(result) }}</div>
                  @if (result.matchedFields.length > 0) {
                    <div class="result-matches">
                      <span class="matches-label">{{ copy().searchMatchedIn }}</span>
                      {{ result.matchedFields.join(', ') }}
                    </div>
                  }
                </div>
                <div class="result-score" [attr.aria-label]="'Match score: ' + result.matchScore">
                  {{ result.matchScore }}
                </div>
              </button>
            }
          </div>
        </div>
      }

      @if (showResults() && searchQuery() && searchResults().length === 0) {
        <div class="search-results">
          <div class="no-results">
            <span class="no-results-icon" aria-hidden="true">🔍</span>
            <div class="no-results-text">{{ copy().searchNoResults }}</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .global-search {
      position: relative;
      width: 100%;
      max-width: 400px;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: 8px 36px 8px 36px;
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 12px;
      background: var(--surface);
      color: var(--text);
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: var(--ring);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      font-size: 14px;
      opacity: 0.6;
      pointer-events: none;
    }

    .clear-button {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 16px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .clear-button:hover {
      background: var(--surface-alt);
      color: var(--text);
    }

    .search-results {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: var(--shadow-strong);
      max-height: 400px;
      overflow: hidden;
      z-index: 1000;
    }

    .results-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      background: var(--surface-alt);
    }

    .results-count {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--text-muted);
    }

    .results-list {
      max-height: 350px;
      overflow-y: auto;
    }

    .result-item {
      width: 100%;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border: none;
      border-bottom: 1px solid var(--border);
      background: none;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s;
    }

    .result-item:last-child {
      border-bottom: none;
    }

    .result-item:hover {
      background: var(--surface-alt);
    }

    .result-type-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .badge-post {
      background: color-mix(in srgb, var(--primary) 15%, var(--surface));
      color: var(--primary-strong);
      border: 1px solid color-mix(in srgb, var(--primary) 30%, var(--border));
    }

    .badge-user {
      background: color-mix(in srgb, var(--accent-2) 15%, var(--surface));
      color: var(--accent-2);
      border: 1px solid color-mix(in srgb, var(--accent-2) 30%, var(--border));
    }

    .badge-audit {
      background: color-mix(in srgb, var(--accent-3) 15%, var(--surface));
      color: var(--accent-3);
      border: 1px solid color-mix(in srgb, var(--accent-3) 30%, var(--border));
    }

    .result-content {
      flex: 1;
      min-width: 0;
    }

    .result-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-subtitle {
      font-size: 11px;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-matches {
      font-size: 9px;
      color: var(--text-subtle);
      margin-top: 4px;
    }

    .matches-label {
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .result-score {
      font-size: 10px;
      font-weight: 700;
      color: var(--primary);
      background: color-mix(in srgb, var(--primary) 12%, var(--surface));
      padding: 4px 8px;
      border-radius: 999px;
      flex-shrink: 0;
    }

    .no-results {
      padding: 32px 16px;
      text-align: center;
    }

    .no-results-icon {
      font-size: 32px;
      opacity: 0.3;
      display: block;
      margin-bottom: 8px;
    }

    .no-results-text {
      font-size: 12px;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .global-search {
        max-width: none;
      }

      .search-results {
        left: -16px;
        right: -16px;
        max-height: 60vh;
      }
    }
  `]
})
export class GlobalSearchComponent {
  private searchService = inject(SearchService);
  private languageService = inject(LanguageService);
  private router = inject(Router);

  protected copy = this.languageService.copy;
  protected searchQuery = signal('');
  protected showResults = signal(false);
  protected searchResults = signal<SearchResult[]>([]);
  protected isSearching = signal(false);

  private searchTimeout: any;

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);

    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Debounce search
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }

  private performSearch(): void {
    const query = this.searchQuery().trim();
    
    if (query.length < 2) {
      this.searchResults.set([]);
      this.showResults.set(false);
      return;
    }

    this.isSearching.set(true);
    this.showResults.set(true);

    try {
      const results = this.searchService.globalSearch(query);
      this.searchResults.set(results.slice(0, 10)); // Limit to top 10 results
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults.set([]);
    } finally {
      this.isSearching.set(false);
    }
  }

  protected onFocus(): void {
    if (this.searchQuery().trim().length >= 2) {
      this.showResults.set(true);
    }
  }

  protected closeResults(): void {
    this.showResults.set(false);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showResults.set(false);
  }

  protected getResultTypeName(type: string): string {
    const copy = this.copy();
    switch (type) {
      case 'post':
        return copy.searchResultPost;
      case 'user':
        return copy.searchResultUser;
      case 'audit':
        return copy.searchResultAudit;
      default:
        return type;
    }
  }

  protected getResultTitle(result: SearchResult): string {
    switch (result.type) {
      case 'post':
        return (result.item as Blog).title;
      case 'user':
        return (result.item as User).name;
      case 'audit':
        return (result.item as AuditLog).action;
      default:
        return '';
    }
  }

  protected getResultSubtitle(result: SearchResult): string {
    switch (result.type) {
      case 'post':
        const post = result.item as Blog;
        return `${post.category} • ${post.authorName}`;
      case 'user':
        return (result.item as User).email;
      case 'audit':
        const audit = result.item as AuditLog;
        const timestamp = audit.createdAt ? new Date(audit.createdAt).toLocaleString() : 'Unknown date';
        return `${audit.actorEmail || 'Unknown'} • ${timestamp}`;
      default:
        return '';
    }
  }

  protected navigateToResult(result: SearchResult): void {
    this.closeResults();
    this.clearSearch();

    switch (result.type) {
      case 'post':
        this.router.navigate(['/posts', result.item.id]);
        break;
      case 'user':
        this.router.navigate(['/users']);
        break;
      case 'audit':
        this.router.navigate(['/audit-log']);
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.global-search')) {
      this.closeResults();
    }
  }
}
