import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { ToastComponent } from '../toast/toast.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, ToastComponent, ConfirmationModalComponent],
  template: `
    <div class="layout">
      <app-toast />
      <app-confirmation-modal />
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
      background-image:
        radial-gradient(circle at 10% 15%, rgba(124, 109, 243, 0.2), transparent 40%),
        radial-gradient(circle at 85% 10%, rgba(34, 211, 238, 0.16), transparent 45%),
        radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.12), transparent 50%),
        linear-gradient(180deg, rgba(15, 23, 42, 0.25) 0%, rgba(15, 23, 42, 0) 50%);
      position: relative;
      overflow: hidden;
    }

    .layout::before,
    .layout::after {
      content: '';
      position: fixed;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-1) 0%, var(--accent-2) 100%);
      opacity: 0.08;
      filter: blur(4px);
      pointer-events: none;
      z-index: 0;
    }

    .layout::before {
      width: 720px;
      height: 720px;
      top: -400px;
      right: -240px;
      transform: rotate(-20deg);
    }

    .layout::after {
      width: 520px;
      height: 520px;
      bottom: -300px;
      left: 100px;
      background: linear-gradient(135deg, var(--accent-2) 0%, var(--accent-1) 100%);
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

      .layout::before {
        width: 600px;
        height: 600px;
      }

      .layout::after {
        width: 400px;
        height: 400px;
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
