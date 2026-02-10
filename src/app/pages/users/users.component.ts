import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  template: `
    <div class="users-page" role="main">
      <h1 id="users-title">{{ copy().dashboardUsersTitle }}</h1>

      <div class="users-section" aria-labelledby="users-title">
        <div class="section-header">
          <h2>{{ copy().dashboardUsersTitle }}</h2>
          <span class="users-count">{{ users().length }} {{ copy().dashboardUsersCountSuffix }}</span>
        </div>

        @if (!isAdmin()) {
          <p class="empty-message" role="status">{{ copy().dashboardUsersRestricted }}</p>
        } @else if (usersLoading()) {
          <p class="empty-message" role="status">{{ copy().dashboardUsersLoading }}</p>
        } @else if (usersError()) {
          <p class="empty-message" role="status">{{ copy().dashboardUsersError }}</p>
        } @else {
          <div class="users-list" role="list" aria-labelledby="users-title">
            @for (user of users(); track user.id) {
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
                </div>
                <div class="user-info">
                  <span class="user-label">{{ copy().dashboardUsersRoleLabel }}</span>
                  <span class="user-value">{{ user.role }}</span>
                </div>
                <div class="user-info">
                  <span class="user-label">{{ copy().dashboardUsersJoinedLabel }}</span>
                  <span class="user-value">
                    <time [attr.datetime]="user.createdAt.toISOString()">
                      {{ formatDate(user.createdAt) }}
                    </time>
                  </span>
                </div>
              </div>
            } @empty {
              <p class="empty-message" role="status">{{ copy().dashboardUsersEmpty }}</p>
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

    .users-count {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .empty-message {
      text-align: center;
      color: var(--text-subtle);
      padding: 64px 20px;
      font-size: 14px;
    }

    .users-list {
      display: grid;
      gap: 16px;
    }

    .user-card {
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr) minmax(120px, auto) minmax(140px, auto);
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 12px;
      background: var(--surface-alt);
      border: 1px solid var(--border);
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

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
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

      .section-header h2 {
        font-size: 16px;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  protected users = this.userService.getUsers();
  protected copy = this.languageService.copy;
  protected usersLoading = signal(false);
  protected usersError = signal(false);
  protected isAdmin = computed(() => this.authService.getCurrentUser()()?.role === 'admin');

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
}

