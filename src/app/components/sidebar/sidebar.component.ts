import { Component, computed, input, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.open]="isOpen()" role="navigation" [attr.aria-label]="copy().sidebarNavAriaLabel">
      <div class="sidebar-header">
        <div class="logo">
          <h1>{{ copy().sidebarTitle }}</h1>
        </div>
        <button
          class="close-btn"
          (click)="close.emit()"
          [attr.aria-label]="copy().sidebarCloseLabel"
        >
          ✕
        </button>
      </div>

      <nav class="nav-menu">
        @for (item of navItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
            [attr.aria-current]="item.route === '/dashboard' ? 'page' : null"
          >
            <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="sidebar-footer">
        <button
          (click)="onLogout()"
          class="logout-btn"
          [attr.aria-label]="copy().sidebarLogoutLabel"
        >
          <span class="nav-icon" aria-hidden="true">🚪</span>
          <span class="nav-label">{{ copy().sidebarLogoutLabel }}</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      transition: transform 0.3s;
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
    }

    .logo {
      padding: 24px 20px;
      flex: 1;
    }

    .logo h1 {
      font-size: 20px;
      font-weight: 600;
      color: var(--primary);
      margin: 0;
    }

    .close-btn {
      display: none;
      background: none;
      border: none;
      font-size: 24px;
      color: var(--text-muted);
      cursor: pointer;
      padding: 20px;
      transition: color 0.2s;
    }

    .close-btn:hover {
      color: var(--danger);
    }

    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .close-btn {
        display: block;
      }
    }

    .nav-menu {
      flex: 1;
      padding: 20px 0;
      overflow-y: auto;
    }

    .nav-item, .logout-btn {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: var(--text);
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-size: 15px;
    }

    .nav-item:hover, .logout-btn:hover {
      background: var(--surface-alt);
      color: var(--primary);
    }

    .nav-item.active {
      background: color-mix(in srgb, var(--primary) 12%, transparent);
      color: var(--primary);
      border-right: 3px solid var(--primary);
    }

    .nav-icon {
      font-size: 18px;
      margin-right: 12px;
      width: 24px;
      text-align: center;
    }

    .nav-label {
      font-weight: 500;
    }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid var(--border);
    }

    .logout-btn {
      color: var(--danger);
    }

    .logout-btn:hover {
      background: color-mix(in srgb, var(--danger) 12%, transparent);
    }
  `]
})
export class SidebarComponent {
  isOpen = input<boolean>(false);
  close = output<void>();

  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private languageService = inject(LanguageService);
  protected copy = this.languageService.copy;

  protected navItems = computed<NavItem[]>(() => [
    { label: this.copy().sidebarNavDashboard, route: '/dashboard', icon: '📊' },
    { label: this.copy().sidebarNavPosts, route: '/posts', icon: '📝' },
    { label: this.copy().sidebarNavSettings, route: '/settings', icon: '⚙️' }
  ]);

  protected async onLogout(): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: this.copy().sidebarLogoutTitle,
      message: this.copy().sidebarLogoutMessage,
      confirmText: this.copy().sidebarLogoutConfirm,
      cancelText: this.copy().commonCancel,
      confirmButtonClass: 'danger'
    });

    if (confirmed) {
      this.authService.logout();
      window.location.reload();
    }
  }
}
