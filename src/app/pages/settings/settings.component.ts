import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LanguageService } from '../../services/language.service';
import { AvatarUploadComponent } from '../../components/avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, AvatarUploadComponent],
  template: `
    <div class="settings-page">
      <h1 class="page-title">{{ copy().settingsTitle }}</h1>

      <div class="settings-container">
        <div class="section">
          <h2>{{ copy().settingsProfileTitle }}</h2>
          <p class="section-subtitle">{{ copy().settingsProfileSubtitle }}</p>

          <app-avatar-upload
            [label]="copy().settingsProfilePictureLabel"
            [currentAvatarUrl]="formData.avatar"
            [userEmail]="formData.email"
            (avatarChange)="onAvatarChange($event)"
          />

          <form (ngSubmit)="onSave()">
            <div class="profile-grid">
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
                <p class="field-help">{{ copy().settingsEmailHelp }}</p>
              </div>

              <div class="form-group full-width">
                <label for="bio">{{ copy().settingsBioLabel }}</label>
                <textarea
                  id="bio"
                  [(ngModel)]="formData.bio"
                  name="bio"
                  rows="3"
                  [placeholder]="copy().settingsBioPlaceholder"
                ></textarea>
                <p class="field-help">{{ copy().settingsBioHelp }}</p>
              </div>
            </div>

            <div class="form-actions">
              <div class="last-updated">
                <span class="last-updated-label">{{ copy().settingsLastUpdatedLabel }}</span>
                <span class="last-updated-value">
                  {{ lastSavedAt() ? formatShortDate(lastSavedAt()!) : copy().commonNotAvailable }}
                </span>
              </div>
              <button type="submit" class="btn-primary">
                {{ copy().settingsSaveChanges }}
              </button>
            </div>
          </form>
        </div>

        <div class="section">
          <h2>{{ copy().settingsAccountTitle }}</h2>
          @if (formData.bio) {
            <div class="bio-section">
              <span class="bio-label">{{ copy().settingsBioLabel }}</span>
              <p class="bio-text">{{ formData.bio }}</p>
            </div>
          }
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

    .page-title {
      font-size: 26px;
      font-weight: 500;
      margin: 0 0 32px 0;
      color: var(--text);
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
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 6px 0;
      color: var(--text);
    }

    .section-subtitle {
      margin: 0 0 24px 0;
      color: var(--text-subtle);
      font-size: 12px;
    }

    .bio-section {
      margin-bottom: 20px;
      padding: 16px;
      background: var(--surface-alt);
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    .bio-label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .bio-text {
      margin: 0;
      font-size: 13px;
      line-height: 1.6;
      color: var(--text);
      white-space: pre-wrap;
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
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      margin: 0 0 8px 0;
    }

    .avatar-input-wrap {
      position: relative;
    }

    .avatar-input {
      width: 100%;
      padding: 10px 12px;
      padding-right: 84px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 12px;
      background: var(--surface);
      color: var(--text);
    }

    .avatar-preview {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%) scale(0.96);
      width: 56px;
      height: 56px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: var(--surface);
      box-shadow: var(--shadow-soft);
      opacity: 0;
      pointer-events: none;
      transition: all 0.2s ease;
      display: grid;
      place-items: center;
    }

    .avatar-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
    }

    .avatar-input-wrap:hover .avatar-preview,
    .avatar-input-wrap:focus-within .avatar-preview {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }

    .avatar-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 10px;
    }

    .btn-link {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      cursor: pointer;
      padding: 0;
      align-self: flex-start;
    }

    .field-help {
      margin: 6px 0 0;
      font-size: 11px;
      color: var(--text-subtle);
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group {
      margin-bottom: 24px;
    }

    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 12px;
      font-family: inherit;
      background: var(--surface);
      color: var(--text);
    }

    input:focus {
      outline: none;
      border-color: var(--primary);
    }

    textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 12px;
      font-family: inherit;
      background: var(--surface);
      color: var(--text);
      resize: vertical;
      min-height: 80px;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary);
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }

    .last-updated {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 11px;
      color: var(--text-subtle);
    }

    .last-updated-label {
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.4px;
      color: var(--text-muted);
    }

    .last-updated-value {
      font-weight: 600;
      color: var(--text);
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 12px;
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
      gap: 14px;
    }

    .info-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      padding: 16px 18px;
      background: var(--surface);
      border-radius: 10px;
      border: 1px solid var(--border);
    }

    .info-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .info-value {
      font-size: 13px;
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

      .profile-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }

    @media (max-width: 640px) {
      .page-title {
        font-size: 22px;
        margin-bottom: 24px;
      }

      .section {
        padding: 20px;
      }

      .section h2 {
        font-size: 16px;
      }

      .info-item {
        grid-template-columns: 1fr;
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
    avatar: this.user()?.avatar || '',
    bio: this.user()?.bio || ''
  };

  protected lastSavedAt = signal<Date | null>(null);

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
    this.lastSavedAt.set(new Date());
  }

  protected onAvatarChange(avatarUrl: string): void {
    this.formData.avatar = avatarUrl;
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.formData.name) + '&size=200&background=e5e7eb&color=6b7280';
  }

  protected formatShortDate(date: Date): string {
    return new Date(date).toLocaleDateString(this.languageService.locale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

