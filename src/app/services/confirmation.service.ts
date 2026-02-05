import { Injectable, signal } from '@angular/core';
import { ConfirmationConfig } from '../models/confirmation.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private isOpen = signal(false);
  private config = signal<ConfirmationConfig | null>(null);
  private resolveCallback: ((value: boolean) => void) | null = null;

  getIsOpen() {
    return this.isOpen.asReadonly();
  }

  getConfig() {
    return this.config.asReadonly();
  }

  confirm(config: ConfirmationConfig): Promise<boolean> {
    this.config.set({
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      confirmButtonClass: 'primary',
      ...config
    });
    this.isOpen.set(true);

    return new Promise((resolve) => {
      this.resolveCallback = resolve;
    });
  }

  handleConfirm(): void {
    this.close();
    if (this.resolveCallback) {
      this.resolveCallback(true);
      this.resolveCallback = null;
    }
  }

  handleCancel(): void {
    this.close();
    if (this.resolveCallback) {
      this.resolveCallback(false);
      this.resolveCallback = null;
    }
  }

  private close(): void {
    this.isOpen.set(false);
    setTimeout(() => this.config.set(null), 300);
  }
}
