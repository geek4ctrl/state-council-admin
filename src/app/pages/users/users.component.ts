import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { PasswordResetService } from '../../services/password-reset.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  template: `
    <div class="users-page" role="main">
      <h1 id="users-title">{{ copy().dashboardUsersTitle }}</h1>

      <div class="users-section" aria-labelledby="users-title">
        <div class="section-header">
          <div class="title-stack">
            <h2>{{ copy().dashboardUsersTitle }}</h2>
            <span class="users-count">{{ filteredUsers().length }} {{ copy().dashboardUsersCountSuffix }}</span>
          </div>
          <div class="section-actions">
            <button class="btn-secondary" type="button" (click)="exportUsersCsv()">
              {{ copy().exportCsvText }}
            </button>
            <button class="btn-secondary" type="button" (click)="exportUsersPdf()">
              {{ copy().exportPdfText }}
            </button>
          </div>
        </div>

        <div class="filters filter-panel" role="search" [attr.aria-label]="copy().usersFiltersAria">
          <div class="filter-group">
            <label for="user-search">{{ copy().usersFilterSearch }}</label>
            <input
              id="user-search"
              type="search"
              class="filter-control"
              [value]="searchQuery()"
              (input)="onSearchChange($event)"
              [placeholder]="copy().usersFilterSearchPlaceholder"
            />
          </div>

          <div class="filter-group">
            <label for="user-role">{{ copy().usersFilterRole }}</label>
            <select id="user-role" class="filter-control" [value]="roleFilter()" (change)="onRoleChange($event)">
              <option value="">{{ copy().usersFilterAllRoles }}</option>
              <option value="admin">{{ copy().usersRoleAdmin }}</option>
              <option value="user">{{ copy().usersRoleUser }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="user-from">{{ copy().usersFilterFrom }}</label>
            <input id="user-from" type="date" class="filter-control" [value]="dateFrom()" (input)="onDateFromChange($event)" />
          </div>

          <div class="filter-group">
            <label for="user-to">{{ copy().usersFilterTo }}</label>
            <input id="user-to" type="date" class="filter-control" [value]="dateTo()" (input)="onDateToChange($event)" />
          </div>

          <button class="btn-secondary btn-reset" type="button" (click)="resetFilters()">{{ copy().usersFilterReset }}</button>
        </div>

        @if (!isAdmin()) {
          <p class="empty-message state-message is-restricted" data-icon="i" role="status">{{ copy().dashboardUsersRestricted }}</p>
        } @else if (usersLoading()) {
          <p class="empty-message state-message is-loading" data-icon="..." role="status">{{ copy().dashboardUsersLoading }}</p>
        } @else if (usersError()) {
          <p class="empty-message state-message is-error" data-icon="!" role="status">{{ copy().dashboardUsersError }}</p>
        } @else {
          <div class="users-list" role="list" aria-labelledby="users-title">
            @for (user of filteredUsers(); track user.id) {
              <div class="user-card" role="listitem">
                <img
                  class="user-avatar"
                  [src]="user.avatar"
                  [alt]="user.name"
                  loading="lazy"
                  decoding="async"
                />
                <div class="user-meta">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                  <div class="user-chips" role="group" [attr.aria-label]="copy().usersStatusLabel">
                    <span
                      class="chip"
                      [class.role-admin]="user.role === 'admin'"
                      [class.role-user]="user.role !== 'admin'"
                    >
                      {{ user.role === 'admin' ? copy().usersRoleAdmin : copy().usersRoleUser }}
                    </span>
                    <span
                      class="chip"
                      [class.is-locked]="user.locked"
                      [class.is-active]="!user.locked"
                    >
                      {{ user.locked ? copy().usersStatusLocked : copy().usersStatusActive }}
                    </span>
                  </div>
                </div>
                <div class="user-info">
                  <span class="user-label">{{ copy().dashboardUsersRoleLabel }}</span>
                  <span class="user-value">{{ user.role === 'admin' ? copy().usersRoleAdmin : copy().usersRoleUser }}</span>
                </div>
                <div class="user-info">
                  <span class="user-label">{{ copy().dashboardUsersJoinedLabel }}</span>
                  <span class="user-value">
                    <time [attr.datetime]="user.createdAt.toISOString()">
                      {{ formatDate(user.createdAt) }}
                    </time>
                  </span>
                </div>
                <div class="user-actions" role="group" [attr.aria-label]="copy().usersActionsLabel">
                  <button
                    class="btn-action"
                    type="button"
                    (click)="onToggleRole(user)"
                    [disabled]="isSelf(user)"
                  >
                    {{ user.role === 'admin' ? copy().usersMakeUser : copy().usersMakeAdmin }}
                  </button>
                  <button
                    class="btn-action"
                    type="button"
                    (click)="onToggleLock(user)"
                    [disabled]="isSelf(user)"
                  >
                    {{ user.locked ? copy().usersUnlock : copy().usersLock }}
                  </button>
                  <button
                    class="btn-action"
                    type="button"
                    (click)="onResetPassword(user)"
                  >
                    {{ copy().usersResetPassword }}
                  </button>
                </div>
              </div>
            } @empty {
              <p class="empty-message state-message is-empty" data-icon="-" role="status">{{ copy().dashboardUsersEmpty }}</p>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .users-page {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-size: 30px;
      font-weight: 400;
      margin: 0 0 32px 0;
      color: var(--text-muted);
    }

    .users-section {
      background: var(--surface);
      border-radius: 6px;
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

    .title-stack {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .section-actions {
      display: inline-flex;
      gap: 10px;
      flex-wrap: wrap;
      align-items: center;
    }

    .section-header h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: var(--text);
    }

    .users-count {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .users-list {
      display: grid;
      gap: 16px;
    }

    .btn-secondary {
      background: var(--surface-1);
      color: var(--primary);
      border: 1px solid color-mix(in srgb, var(--primary) 40%, var(--border));
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: color-mix(in srgb, var(--primary) 12%, var(--surface-1));
      border-color: var(--primary);
    }

    .user-card {
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr) 120px 140px minmax(260px, 1fr);
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 6px;
      background: var(--surface-1);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-soft);
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--border);
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: 11px;
      color: var(--text-subtle);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text-muted);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }

    .chip.role-admin {
      background: color-mix(in srgb, var(--primary) 18%, transparent);
      border-color: color-mix(in srgb, var(--primary) 35%, var(--border));
      color: var(--primary-strong);
    }

    .chip.role-user {
      background: color-mix(in srgb, var(--accent-3) 16%, transparent);
      border-color: color-mix(in srgb, var(--accent-3) 32%, var(--border));
      color: color-mix(in srgb, var(--accent-3) 70%, var(--text));
    }

    .chip.is-locked {
      background: color-mix(in srgb, var(--danger) 18%, transparent);
      border-color: color-mix(in srgb, var(--danger) 35%, var(--border));
      color: var(--danger-strong);
    }

    .chip.is-active {
      background: color-mix(in srgb, var(--success) 16%, transparent);
      border-color: color-mix(in srgb, var(--success) 32%, var(--border));
      color: var(--success);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 120px;
      text-align: left;
    }

    .user-label {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .user-value {
      font-size: 11px;
      color: var(--text);
      text-transform: capitalize;
    }

    .user-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 8px;
      align-items: center;
      justify-items: stretch;
      justify-self: end;
      width: 100%;
    }

    .btn-action {
      background: var(--surface-1);
      color: var(--primary);
      border: 1px solid color-mix(in srgb, var(--primary) 40%, var(--border));
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      min-height: 32px;
      width: 100%;
      text-align: center;
      white-space: normal;
      line-height: 1.2;
      word-break: break-word;
    }

    .btn-action:hover:not(:disabled) {
      border-color: var(--primary);
      color: var(--primary-strong);
      background: color-mix(in srgb, var(--primary) 12%, var(--surface-1));
    }

    .btn-action:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .users-section {
        padding: 24px;
      }

      .user-card {
        grid-template-columns: 48px 1fr;
      }

      .user-info {
        grid-column: 1 / -1;
        flex-direction: row;
        justify-content: space-between;
      }
    }

    @media (max-width: 640px) {
      h1 {
        font-size: 22px;
      }

      .users-section {
        padding: 20px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .section-actions {
        width: 100%;
      }

      .section-header h2 {
        font-size: 16px;
      }

      .user-card {
        grid-template-columns: 44px 1fr;
        padding: 14px;
        gap: 12px;
        border-radius: 6px;
        background: var(--surface-1);
        box-shadow: var(--shadow-soft);
      }

      .user-avatar {
        width: 44px;
        height: 44px;
      }

      .user-meta {
        gap: 2px;
      }

      .user-info {
        grid-column: 1 / -1;
        flex-direction: row;
        justify-content: space-between;
        padding: 8px 10px;
        border-radius: 6px;
        background: var(--surface);
        border: 1px solid var(--border);
      }

      .user-actions {
        grid-column: 1 / -1;
        justify-content: flex-start;
        gap: 10px;
      }

      .btn-action {
        flex: 1 1 100%;
        text-align: center;
        padding: 10px 12px;
        border-radius: 999px;
        font-size: 11px;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private passwordResetService = inject(PasswordResetService);
  private exportService = inject(ExportService);

  protected users = this.userService.getUsers();
  protected searchQuery = signal('');
  protected roleFilter = signal('');
  protected dateFrom = signal('');
  protected dateTo = signal('');
  protected copy = this.languageService.copy;
  protected usersLoading = signal(false);
  protected usersError = signal(false);
  protected isAdmin = computed(() => this.authService.getCurrentUser()()?.role === 'admin');
  private currentUserId = computed(() => this.authService.getCurrentUser()()?.id ?? '');

  protected filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const role = this.roleFilter();
    const from = this.dateFrom();
    const to = this.dateTo();

    return this.users().filter((user) => {
      if (role && user.role !== role) {
        return false;
      }

      if (!this.matchesDateRange(user.createdAt, from, to)) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = `${user.name} ${user.email}`.toLowerCase();
      return haystack.includes(query);
    });
  });

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    if (!this.isAdmin()) {
      return;
    }

    this.usersLoading.set(true);
    this.usersError.set(false);

    try {
      const loaded = await this.userService.loadUsers();
      if (!loaded) {
        this.usersError.set(true);
        this.toastService.error(this.copy().dashboardUsersError);
      }
    } catch {
      this.usersError.set(true);
      this.toastService.error(this.copy().dashboardUsersError);
    } finally {
      this.usersLoading.set(false);
    }
  }

  protected formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.languageService.locale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  protected isSelf(user: { id: string }): boolean {
    return user.id === this.currentUserId();
  }

  protected async onToggleRole(user: { id: string; role: 'admin' | 'user'; email: string }): Promise<void> {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    const confirmed = await this.confirmationService.confirm({
      title: 'Update role',
      message: `Change ${user.email} to ${nextRole}?`,
      confirmText: 'Update',
      cancelText: this.copy().commonCancel
    });

    if (!confirmed) {
      return;
    }

    try {
      await this.userService.updateRole(user.id, nextRole);
      this.toastService.success('Role updated successfully.');
    } catch {
      this.toastService.error('Failed to update role.');
    }
  }

  protected async onToggleLock(user: { id: string; locked: boolean; email: string }): Promise<void> {
    const nextLocked = !user.locked;
    const actionLabel = nextLocked ? 'lock' : 'unlock';
    const confirmed = await this.confirmationService.confirm({
      title: 'Update account access',
      message: `Are you sure you want to ${actionLabel} ${user.email}?`,
      confirmText: nextLocked ? 'Lock' : 'Unlock',
      cancelText: this.copy().commonCancel,
      confirmButtonClass: nextLocked ? 'danger' : 'primary'
    });

    if (!confirmed) {
      return;
    }

    try {
      await this.userService.setLocked(user.id, nextLocked);
      this.toastService.success(`User ${nextLocked ? 'locked' : 'unlocked'}.`);
    } catch {
      this.toastService.error('Failed to update account access.');
    }
  }

  protected async onResetPassword(user: { id: string; email: string }): Promise<void> {
    const password = await this.passwordResetService.open({
      title: 'Reset password',
      message: `Create a temporary password for ${user.email}.`,
      confirmText: 'Reset',
      cancelText: this.copy().commonCancel,
      minLength: 6
    });

    if (!password) {
      return;
    }

    try {
      await this.userService.resetPassword(user.id, password.trim());
      this.toastService.success('Password reset successfully.');
    } catch {
      this.toastService.error('Failed to reset password.');
    }
  }

  protected onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  protected onRoleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.roleFilter.set(value);
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
    this.roleFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
  }

  protected exportUsersCsv(): void {
    const rows = this.buildUserRows(false);
    if (!rows.length) {
      this.toastService.info(this.copy().exportNoData);
      return;
    }

    const filename = `users-${this.exportDateStamp()}.csv`;
    this.exportService.downloadCsv(filename, this.userExportHeaders(), rows);
    this.toastService.success(this.copy().exportStarted);
  }

  protected exportUsersPdf(): void {
    const rows = this.buildUserRows(true);
    if (!rows.length) {
      this.toastService.info(this.copy().exportNoData);
      return;
    }

    const filename = `users-${this.exportDateStamp()}.pdf`;
    this.exportService.downloadPdf(
      filename,
      this.copy().dashboardUsersTitle,
      this.userExportHeaders(),
      rows
    );
    this.toastService.success(this.copy().exportStarted);
  }

  private userExportHeaders(): string[] {
    const copy = this.copy();
    return [
      copy.dashboardUsersNameLabel,
      copy.dashboardUsersEmailLabel,
      copy.dashboardUsersRoleLabel,
      copy.usersStatusLabel,
      copy.dashboardUsersJoinedLabel
    ];
  }

  private buildUserRows(useLocaleDates: boolean): Array<Array<string>> {
    const copy = this.copy();
    return this.filteredUsers().map((user) => [
      user.name,
      user.email,
      user.role === 'admin' ? copy.usersRoleAdmin : copy.usersRoleUser,
      user.locked ? copy.usersStatusLocked : copy.usersStatusActive,
      useLocaleDates ? this.formatDate(user.createdAt) : user.createdAt.toISOString()
    ]);
  }

  private exportDateStamp(): string {
    return new Date().toISOString().slice(0, 10);
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

