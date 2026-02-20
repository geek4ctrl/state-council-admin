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
        [attr.aria-label]="copy().headerMenuToggleLabel"
        aria-expanded="false"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <h2 class="greeting">{{ copy().headerGreetingPrefix }}, {{ userName() }}</h2>
      <div class="header-actions">
        <div class="action-group">
          <span class="action-label">{{ copy().headerThemeLabel }}</span>
          <button
            class="theme-toggle"
            type="button"
            (click)="toggleTheme()"
            [attr.aria-label]="themeAriaLabel()"
            [attr.title]="themeAriaLabel()"
          >
            <span class="theme-icon" aria-hidden="true">{{ themeIcon() }}</span>
          </button>
        </div>
        <div class="action-group">
          <span class="action-label">{{ copy().headerLanguageLabel }}</span>
          <div class="language-toggle" role="group" [attr.aria-label]="copy().headerLanguageLabel">
            <button
              class="language-option"
              type="button"
              [class.is-active]="languageService.languageName() === 'en'"
              [attr.aria-pressed]="languageService.languageName() === 'en'"
              [attr.aria-label]="copy().switchToEnglishLabel"
              [attr.title]="copy().switchToEnglishLabel"
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
              [attr.title]="copy().switchToFrenchLabel"
              (click)="setLanguage('fr')"
            >
              FR
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 72px;
      background: var(--surface-1);
      border-bottom: 1px solid var(--border);
      padding: 0 32px;
      display: flex;
      align-items: center;
      gap: 20px;
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: var(--shadow-soft);
    }

    :host-context([data-theme="dark"]) .header {
      background: linear-gradient(180deg, rgba(18, 24, 33, 0.92), rgba(18, 24, 33, 0.82));
      box-shadow: 0 8px 20px rgba(2, 6, 23, 0.35);
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
      font-size: 20px;
      font-weight: 500;
      margin: 0;
      color: var(--text);
      flex: 1;
      letter-spacing: 0.2px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .action-group {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .action-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .theme-toggle {
      border: 1px solid var(--border);
      background: var(--surface-1);
      color: var(--text);
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.4px;
      line-height: 1;
      cursor: pointer;
      transition: all 0.2s;
    }

    .language-toggle {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--surface-1);
      padding: 2px;
      gap: 2px;
    }

    .language-option {
      border: none;
      background: transparent;
      color: var(--text);
      padding: 7px 12px;
      border-radius: 999px;
      font-size: 10px;
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
      background: var(--accent-soft);
      color: var(--accent-strong);
    }

    :host-context([data-theme="dark"]) .language-option.is-active {
      background: rgba(229, 231, 235, 0.16);
      color: #f8fafc;
      box-shadow: inset 0 0 0 1px rgba(248, 250, 252, 0.22);
    }

    .theme-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .theme-toggle:hover {
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-1px);
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
        height: 62px;
        gap: 12px;
      }

      .greeting {
        font-size: 16px;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-actions {
        margin-left: auto;
        gap: 8px;
      }

      .action-label {
        display: none;
      }

      .theme-toggle {
        padding: 6px 10px;
        font-size: 9px;
      }

      .language-option {
        padding: 6px 10px;
        font-size: 9px;
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
    return user?.name || this.copy().headerGuestName;
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

