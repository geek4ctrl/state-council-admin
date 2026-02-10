import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onCancel()" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 id="modal-title">{{ config()?.title }}</h2>
            <button
              class="modal-close"
              (click)="onCancel()"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div class="modal-body">
            <p>{{ config()?.message }}</p>
          </div>

          <div class="modal-footer">
            <button
              class="btn-secondary"
              (click)="onCancel()"
              aria-label="Cancel action"
            >
              {{ config()?.cancelText }}
            </button>
            <button
              class="btn-primary"
              [class.btn-danger]="config()?.confirmButtonClass === 'danger'"
              (click)="onConfirm()"
              [attr.aria-label]="'Confirm: ' + config()?.confirmText"
            >
              {{ config()?.confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-container {
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow-strong);
      width: 90%;
      max-width: 480px;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 16px;
      border-bottom: 1px solid var(--border);
    }

    .modal-header h2 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 22px;
      color: var(--text-subtle);
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      transition: color 0.2s;
    }

    .modal-close:hover {
      color: var(--text);
    }

    .modal-body {
      padding: 24px;
    }

    .modal-body p {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px 24px;
    }

    .btn-primary,
    .btn-secondary {
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-secondary {
      background: var(--surface);
      color: var(--text-muted);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background: var(--surface-alt);
      border-color: var(--text-muted);
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-strong);
    }

    .btn-danger {
      background: var(--danger);
    }

    .btn-danger:hover {
      background: var(--danger-strong);
    }

    @media (max-width: 640px) {
      .modal-container {
        width: 95%;
        margin: 0 16px;
      }

      .modal-header {
        padding: 20px 20px 12px;
      }

      .modal-body {
        padding: 20px;
      }

      .modal-footer {
        padding: 12px 20px 20px;
        flex-direction: column-reverse;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class ConfirmationModalComponent {
  private confirmationService = inject(ConfirmationService);

  protected isOpen = this.confirmationService.getIsOpen();
  protected config = this.confirmationService.getConfig();

  protected onConfirm(): void {
    this.confirmationService.handleConfirm();
  }

  protected onCancel(): void {
    this.confirmationService.handleCancel();
  }
}

