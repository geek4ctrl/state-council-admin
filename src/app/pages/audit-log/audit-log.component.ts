import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogService } from '../../services/audit-log.service';
import { AuditLog } from '../../models/audit-log.model';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-audit-log',
  imports: [CommonModule],
  template: `
    <div class="audit-page" role="main">
      <div class="page-header">
        <div>
          <h1 id="audit-title">{{ copy().auditLogTitle }}</h1>
          <p class="subtitle">{{ copy().auditLogSubtitle }}</p>
        </div>
        <span class="log-count">{{ total() }} {{ copy().auditLogCountSuffix }}</span>
      </div>

      <div class="filters" role="search" aria-label="Audit log filters">
        <div class="filter-group">
          <label for="audit-search">{{ copy().auditLogSearchLabel }}</label>
          <input
            id="audit-search"
            type="search"
            [value]="searchQuery()"
            (input)="onSearchChange($event)"
            [placeholder]="copy().auditLogSearchPlaceholder"
          />
        </div>

        <div class="filter-group">
          <label for="audit-action">{{ copy().auditLogActionLabel }}</label>
          <select id="audit-action" [value]="actionFilter()" (change)="onActionChange($event)">
            @for (option of actionOptions(); track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label for="audit-entity">{{ copy().auditLogEntityLabel }}</label>
          <select id="audit-entity" [value]="entityFilter()" (change)="onEntityChange($event)">
            @for (option of entityOptions(); track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label for="audit-actor">{{ copy().auditLogActorLabel }}</label>
          <input
            id="audit-actor"
            type="text"
            [value]="actorQuery()"
            (input)="onActorChange($event)"
            [placeholder]="copy().auditLogActorPlaceholder"
          />
        </div>

        <div class="filter-group">
          <label for="audit-from">{{ copy().auditLogFromLabel }}</label>
          <input id="audit-from" type="date" [value]="dateFrom()" (input)="onDateFromChange($event)" />
        </div>

        <div class="filter-group">
          <label for="audit-to">{{ copy().auditLogToLabel }}</label>
          <input id="audit-to" type="date" [value]="dateTo()" (input)="onDateToChange($event)" />
        </div>

        <button class="btn-secondary btn-reset" type="button" (click)="resetFilters()">
          {{ copy().auditLogResetFilters }}
        </button>
      </div>

      @if (loading()) {
        <p class="empty-message" role="status">{{ copy().auditLogLoading }}</p>
      } @else if (error()) {
        <p class="empty-message" role="status">{{ copy().auditLogLoadError }}</p>
      } @else if (logs().length === 0) {
        <p class="empty-message" role="status">{{ copy().auditLogEmpty }}</p>
      } @else {
        <div class="table-wrapper" role="region" aria-labelledby="audit-title">
          <table class="audit-table">
            <thead>
              <tr>
                <th scope="col">{{ copy().auditLogTableTime }}</th>
                <th scope="col">{{ copy().auditLogTableActor }}</th>
                <th scope="col">{{ copy().auditLogTableAction }}</th>
                <th scope="col">{{ copy().auditLogTableEntity }}</th>
                <th scope="col">{{ copy().auditLogTableIp }}</th>
                <th scope="col">{{ copy().auditLogTableDetails }}</th>
              </tr>
            </thead>
            <tbody>
              @for (log of logs(); track log.id) {
                <tr>
                  <td>
                    <time [attr.datetime]="log.createdAt.toISOString()">
                      {{ formatDate(log.createdAt) }}
                    </time>
                  </td>
                  <td>
                    <div class="cell-stack">
                      <span class="primary">{{ formatActor(log) }}</span>
                      <span class="secondary" *ngIf="log.actorId">#{{ log.actorId }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="pill">{{ formatAction(log.action) }}</span>
                  </td>
                  <td>
                    <div class="cell-stack">
                      <span class="primary">{{ formatEntity(log.entityType) }}</span>
                      <span class="secondary" *ngIf="log.entityId">#{{ log.entityId }}</span>
                    </div>
                  </td>
                  <td>{{ log.ip ?? copy().commonNotAvailable }}</td>
                  <td class="details">{{ formatDetails(log.details) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (totalPages() > 1) {
          <nav class="pagination" role="navigation" [attr.aria-label]="copy().auditLogPaginationLabel">
            <button
              class="pagination-btn"
              (click)="previousPage()"
              [disabled]="currentPage() === 1"
            >
              {{ copy().auditLogPrevText }}
            </button>

            <div class="pagination-info" role="status">
              {{ copy().auditLogPageLabel }} {{ currentPage() }} {{ copy().auditLogOfText }} {{ totalPages() }}
            </div>

            <button
              class="pagination-btn"
              (click)="nextPage()"
              [disabled]="currentPage() === totalPages()"
            >
              {{ copy().auditLogNextText }}
            </button>
          </nav>
        }
      }
    </div>
  `,
  styles: [`
    .audit-page {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 30px;
      font-weight: 400;
      margin: 0 0 6px 0;
      color: var(--text-muted);
    }

    .subtitle {
      margin: 0;
      color: var(--text-subtle);
      font-size: 13px;
    }

    .log-count {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px;
      background: var(--surface);
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-soft);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-group label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--text-subtle);
    }

    .filter-group input,
    .filter-group select {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 12px;
      background: var(--surface);
      color: var(--text);
      transition: border-color 0.2s;
    }

    .filter-group input:focus,
    .filter-group select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: var(--ring);
    }

    .btn-reset {
      align-self: end;
      justify-self: end;
      height: 36px;
    }

    .btn-secondary {
      background: var(--surface-alt);
      color: var(--text);
      border: 1px solid var(--border);
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: color-mix(in srgb, var(--primary) 10%, var(--surface-alt));
      border-color: var(--primary);
    }

    .empty-message {
      text-align: center;
      color: var(--text-subtle);
      padding: 64px 20px;
      font-size: 14px;
    }

    .table-wrapper {
      background: var(--surface);
      border-radius: 12px;
      padding: 8px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-soft);
      overflow-x: auto;
    }

    .audit-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 900px;
    }

    th,
    td {
      text-align: left;
      padding: 12px 14px;
      font-size: 12px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }

    th {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--text-subtle);
    }

    .cell-stack {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .cell-stack .primary {
      font-weight: 600;
      color: var(--text);
    }

    .cell-stack .secondary {
      font-size: 10px;
      color: var(--text-subtle);
    }

    .pill {
      display: inline-flex;
      padding: 2px 8px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary) 15%, transparent);
      font-size: 10px;
      font-weight: 600;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .details {
      max-width: 320px;
      color: var(--text-subtle);
      white-space: normal;
      word-break: break-word;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }

    .pagination-btn {
      background: var(--surface-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text);
      cursor: pointer;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-info {
      font-size: 11px;
      color: var(--text-subtle);
    }
  `]
})
export class AuditLogComponent implements OnInit {
  private auditLogService = inject(AuditLogService);
  private languageService = inject(LanguageService);
  protected copy = this.languageService.copy;

