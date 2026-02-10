import { Component, computed, inject, output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
    <header class="header" role="banner">
      <button
        class="hamburger"
        (click)="toggleSidebar.emit()"
        aria-label="Toggle navigation menu"
        aria-expanded="false"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <h2 class="greeting">Hello, {{ userName() }}</h2>
      <div class="header-actions">
        <button
          class="theme-toggle"
          type="button"
          (click)="toggleTheme()"
          [attr.aria-label]="themeAriaLabel()"
        >
          <span class="theme-icon" aria-hidden="true">{{ themeIcon() }}</span>
        </button>
        <div class="language-toggle" role="group" aria-label="Language">
          <button
            class="language-option"
            type="button"
            [class.is-active]="languageService.languageName() === 'en'"
            [attr.aria-pressed]="languageService.languageName() === 'en'"
            [attr.aria-label]="copy().switchToEnglishLabel"
            (click)="setLanguage('en')"
          >
            EN
          </button>
          <button
            class="language-option"
            type="button"
            [class.is-active]="languageService.languageName() === 'fr'"
            [attr.aria-pressed]="languageService.languageName() === 'fr'"
            [attr.aria-label]="copy().switchToFrenchLabel"
            (click)="setLanguage('fr')"
          >
            FR
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 64px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 0 32px;
      display: flex;
      align-items: center;
      gap: 20px;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
    }

    .hamburger span {
      width: 24px;
      height: 3px;
      background: var(--primary);
      border-radius: 2px;
      transition: all 0.3s;
    }

    .hamburger:hover span {
      background: var(--primary-strong);
    }

    .greeting {
      font-size: 24px;
      font-weight: 400;
      margin: 0;
      color: var(--text);
      flex: 1;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .theme-toggle {
      border: 1px solid var(--border);
      background: var(--surface-alt);
      color: var(--text);
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      line-height: 1;
      cursor: pointer;
      transition: all 0.2s;
    }

    .language-toggle {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--surface-alt);
      padding: 2px;
      gap: 2px;
    }

    .language-option {
      border: none;
      background: transparent;
      color: var(--text);
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.4px;
      line-height: 1;
      cursor: pointer;
      transition: all 0.2s;
    }

    .language-option:hover {
      color: var(--primary);
    }

    .language-option.is-active {
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(8, 145, 178, 0.25);
    }

    .theme-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .theme-toggle:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .language-toggle:hover {
      border-color: var(--primary);
    }

    @media (max-width: 1024px) {
      .hamburger {
        display: flex;
      }
    }

    @media (max-width: 640px) {
      .header {
        padding: 0 16px;
        height: 56px;
      }

      .greeting {
        font-size: 18px;
      }
    }
  `]
})
export class HeaderComponent {
  toggleSidebar = output<void>();
  private authService = inject(AuthService);
  protected languageService = inject(LanguageService);
  private themeService = inject(ThemeService);
  protected copy = this.languageService.copy;

  protected userName = computed(() => {
    const user = this.authService.getCurrentUser()();
    return user?.name || 'Guest';
  });

  protected themeIcon = computed(() =>
    this.themeService.themeName() === 'dark' ? '☀' : '🌙'
  );

  protected themeAriaLabel = computed(() =>
    this.themeService.themeName() === 'dark'
      ? this.copy().themeSwitchToLight
      : this.copy().themeSwitchToDark
  );

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected setLanguage(value: 'en' | 'fr'): void {
    this.languageService.setLanguage(value);
  }
}
