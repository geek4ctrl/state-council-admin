import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="logo">
        <h1>NewsCenter</h1>
      </div>

      <nav class="nav-menu">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="sidebar-footer">
        <button (click)="onLogout()" class="logout-btn">
          <span class="nav-icon">🚪</span>
          <span class="nav-label">Log Out</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      background: #f8f9fa;
      border-right: 1px solid #e9ecef;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
    }

    .logo {
      padding: 24px 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .logo h1 {
      font-size: 20px;
      font-weight: 600;
      color: #007bff;
      margin: 0;
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
      color: #495057;
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
      background: #e9ecef;
      color: #007bff;
    }

    .nav-item.active {
      background: #e7f3ff;
      color: #007bff;
      border-right: 3px solid #007bff;
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
      border-top: 1px solid #e9ecef;
    }

    .logout-btn {
      color: #dc3545;
    }

    .logout-btn:hover {
      background: #fee;
    }
  `]
})
export class SidebarComponent {
  protected navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Posts', route: '/posts', icon: '📝' },
    { label: 'Settings', route: '/settings', icon: '⚙️' }
  ];

  constructor(private authService: AuthService) {}

  protected onLogout(): void {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout();
      window.location.reload();
    }
  }
}