  protected logs = signal<AuditLog[]>([]);
  protected total = signal(0);
  protected loading = signal(true);
  protected error = signal(false);

  protected searchQuery = signal('');
  protected actionFilter = signal('');
  protected entityFilter = signal('');
  protected actorQuery = signal('');
  protected dateFrom = signal('');
  protected dateTo = signal('');
  protected currentPage = signal(1);
  private pageSize = 20;

  protected totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));

  protected actionOptions = computed(() => [
    { value: '', label: this.copy().auditLogActionAll },
    { value: 'auth.login', label: this.copy().auditLogActionLogin },
    { value: 'auth.register', label: this.copy().auditLogActionRegister },
    { value: 'users.role_updated', label: this.copy().auditLogActionRoleUpdated },
    { value: 'users.lock_updated', label: this.copy().auditLogActionLockUpdated },
    { value: 'users.password_reset', label: this.copy().auditLogActionPasswordReset },
    { value: 'posts.created', label: this.copy().auditLogActionPostCreated },
    { value: 'posts.updated', label: this.copy().auditLogActionPostUpdated },
    { value: 'posts.deleted', label: this.copy().auditLogActionPostDeleted }
  ]);

  protected entityOptions = computed(() => [
    { value: '', label: this.copy().auditLogEntityAll },
    { value: 'user', label: this.copy().auditLogEntityUser },
    { value: 'post', label: this.copy().auditLogEntityPost },
    { value: 'auth', label: this.copy().auditLogEntityAuth }
  ]);

  async ngOnInit(): Promise<void> {
    await this.loadLogs();
  }

  protected async loadLogs(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    const actorInput = this.actorQuery().trim();
    const actorId = actorInput && Number.isFinite(Number(actorInput)) ? Number(actorInput) : undefined;
    const qParts = [this.searchQuery().trim(), actorId ? '' : actorInput].filter(Boolean);
    const q = qParts.length > 0 ? qParts.join(' ') : undefined;

    try {
      const { logs, total } = await this.auditLogService.listLogs({
        action: this.actionFilter() || undefined,
        entityType: this.entityFilter() || undefined,
        actorId,
        from: this.dateFrom() || undefined,
        to: this.dateTo() || undefined,
        q,
        limit: this.pageSize,
        offset: (this.currentPage() - 1) * this.pageSize
      });

      this.logs.set(logs);
      this.total.set(total);
    } catch {
      this.error.set(true);
      this.logs.set([]);
      this.total.set(0);
    } finally {
      this.loading.set(false);
    }
  }

  protected onSearchChange(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.resetPageAndReload();
  }

  protected onActionChange(event: Event): void {
    this.actionFilter.set((event.target as HTMLSelectElement).value);
    this.resetPageAndReload();
  }

  protected onEntityChange(event: Event): void {
    this.entityFilter.set((event.target as HTMLSelectElement).value);
    this.resetPageAndReload();
  }

  protected onActorChange(event: Event): void {
    this.actorQuery.set((event.target as HTMLInputElement).value);
    this.resetPageAndReload();
  }

  protected onDateFromChange(event: Event): void {
    this.dateFrom.set((event.target as HTMLInputElement).value);
    this.resetPageAndReload();
  }

  protected onDateToChange(event: Event): void {
    this.dateTo.set((event.target as HTMLInputElement).value);
    this.resetPageAndReload();
  }

  protected resetFilters(): void {
    this.searchQuery.set('');
    this.actionFilter.set('');
    this.entityFilter.set('');
    this.actorQuery.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.resetPageAndReload();
  }

  protected previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((value) => value - 1);
      void this.loadLogs();
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((value) => value + 1);
      void this.loadLogs();
    }
  }

  protected formatDate(date: Date): string {
    return date.toLocaleString(this.languageService.locale());
  }

  protected formatActor(log: AuditLog): string {
    return log.actorEmail ?? log.actorId ?? this.copy().commonNotAvailable;
  }

  protected formatEntity(value: string): string {
    const match = this.entityOptions().find((option) => option.value === value);
    return match?.label ?? value;
  }

  protected formatAction(value: string): string {
    const match = this.actionOptions().find((option) => option.value === value);
    return match?.label ?? value;
  }

  protected formatDetails(details: Record<string, unknown> | null): string {
    if (!details || Object.keys(details).length === 0) {
      return this.copy().commonNotAvailable;
    }

    return JSON.stringify(details);
  }

  private resetPageAndReload(): void {
    this.currentPage.set(1);
    void this.loadLogs();
  }
}
