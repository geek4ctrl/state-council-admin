import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { ToastComponent } from '../toast/toast.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { PasswordResetModalComponent } from '../password-reset-modal/password-reset-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, ToastComponent, ConfirmationModalComponent, PasswordResetModalComponent],
  template: `
    <div class="layout">
      <app-toast />
      <app-confirmation-modal />
      <app-password-reset-modal />
      <app-sidebar [isOpen]="sidebarOpen()" (close)="closeSidebar()" />
      @if (sidebarOpen()) {
        <div class="overlay" (click)="closeSidebar()"></div>
      }
      <div class="main-content">
        <app-header (toggleSidebar)="toggleSidebar()" />
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
      background: var(--bg);
      position: relative;
      overflow: hidden;
    }

    .overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay);
      backdrop-filter: blur(6px);
      z-index: 99;
    }

    .main-content {
      margin-left: 240px;
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
      transition: margin-left 0.3s;
    }

    .content {
      flex: 1;
      padding: 32px;
      overflow-y: auto;
    }

    @media (max-width: 1024px) {
      .main-content {
        margin-left: 0;
      }

      .overlay {
        display: block;
      }
    }

    @media (max-width: 768px) {
      .content {
        padding: 20px 16px;
      }
    }

    @media (max-width: 640px) {
      .content {
        padding: 16px 12px;
      }
    }
  `]
})
export class LayoutComponent {
  protected sidebarOpen = signal(false);

  protected toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
