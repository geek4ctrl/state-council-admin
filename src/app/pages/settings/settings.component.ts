import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <h1>{{ copy().settingsTitle }}</h1>

      <div class="settings-container">
        <div class="section">
          <h2>{{ copy().settingsProfileTitle }}</h2>

          <div class="avatar-section">
            <img
              [src]="formData.avatar"
              [attr.alt]="copy().settingsAvatarAlt"
              class="avatar-large"
              loading="lazy"
              decoding="async"
              (error)="onImageError($event)"
            />
            <div class="avatar-info">
              <p class="avatar-label">{{ copy().settingsProfilePictureLabel }}</p>
              <input
                type="url"
                [(ngModel)]="formData.avatar"
                [placeholder]="copy().settingsAvatarPlaceholder"
                class="avatar-input"
              />
            </div>
          </div>

          <form (ngSubmit)="onSave()">
            <div class="form-group">
              <label for="name">{{ copy().settingsFullNameLabel }}</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="formData.name"
                name="name"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">{{ copy().settingsEmailLabel }}</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="formData.email"
                name="email"
                required
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">
                {{ copy().settingsSaveChanges }}
              </button>
            </div>
          </form>
        </div>

        <div class="section">
          <h2>{{ copy().settingsAccountTitle }}</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">{{ copy().settingsUserIdLabel }}</span>
              <span class="info-value">{{ userId() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ copy().settingsRoleLabel }}</span>
              <span class="info-value">{{ userRole() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ copy().settingsMemberSinceLabel }}</span>
              <span class="info-value">{{ memberSince() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      font-size: 32px;
      font-weight: 400;
      margin: 0 0 32px 0;
      color: var(--text-muted);
    }

    .settings-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .section {
      background: var(--surface);
      border-radius: 12px;
      padding: 32px;
      box-shadow: var(--shadow-soft);
    }

    .section h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 24px 0;
      color: var(--text-muted);
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }

    .avatar-large {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--border);
    }

    .avatar-info {
      flex: 1;
    }

    .avatar-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      margin: 0 0 8px 0;
    }

    .avatar-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 14px;
      background: var(--surface);
      color: var(--text);
    }

    .form-group {
      margin-bottom: 24px;
    }

    label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      background: var(--surface);
      color: var(--text);
    }

    input:focus {
      outline: none;
      border-color: var(--primary);
    }

    .form-actions {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(8, 145, 178, 0.2);
    }

    .btn-primary:hover {
      background: var(--primary-strong);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(8, 145, 178, 0.3);
    }

    .info-grid {
      display: grid;
      gap: 20px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      background: var(--surface-alt);
      border-radius: 8px;
    }

    .info-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .info-value {
      font-size: 14px;
      color: var(--text);
      text-transform: capitalize;
    }

    @media (max-width: 768px) {
      .section {
        padding: 24px;
      }

      .avatar-section {
        flex-direction: column;
        text-align: center;
        align-items: center;
      }

      .avatar-info {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      h1 {
        font-size: 24px;
        margin-bottom: 24px;
      }

      .section {
        padding: 20px;
      }

      .section h2 {
        font-size: 18px;
      }

      .info-item {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
      }

      .btn-primary {
        width: 100%;
      }
    }
  `]
})
export class SettingsComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private languageService = inject(LanguageService);
  private user = this.authService.getCurrentUser();
  protected copy = this.languageService.copy;

  protected formData = {
    name: this.user()?.name || '',
    email: this.user()?.email || '',
    avatar: this.user()?.avatar || ''
  };

  protected userId = computed(() => this.user()?.id || this.copy().commonNotAvailable);
  protected userRole = computed(() => this.user()?.role || this.copy().commonNotAvailable);
  protected memberSince = computed(() => {
    const date = this.user()?.createdAt;
    return date ? new Date(date).toLocaleDateString(this.languageService.locale(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : this.copy().commonNotAvailable;
  });

  protected onSave(): void {
    this.authService.updateProfile(this.formData);
    this.toastService.success(this.copy().settingsProfileUpdatedToast);
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.formData.name) + '&size=200&background=e5e7eb&color=6b7280';
  }
}
