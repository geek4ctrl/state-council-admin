import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { getUserAvatar } from '../../models/user.model';

@Component({
  selector: 'app-avatar-upload',
  imports: [CommonModule],
  template: `
    <div class="avatar-upload">
      <div class="avatar-preview">
        <img 
          [src]="previewUrl()" 
          [alt]="copy().settingsAvatarAlt"
          class="avatar-image"
          (error)="onImageError($event)"
        />
        <div class="avatar-overlay">
          <label for="avatar-input" class="upload-trigger">
            <span class="upload-icon">📷</span>
            <span class="upload-text">{{ copy().settingsAvatarChangeLabel }}</span>
            <input
              id="avatar-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              (change)="onFileSelected($event)"
              class="file-input"
              [attr.aria-label]="copy().settingsAvatarChangeLabel"
            />
          </label>
        </div>
      </div>
      
      <div class="avatar-info">
        <label class="avatar-label">{{ label() }}</label>
        <p class="avatar-help">{{ copy().settingsAvatarHelp }}</p>
        
        @if (urlMode()) {
          <div class="url-input-group">
            <input
              type="url"
              class="url-input"
              [value]="currentUrl()"
              (input)="onUrlChange($event)"
              [placeholder]="copy().settingsAvatarPlaceholder"
            />
            <button 
              type="button" 
              class="btn-apply"
              (click)="applyUrl()"
              [disabled]="!currentUrl()"
            >
              {{ copy().advancedFiltersApply }}
            </button>
          </div>
        }
        
        <div class="avatar-actions">
          @if (!urlMode()) {
            <button 
              type="button" 
              class="btn-link"
              (click)="toggleUrlMode()"
            >
              {{ 'Use URL instead' }}
            </button>
          } @else {
            <button 
              type="button" 
              class="btn-link"
              (click)="toggleUrlMode()"
            >
              {{ 'Upload file instead' }}
            </button>
          }
          
          @if (currentAvatarUrl() && currentAvatarUrl() !== fallbackUrl()) {
            <button 
              type="button" 
              class="btn-link danger"
              (click)="removeAvatar()"
            >
              {{ 'Remove photo' }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-upload {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }

    .avatar-preview {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid var(--border);
      flex-shrink: 0;
      transition: all 0.3s;
    }

    .avatar-preview:hover {
      border-color: var(--primary);
      transform: scale(1.05);
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .avatar-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .avatar-preview:hover .avatar-overlay {
      opacity: 1;
    }

    .upload-trigger {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      color: white;
    }

    .upload-icon {
      font-size: 24px;
    }

    .upload-text {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .file-input {
      display: none;
    }

    .avatar-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .avatar-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .avatar-help {
      font-size: 11px;
      color: var(--text-subtle);
      margin: 0;
    }

    .url-input-group {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .url-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 12px;
      background: var(--surface);
      color: var(--text);
      transition: border-color 0.2s;
    }

    .url-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: var(--ring);
    }

    .btn-apply {
      padding: 10px 20px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-apply:hover:not(:disabled) {
      background: var(--primary-strong);
      transform: translateY(-1px);
    }

    .btn-apply:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .avatar-actions {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }

    .btn-link {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
    }

    .btn-link:hover {
      color: var(--primary-strong);
    }

    .btn-link.danger {
      color: var(--danger);
    }

    .btn-link.danger:hover {
      color: var(--danger-strong);
    }

    @media (max-width: 640px) {
      .avatar-upload {
        flex-direction: column;
        align-items: center;
      }

      .avatar-preview {
        width: 100px;
        height: 100px;
      }

      .avatar-info {
        width: 100%;
      }
    }
  `]
})
export class AvatarUploadComponent {
  private languageService = inject(LanguageService);
  protected copy = this.languageService.copy;

  // Inputs
  label = input<string>('Profile Photo');
  currentAvatarUrl = input<string>('');
  userEmail = input<string>('');

  // Outputs
  avatarChange = output<string>();

  // State
  protected urlMode = signal(false);
  protected currentUrl = signal('');
  protected previewUrl = signal('');
  protected fallbackUrl = signal('');

  constructor() {
    // Initialize preview with current avatar or Gravatar
    const email = this.userEmail();
    const avatar = this.currentAvatarUrl();
    
    if (avatar) {
      this.previewUrl.set(avatar);
      this.currentUrl.set(avatar);
    } else if (email) {
      const gravatar = getUserAvatar({ email, avatar: undefined });
      this.previewUrl.set(gravatar);
      this.fallbackUrl.set(gravatar);
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, or SVG)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    // Read file and create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      this.previewUrl.set(dataUrl);
      this.currentUrl.set(dataUrl);
      this.avatarChange.emit(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  protected onUrlChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.currentUrl.set(input.value);
  }

  protected applyUrl(): void {
    const url = this.currentUrl().trim();
    if (url) {
      this.previewUrl.set(url);
      this.avatarChange.emit(url);
      this.urlMode.set(false);
    }
  }

  protected toggleUrlMode(): void {
    this.urlMode.update(mode => !mode);
    if (this.urlMode()) {
      this.currentUrl.set(this.currentAvatarUrl());
    }
  }

  protected removeAvatar(): void {
    const fallback = this.fallbackUrl();
    this.previewUrl.set(fallback);
    this.currentUrl.set('');
    this.avatarChange.emit('');
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const fallback = this.fallbackUrl();
    if (fallback && img.src !== fallback) {
      img.src = fallback;
    }
  }
}
