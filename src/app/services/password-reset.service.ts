import { Injectable, signal } from '@angular/core';
import { PasswordResetConfig } from '../models/password-reset.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private isOpen = signal(false);
  private config = signal<PasswordResetConfig | null>(null);
  private resolveCallback: ((value: string | null) => void) | null = null;

  getIsOpen() {
    return this.isOpen.asReadonly();
  }

  getConfig() {
    return this.config.asReadonly();
  }

  open(config: PasswordResetConfig): Promise<string | null> {
    this.config.set({
      confirmText: 'Reset',
      cancelText: 'Cancel',
      minLength: 6,
      ...config
    });
    this.isOpen.set(true);

    return new Promise((resolve) => {
      this.resolveCallback = resolve;
    });
  }

  handleConfirm(password: string): void {
    this.close();
    if (this.resolveCallback) {
      this.resolveCallback(password);
      this.resolveCallback = null;
    }
  }

  handleCancel(): void {
    this.close();
    if (this.resolveCallback) {
      this.resolveCallback(null);
      this.resolveCallback = null;
    }
  }

  private close(): void {
    this.isOpen.set(false);
    setTimeout(() => this.config.set(null), 300);
  }
}
