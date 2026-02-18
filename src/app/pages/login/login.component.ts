import { Component, computed, HostListener, inject, signal } from '@angular/core';
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
      <div class="utility-menu" [class.is-open]="utilityOpen()">
        <button
          class="utility-trigger"
          type="button"
          (click)="toggleUtilityMenu()"
          [attr.aria-label]="copy().utilityMenuLabel"
          [attr.aria-expanded]="utilityOpen()"
          aria-haspopup="menu"
        >
          {{ copy().utilityMenuLabel }}
        </button>
        @if (utilityOpen()) {
          <div class="utility-dropdown" role="menu">
            <button
              class="utility-item"
              type="button"
              (click)="toggleTheme()"
              [attr.aria-label]="themeAriaLabel()"
            >
              <span>{{ copy().headerThemeLabel }}</span>
              <span class="utility-value">{{ themeLabel() }}</span>
            </button>
            <div class="utility-group" role="group" [attr.aria-label]="copy().headerLanguageLabel">
              <span class="utility-group-label">{{ copy().headerLanguageLabel }}</span>
              <div class="utility-pills">
                <button
                  class="utility-pill"
                  type="button"
                  [class.is-active]="languageService.languageName() === 'en'"
                  [attr.aria-pressed]="languageService.languageName() === 'en'"
                  [attr.aria-label]="copy().switchToEnglishLabel"
                  (click)="setLanguage('en')"
                >
                  EN
                </button>
                <button
                  class="utility-pill"
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
          </div>
        }
      </div>

      <div class="login-container">
        <p class="page-subtitle">{{ copy().loginPageSubtitle }}</p>
        <div class="login-card-wrap">
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
                <div class="input-wrap">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
                  </span>
                  <input
                    class="input-field"
                    type="email"
                    id="registerEmail"
                    [(ngModel)]="registerEmail"
                    name="registerEmail"
                    [placeholder]="copy().emailPlaceholder"
                    required
                    autocomplete="email"
                    aria-required="true"
                    aria-describedby="register-email-hint"
                  />
                </div>
                <p class="field-help" id="register-email-hint">{{ copy().loginEmailHelp }}</p>
              </div>

              <div class="form-group">
                <label for="registerPassword">{{ copy().passwordLabel }}</label>
                <div class="input-wrap">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
                  </span>
                  <input
                    class="input-field has-toggle"
                    [type]="showRegisterPassword() ? 'text' : 'password'"
                    id="registerPassword"
                    [(ngModel)]="registerPassword"
                    name="registerPassword"
                    [placeholder]="copy().createPasswordPlaceholder"
                    required
                    autocomplete="new-password"
                    aria-required="true"
                  />
                  <button
                    class="input-action"
                    type="button"
                    (click)="togglePassword('register')"
                    [attr.aria-label]="showRegisterPassword() ? copy().loginHidePassword : copy().loginShowPassword"
                  >
                    {{ showRegisterPassword() ? copy().loginHidePassword : copy().loginShowPassword }}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="registerConfirm">{{ copy().confirmPasswordLabel }}</label>
                <div class="input-wrap">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
                  </span>
                  <input
                    class="input-field has-toggle"
                    [type]="showRegisterConfirm() ? 'text' : 'password'"
                    id="registerConfirm"
                    [(ngModel)]="registerConfirm"
                    name="registerConfirm"
                    [placeholder]="copy().confirmPasswordPlaceholder"
                    required
                    autocomplete="new-password"
                    aria-required="true"
                  />
                  <button
                    class="input-action"
                    type="button"
                    (click)="togglePassword('confirm')"
                    [attr.aria-label]="showRegisterConfirm() ? copy().loginHidePassword : copy().loginShowPassword"
                  >
                    {{ showRegisterConfirm() ? copy().loginHidePassword : copy().loginShowPassword }}
                  </button>
                </div>
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
                <div class="input-wrap">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
                  </span>
                  <input
                    class="input-field"
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
                <p class="field-help" id="email-hint">{{ copy().loginEmailHelp }}</p>
              </div>

              <div class="form-group">
                <label for="password">{{ copy().passwordLabel }}</label>
                <div class="input-wrap">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
                  </span>
                  <input
                    class="input-field has-toggle"
                    [type]="showPassword() ? 'text' : 'password'"
                    id="password"
                    [(ngModel)]="password"
                    name="password"
                    [placeholder]="copy().passwordPlaceholder"
                    required
                    autocomplete="current-password"
                    aria-required="true"
                  />
                  <button
                    class="input-action"
                    type="button"
                    (click)="togglePassword('login')"
                    [attr.aria-label]="showPassword() ? copy().loginHidePassword : copy().loginShowPassword"
                  >
                    {{ showPassword() ? copy().loginHidePassword : copy().loginShowPassword }}
                  </button>
                </div>
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



    .logo {
      position: absolute;
      top: 32px;
      left: 40px;
      z-index: 10;
    }

    .utility-menu {
      position: absolute;
      top: 28px;
      right: 32px;
      z-index: 10;
    }

    .utility-trigger {
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.3px;
      line-height: 1;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: var(--shadow-soft);
    }

    .utility-trigger:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .utility-dropdown {
      position: absolute;
      right: 0;
      top: calc(100% + 10px);
      min-width: 220px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: var(--shadow-strong);
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .utility-item {
      background: var(--surface-alt);
      border: 1px solid var(--border);
      padding: 10px 12px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      color: var(--text);
      cursor: pointer;
    }

    .utility-item:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .utility-value {
      font-size: 10px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .utility-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .utility-group-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--text-muted);
    }

    .utility-pills {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--surface);
      padding: 2px;
      gap: 2px;
    }

    .utility-pill {
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

    .utility-pill:hover {
      color: var(--primary);
    }

    .utility-pill.is-active {
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(8, 145, 178, 0.25);
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

    .page-subtitle {
      margin: 0 0 18px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .login-card-wrap {
      position: relative;
    }

    .login-card-wrap::before {
      content: "";
      position: absolute;
      inset: -40px;
      background: radial-gradient(circle, rgba(8, 145, 178, 0.14) 0%, rgba(8, 145, 178, 0.02) 55%, transparent 70%);
      z-index: 0;
      filter: blur(6px);
    }

    .login-card {
      background: linear-gradient(180deg, var(--surface) 0%, color-mix(in srgb, var(--surface) 85%, var(--surface-elev)) 100%);
      border-radius: 12px;
      box-shadow: var(--shadow-strong);
      width: 100%;
      max-width: 440px;
      overflow: hidden;
      position: relative;
      z-index: 1;
    }

    .login-header {
      text-align: center;
      padding: 40px 40px 32px;
    }

    .login-header h1 {
      font-size: 22px;
      font-weight: 600;
      color: var(--text);
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
      font-weight: 600;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 0;
      width: 36px;
      height: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--text-subtle);
    }

    .input-icon svg {
      width: 18px;
      height: 18px;
    }

    .input-action {
      position: absolute;
      right: 0;
      height: 100%;
      padding: 0 12px;
      border: none;
      background: none;
      color: var(--primary);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      cursor: pointer;
    }

    .input-action:hover {
      color: var(--primary-strong);
    }

    .input-field {
      width: 100%;
      padding: 12px 16px 12px 36px;
      border: 1px solid transparent;
      border-bottom: 1px solid var(--border);
      border-radius: 8px;
      font-size: 13px;
      font-family: inherit;
      transition: border-color 0.2s;
      background: transparent;
    }

    .input-field.has-toggle {
      padding-right: 72px;
    }

    .input-field:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: var(--ring);
    }

    input::placeholder {
      color: var(--text-subtle);
    }

    .field-help {
      font-size: 11px;
      color: var(--text-subtle);
      margin: 4px 0 0;
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
      background: linear-gradient(135deg, var(--primary), var(--primary-strong));
      color: white;
      border: none;
      padding: 16px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 8px;
      width: 100%;
      box-shadow: 0 12px 24px rgba(8, 145, 178, 0.2);
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 16px 30px rgba(8, 145, 178, 0.28);
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
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
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
        padding: 18px 16px 6px;
        text-align: center;
        display: flex;
        justify-content: center;
      }

      .utility-menu {
        position: relative;
        top: 0;
        right: 0;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        width: fit-content;
        margin: 6px auto 18px;
      }

      .utility-dropdown {
        right: 50%;
        transform: translateX(50%);
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
        border: 1px solid var(--border);
        box-shadow: var(--shadow-card);
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
  protected utilityOpen = signal(false);
  protected showPassword = signal(false);
  protected showRegisterPassword = signal(false);
  protected showRegisterConfirm = signal(false);

  protected themeAriaLabel = computed(() =>
    this.themeService.themeName() === 'dark'
      ? this.copy().themeSwitchToLight
      : this.copy().themeSwitchToDark
  );

  protected themeLabel = computed(() =>
    this.themeService.themeName() === 'dark'
      ? this.copy().themeDarkLabel
      : this.copy().themeLightLabel
  );

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
    this.utilityOpen.set(false);
  }

  protected toggleUtilityMenu(): void {
    this.utilityOpen.set(!this.utilityOpen());
  }

  protected togglePassword(target: 'login' | 'register' | 'confirm'): void {
    if (target === 'login') {
      this.showPassword.set(!this.showPassword());
      return;
    }

    if (target === 'register') {
      this.showRegisterPassword.set(!this.showRegisterPassword());
      return;
    }

    this.showRegisterConfirm.set(!this.showRegisterConfirm());
  }

  protected setLanguage(value: 'en' | 'fr'): void {
    this.languageService.setLanguage(value);
    this.utilityOpen.set(false);
  }

  protected setRegisterMode(isRegister: boolean): void {
    this.isRegisterMode.set(isRegister);
    this.errorMessage.set('');
    this.isLoading.set(false);
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirm = '';
    this.showRegisterPassword.set(false);
    this.showRegisterConfirm.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.utility-menu')) {
      this.utilityOpen.set(false);
    }
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

