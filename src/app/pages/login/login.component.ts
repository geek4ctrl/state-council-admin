import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="logo">
        <svg width="180" height="40" viewBox="0 0 180 40" fill="none">
          <circle cx="20" cy="20" r="18" fill="#0891b2"/>
          <path d="M15 15 L20 20 L25 15" stroke="white" stroke-width="2" fill="none"/>
          <path d="M15 23 L25 23" stroke="white" stroke-width="2"/>
          <text x="45" y="27" font-family="Sora, sans-serif" font-size="16" font-weight="600" fill="#0891b2">{{ copy().logoText }}</text>
        </svg>
      </div>
      <div class="utility-toggles">
        <button
          class="theme-toggle"
          type="button"
          (click)="toggleTheme()"
          [attr.aria-label]="themeAriaLabel()"
        >
          <span class="theme-icon" aria-hidden="true">{{ themeIcon() }}</span>
        </button>
        <div class="language-toggle" role="group" [attr.aria-label]="copy().headerLanguageLabel">
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

      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            @if (isRegisterMode()) {
              <h1>{{ copy().loginRegisterTitle }}</h1>
              <p>{{ copy().loginRegisterSubtitle }}</p>
            } @else {
              <h1>{{ copy().loginWelcomeTitle }}</h1>
              <p>{{ copy().loginWelcomeSubtitle }}</p>
            }
          </div>

          @if (isRegisterMode()) {
            <form (ngSubmit)="onRegister()" class="login-form" role="form" [attr.aria-label]="copy().registerFormLabel">
              <div class="form-group">
                <label for="registerEmail">{{ copy().emailAddressLabel }}</label>
                <input
                  type="email"
                  id="registerEmail"
                  [(ngModel)]="registerEmail"
                  name="registerEmail"
                  [placeholder]="copy().emailPlaceholder"
                  required
                  autocomplete="email"
                  aria-required="true"
                />
              </div>

              <div class="form-group">
                <label for="registerPassword">{{ copy().passwordLabel }}</label>
                <input
                  type="password"
                  id="registerPassword"
                  [(ngModel)]="registerPassword"
                  name="registerPassword"
                  [placeholder]="copy().createPasswordPlaceholder"
                  required
                  autocomplete="new-password"
                  aria-required="true"
                />
              </div>

              <div class="form-group">
                <label for="registerConfirm">{{ copy().confirmPasswordLabel }}</label>
                <input
                  type="password"
                  id="registerConfirm"
                  [(ngModel)]="registerConfirm"
                  name="registerConfirm"
                  [placeholder]="copy().confirmPasswordPlaceholder"
                  required
                  autocomplete="new-password"
                  aria-required="true"
                />
              </div>

              @if (errorMessage()) {
                <div class="error-message" role="alert" aria-live="assertive">
                  {{ errorMessage() }}
                </div>
              }

              <button
                type="submit"
                class="btn-login"
                [disabled]="isLoading()"
                [attr.aria-busy]="isLoading()"
                [attr.aria-label]="copy().createAccountAriaLabel"
              >
                @if (isLoading()) {
                  <span>{{ copy().createAccountLoading }}</span>
                } @else {
                  <span>{{ copy().createAccountText }}</span>
                }
              </button>

              <div class="new-user">
                <span>{{ copy().existingAccountText }}</span>
                <button type="button" class="link-button" (click)="setRegisterMode(false)">{{ copy().signInText }}</button>
              </div>
            </form>
          } @else {
            <form (ngSubmit)="onLogin()" class="login-form" role="form" [attr.aria-label]="copy().loginFormLabel">
              <div class="form-group">
                <label for="email">{{ copy().emailAddressLabel }}</label>
                <input
                  type="email"
                  id="email"
                  [(ngModel)]="email"
                  name="email"
                  [placeholder]="copy().emailAdminPlaceholder"
                  required
                  autocomplete="email"
                  aria-required="true"
                  aria-describedby="email-hint"
                />
              </div>

              <div class="form-group">
                <label for="password">{{ copy().passwordLabel }}</label>
                <input
                  type="password"
                  id="password"
                  [(ngModel)]="password"
                  name="password"
                  [placeholder]="copy().passwordPlaceholder"
                  required
                  autocomplete="current-password"
                  aria-required="true"
                />
              </div>

              <div class="form-options">
                <label class="remember-me">
                  <input
                    type="checkbox"
                    [(ngModel)]="rememberMe"
                    name="rememberMe"
                    id="rememberMe"
                    [attr.aria-label]="copy().rememberMeText"
                  />
                  <span>{{ copy().rememberMeText }}</span>
                </label>
                <a href="#" class="forgot-link" role="button" [attr.aria-label]="copy().forgotPasswordText">{{ copy().forgotPasswordText }}</a>
              </div>

              @if (errorMessage()) {
                <div class="error-message" role="alert" aria-live="assertive">
                  {{ errorMessage() }}
                </div>
              }

              <button
                type="submit"
                class="btn-login"
                [disabled]="isLoading()"
                [attr.aria-busy]="isLoading()"
                [attr.aria-label]="copy().loginAriaLabel"
              >
                @if (isLoading()) {
                  <span>{{ copy().loginLoading }}</span>
                } @else {
                  <span>{{ copy().loginText }}</span>
                }
              </button>

              <div class="new-user">
                <span>{{ copy().newUserText }}</span>
                <button type="button" class="link-button" (click)="setRegisterMode(true)">{{ copy().createAccountLink }}</button>
              </div>
            </form>
          }
        </div>

        <footer class="footer-text" role="contentinfo">
          {{ copy().footerPrefix }}
          <a href="#" [attr.aria-label]="copy().termsUseLabel">{{ copy().termsUseText }}</a>{{ copy().footerMiddle }}
          <a href="#" [attr.aria-label]="copy().privacyPolicyLabel">{{ copy().privacyPolicyText }}</a>
        </footer>

        <div class="copyright" role="contentinfo">
          {{ copy().copyrightText }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--bg);
      position: relative;
      overflow: hidden;
    }

    .login-page::before,
    .login-page::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-1) 0%, var(--accent-2) 100%);
      opacity: 0.1;
    }

    .login-page::before {
      width: 800px;
      height: 800px;
      top: -400px;
      left: -200px;
      transform: rotate(-20deg);
    }

    .login-page::after {
      width: 600px;
      height: 600px;
      bottom: -300px;
      right: -150px;
      background: linear-gradient(135deg, var(--accent-2) 0%, var(--accent-1) 100%);
    }

    .logo {
      position: absolute;
      top: 32px;
      left: 40px;
      z-index: 10;
    }

    .utility-toggles {
      position: absolute;
      top: 28px;
      right: 32px;
      display: flex;
      gap: 8px;
      z-index: 10;
    }

    .theme-toggle {
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 10px;
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
      background: var(--surface);
      padding: 2px;
      gap: 2px;
    }

    .language-option {
      border: none;
      background: transparent;
      color: var(--text);
      padding: 6px 12px;
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

    .login-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      position: relative;
      z-index: 1;
    }

    .login-card {
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow-strong);
      width: 100%;
      max-width: 440px;
      overflow: hidden;
    }

    .login-header {
      text-align: center;
      padding: 40px 40px 32px;
    }

    .login-header h1 {
      font-size: 26px;
      font-weight: 400;
      color: var(--text-muted);
      margin: 0 0 8px 0;
    }

    .login-header p {
      font-size: 12px;
      color: var(--text-subtle);
      margin: 0;
    }

    .login-form {
      padding: 0 40px 32px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 11px;
      font-weight: 400;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    input[type="email"],
    input[type="password"] {
      padding: 12px 16px;
      border: none;
      border-bottom: 1px solid var(--border);
      font-size: 13px;
      font-family: inherit;
      transition: border-color 0.2s;
      background: transparent;
    }

    input[type="email"]:focus,
    input[type="password"]:focus {
      outline: none;
      border-bottom-color: var(--primary);
    }

    input::placeholder {
      color: var(--text-subtle);
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--text-muted);
      cursor: pointer;
    }

    .remember-me input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .forgot-link {
      font-size: 11px;
      color: var(--primary);
      text-decoration: none;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .error-message {
      background: color-mix(in srgb, var(--danger) 15%, var(--surface));
      color: var(--danger);
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 11px;
      border-left: 3px solid var(--danger);
    }

    .btn-login {
      background: var(--primary);
      color: white;
      border: none;
      padding: 14px;
      border-radius: 25px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 8px;
    }

    .btn-login:hover:not(:disabled) {
      background: var(--primary-strong);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .demo-credentials {
      background: #ecfeff;
      border: 1px solid #cffafe;
      border-radius: 8px;
      padding: 14px 16px;
      margin-top: -8px;
    }

    .demo-title {
      font-size: 10px;
      font-weight: 600;
      color: #0891b2;
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .demo-item {
      font-size: 11px;
      color: #164e63;
      margin: 4px 0;
    }

    .demo-item strong {
      color: #0e7490;
      font-weight: 600;
    }

    .new-user {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
    }

    .link-button {
      background: none;
      border: none;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      padding: 0;
      font-size: 12px;
    }

    .link-button:hover {
      text-decoration: underline;
    }

    .footer-text {
      text-align: center;
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 24px;
      max-width: 440px;
    }

    .footer-text a {
      color: var(--primary);
      text-decoration: none;
    }

    .footer-text a:hover {
      text-decoration: underline;
    }

    .copyright {
      text-align: center;
      font-size: 10px;
      color: var(--text-subtle);
      margin-top: 16px;
    }

    @media (max-width: 768px) {
      .login-page::before {
        width: 600px;
        height: 600px;
        top: -300px;
        left: -200px;
      }

      .login-page::after {
        width: 400px;
        height: 400px;
        bottom: -200px;
        right: -100px;
      }
    }

    @media (max-width: 640px) {
      .logo {
        position: relative;
        top: 0;
        left: 0;
        padding: 20px;
        text-align: center;
      }

      .utility-toggles {
        position: relative;
        top: 0;
        right: 0;
        justify-content: center;
        margin: 0 0 12px;
      }

      .theme-toggle {
        position: relative;
        top: 0;
        right: 0;
        margin: 0 0 12px;
      }

      .logo svg {
        width: 160px;
        height: 36px;
      }

      .login-container {
        padding: 20px 16px;
      }

      .login-card {
        max-width: 100%;
      }

      .login-header {
        padding: 32px 24px 24px;
      }

      .login-header h1 {
        font-size: 22px;
      }

      .login-form {
        padding-left: 24px;
        padding-right: 24px;
      }

      .form-options {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  protected languageService = inject(LanguageService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private themeService = inject(ThemeService);

  protected copy = this.languageService.copy;

  protected email = '';
  protected password = '';
  protected rememberMe = false;
  protected errorMessage = signal('');
  protected isLoading = signal(false);
  protected isRegisterMode = signal(false);
  protected registerEmail = '';
  protected registerPassword = '';
  protected registerConfirm = '';
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

  protected setRegisterMode(isRegister: boolean): void {
    this.isRegisterMode.set(isRegister);
    this.errorMessage.set('');
    this.isLoading.set(false);
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirm = '';
  }

  protected async onLogin(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    const success = await this.authService.login(this.email, this.password);

    if (success) {
      this.toastService.success(this.copy().loginSuccessToast);
      this.router.navigate(['/dashboard']);
      return;
    }

    this.errorMessage.set(this.copy().loginInvalidMessage);
    this.toastService.error(this.copy().loginInvalidToast);
    this.isLoading.set(false);
  }

  protected async onRegister(): Promise<void> {
    this.errorMessage.set('');

    if (this.registerPassword !== this.registerConfirm) {
      this.errorMessage.set(this.copy().registerPasswordMismatch);
      return;
    }

    this.isLoading.set(true);

    const success = await this.authService.register(
      this.registerEmail.trim(),
      this.registerPassword
    );

    if (success) {
      this.toastService.success(this.copy().registerSuccessToast);
      this.email = this.registerEmail.trim();
      this.password = '';
      this.setRegisterMode(false);
      return;
    }

    this.errorMessage.set(this.copy().registerErrorMessage);
    this.toastService.error(this.copy().registerErrorToast);
    this.isLoading.set(false);
  }
}

