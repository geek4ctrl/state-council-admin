import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
  selector: 'app-password-reset-modal',
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onCancel()" role="dialog" aria-modal="true" aria-labelledby="reset-title">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 id="reset-title">{{ config()?.title }}</h2>
            <button class="modal-close" (click)="onCancel()" aria-label="Close modal">✕</button>
          </div>

          <div class="modal-body">
            @if (config()?.message) {
              <p class="modal-message">{{ config()?.message }}</p>
            }
            <label for="temp-password">Temporary password</label>
            <div class="password-row">
              <input
                id="temp-password"
                [type]="showPassword() ? 'text' : 'password'"
                [value]="password()"
                (input)="onPasswordInput($event)"
                [attr.placeholder]="placeholderText()"
              />
              <button class="btn-secondary" type="button" (click)="toggleShow()">
                {{ showPassword() ? 'Hide' : 'Show' }}
              </button>
              <button class="btn-secondary" type="button" (click)="generatePassword()">
                Generate
              </button>
            </div>
            @if (errorMessage()) {
              <p class="error-text">{{ errorMessage() }}</p>
            }
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" (click)="onCancel()">
              {{ config()?.cancelText }}
            </button>
            <button class="btn-primary" (click)="onConfirm()">
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
      z-index: 10001;
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
      width: 92%;
      max-width: 520px;
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
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .modal-message {
      margin: 0;
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--text-subtle);
    }

    .password-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 8px;
      align-items: center;
    }

    input {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 12px;
      background: var(--surface);
      color: var(--text);
    }

    input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: var(--ring);
    }

    .error-text {
      margin: 0;
      font-size: 11px;
      color: var(--danger);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px 24px;
    }

    .btn-primary,
    .btn-secondary {
      padding: 10px 20px;
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

    @media (max-width: 640px) {
      .modal-container {
        width: 95%;
        margin: 0 16px;
      }

      .modal-footer {
        flex-direction: column-reverse;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
      }

      .password-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PasswordResetModalComponent {
  private passwordResetService = inject(PasswordResetService);

  protected isOpen = this.passwordResetService.getIsOpen();
  protected config = this.passwordResetService.getConfig();
  protected password = signal('');
  protected errorMessage = signal('');
  protected showPassword = signal(false);

  private resetEffect = effect(() => {
    if (this.isOpen()) {
      this.password.set('');
      this.errorMessage.set('');
      this.showPassword.set(false);
    }
  });

  protected placeholderText(): string {
    const minLength = this.config()?.minLength ?? 6;
    return `At least ${minLength} characters`;
  }

  protected toggleShow(): void {
    this.showPassword.update((value) => !value);
  }

  protected onPasswordInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.password.set(value);
    if (this.errorMessage()) {
      this.errorMessage.set('');
    }
  }

  protected generatePassword(): void {
    const minLength = this.config()?.minLength ?? 6;
    this.password.set(this.buildPassword(Math.max(10, minLength)));
    this.errorMessage.set('');
  }

  protected onConfirm(): void {
    const value = this.password().trim();
    const minLength = this.config()?.minLength ?? 6;

    if (value.length < minLength) {
      this.errorMessage.set(`Password must be at least ${minLength} characters.`);
      return;
    }

    this.passwordResetService.handleConfirm(value);
  }

  protected onCancel(): void {
    this.passwordResetService.handleCancel();
  }

  private buildPassword(length: number): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    const bytes = new Uint32Array(length);
    const view = typeof crypto !== 'undefined' ? crypto : null;
    if (view?.getRandomValues) {
      view.getRandomValues(bytes);
    } else {
      for (let i = 0; i < length; i += 1) {
        bytes[i] = Math.floor(Math.random() * chars.length);
      }
    }

    let result = '';
    for (let i = 0; i < length; i += 1) {
      result += chars[bytes[i] % chars.length];
    }
    return result;
  }
}
