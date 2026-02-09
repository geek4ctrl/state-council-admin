import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      @for (toast of toasts(); track toast.id) {
        <div
          class="toast"
          [class.toast-success]="toast.type === 'success'"
          [class.toast-error]="toast.type === 'error'"
          [class.toast-info]="toast.type === 'info'"
          [class.toast-warning]="toast.type === 'warning'"
          role="alert"
        >
          <div class="toast-content">
            <span class="toast-icon" aria-hidden="true">{{ getIcon(toast.type) }}</span>
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button
            class="toast-close"
            (click)="close(toast.id)"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 420px;
      width: min(420px, calc(100vw - 32px));
    }

    .toast {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 16px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      min-width: 280px;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-success {
      border-left-color: #10b981;
      background: #f0fdf4;
    }

    .toast-error {
      border-left-color: #ef4444;
      background: #fef2f2;
    }

    .toast-info {
      border-left-color: #3b82f6;
      background: #eff6ff;
    }

    .toast-warning {
      border-left-color: #f59e0b;
      background: #fffbeb;
    }

    .toast-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
    }

    .toast-icon {
      font-size: 20px;
      line-height: 1;
    }

    .toast-message {
      font-size: 14px;
      color: #374151;
      line-height: 1.5;
      white-space: normal;
      word-break: break-word;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 18px;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      transition: color 0.2s;
      flex-shrink: 0;
    }

    .toast-close:hover {
      color: #374151;
    }

    @media (max-width: 640px) {
      .toast-container {
        top: 70px;
        right: 16px;
        left: 16px;
        max-width: none;
      }

      .toast {
        min-width: auto;
      }
    }
  `]
})
export class ToastComponent {
  private toastService = inject(ToastService);
  protected toasts = this.toastService.getToasts();

  protected getIcon(type: string): string {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };
    return icons[type as keyof typeof icons] || 'ℹ';
  }

  protected close(id: string): void {
    this.toastService.remove(id);
  }
}
