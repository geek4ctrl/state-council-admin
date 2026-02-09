import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
          <text x="45" y="27" font-family="Sora, sans-serif" font-size="18" font-weight="600" fill="#0891b2">State Council</text>
        </svg>
      </div>
      <button
        class="theme-toggle"
        type="button"
        (click)="toggleTheme()"
        [attr.aria-label]="themeAriaLabel()"
      >
        <span class="theme-icon" aria-hidden="true">{{ themeIcon() }}</span>
      </button>

      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1>{{ isRegisterMode() ? 'Create your account' : 'Welcome to State Council' }}</h1>
            <p>{{ isRegisterMode() ? 'Fill in your details to get started' : 'Please login to your account' }}</p>
          </div>

          @if (isRegisterMode()) {
            <form (ngSubmit)="onRegister()" class="login-form" role="form" aria-label="Create account form">
              <div class="form-group">
                <label for="registerEmail">Email Address</label>
                <input
                  type="email"
                  id="registerEmail"
                  [(ngModel)]="registerEmail"
                  name="registerEmail"
                  placeholder="you@example.com"
                  required
                  autocomplete="email"
                  aria-required="true"
                />
              </div>

              <div class="form-group">
                <label for="registerPassword">Password</label>
                <input
                  type="password"
                  id="registerPassword"
                  [(ngModel)]="registerPassword"
                  name="registerPassword"
                  placeholder="Create a password"
                  required
                  autocomplete="new-password"
                  aria-required="true"
                />
              </div>

              <div class="form-group">
                <label for="registerConfirm">Confirm Password</label>
                <input
                  type="password"
                  id="registerConfirm"
                  [(ngModel)]="registerConfirm"
                  name="registerConfirm"
                  placeholder="Confirm your password"
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
                aria-label="Create your account"
              >
                {{ isLoading() ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT' }}
              </button>

              <div class="new-user">
                <span>Already have an account?
                  <button type="button" class="link-button" (click)="setRegisterMode(false)">Sign In</button>
                </span>
              </div>
            </form>
          } @else {
            <form (ngSubmit)="onLogin()" class="login-form" role="form" aria-label="Login form">
              <div class="form-group">
                <label for="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="admin@statecounciladmin.com"
                  required
                  autocomplete="email"
                  aria-required="true"
                  aria-describedby="email-hint"
                />
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input
                  type="password"
                  id="password"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="••••••••••"
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
                    aria-label="Remember me"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" class="forgot-link" role="button" aria-label="Forgot your password">Forgot your password?</a>
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
                aria-label="Login to your account"
              >
                {{ isLoading() ? 'SIGNING IN...' : 'LOGIN' }}
              </button>

              <div class="new-user">
                <span>New User?
                  <button type="button" class="link-button" (click)="setRegisterMode(true)">Create an Account</button>
                </span>
              </div>
            </form>
          }
        </div>

        <footer class="footer-text" role="contentinfo">
          Registering to this website, you accept our
          <a href="#" aria-label="Read our terms of use">Terms of use</a> and our <a href="#" aria-label="Read our privacy policy">Privacy policy</a>
        </footer>

        <div class="copyright" role="contentinfo">
          © 2026 State Council. All rights reserved
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

    .theme-toggle {
      position: absolute;
      top: 28px;
      right: 32px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      transition: all 0.2s;
      z-index: 10;
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
      font-size: 28px;
      font-weight: 400;
      color: var(--text-muted);
      margin: 0 0 8px 0;
    }

    .login-header p {
      font-size: 14px;
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
      font-size: 13px;
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
      font-size: 15px;
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
      font-size: 13px;
      color: var(--text-muted);
      cursor: pointer;
    }

    .remember-me input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .forgot-link {
      font-size: 13px;
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
      font-size: 13px;
      border-left: 3px solid var(--danger);
    }

    .btn-login {
      background: var(--primary);
      color: white;
      border: none;
      padding: 14px;
      border-radius: 25px;
      font-size: 14px;
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
      font-size: 12px;
      font-weight: 600;
      color: #0891b2;
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .demo-item {
      font-size: 13px;
      color: #164e63;
      margin: 4px 0;
    }

    .demo-item strong {
      color: #0e7490;
      font-weight: 600;
    }

    .new-user {
      text-align: center;
      font-size: 14px;
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
      font-size: 14px;
    }

    .link-button:hover {
      text-decoration: underline;
    }

    .footer-text {
      text-align: center;
      font-size: 12px;
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
      font-size: 12px;
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
        font-size: 24px;
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
  private router = inject(Router);
  private toastService = inject(ToastService);
  private themeService = inject(ThemeService);

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
    this.themeService.themeName() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  );

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
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
      this.toastService.success('Login successful! Welcome back.');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.errorMessage.set('Invalid email or password. Please use the demo credentials.');
    this.toastService.error('Invalid email or password. Please try again.');
    this.isLoading.set(false);
  }

  protected async onRegister(): Promise<void> {
    this.errorMessage.set('');

    if (this.registerPassword !== this.registerConfirm) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);

    const success = await this.authService.register(
      this.registerEmail.trim(),
      this.registerPassword
    );

    if (success) {
      this.toastService.success('Account created successfully. Please sign in.');
      this.email = this.registerEmail.trim();
      this.password = '';
      this.setRegisterMode(false);
      return;
    }

    this.errorMessage.set('Unable to create account. Please try again.');
    this.toastService.error('Registration failed. Please try again.');
    this.isLoading.set(false);
  }
}
