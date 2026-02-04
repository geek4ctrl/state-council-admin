import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="layout">
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
      background: #f3f4f6;
      position: relative;
      overflow: hidden;
    }

    .layout::before,
    .layout::after {
      content: '';
      position: fixed;
      border-radius: 50%;
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      opacity: 0.05;
      pointer-events: none;
      z-index: 0;
    }

    .layout::before {
      width: 800px;
      height: 800px;
      top: -400px;
      right: -200px;
      transform: rotate(-20deg);
    }

    .layout::after {
      width: 600px;
      height: 600px;
      bottom: -300px;
      left: 100px;
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    }

    .overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
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
