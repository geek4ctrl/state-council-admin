import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="logo">
        <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
          <circle cx="20" cy="20" r="18" fill="#0891b2"/>
          <path d="M15 15 L20 20 L25 15" stroke="white" stroke-width="2" fill="none"/>
          <path d="M15 23 L25 23" stroke="white" stroke-width="2"/>
          <text x="35" y="27" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#0891b2">State Council</text>
        </svg>
      </div>

      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1>Welcome to State Council</h1>
            <p>Please login to your account</p>
          </div>

          <form (ngSubmit)="onLogin()" class="login-form">
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
              />
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
                <span>Remember me</span>
              </label>
              <a href="#" class="forgot-link">Forgot your password?</a>
            </div>

            @if (errorMessage()) {
              <div class="error-message">
                {{ errorMessage() }}
              </div>
            }

            <button type="submit" class="btn-login" [disabled]="isLoading()">
              {{ isLoading() ? 'SIGNING IN...' : 'LOGIN' }}
            </button>

            <div class="demo-credentials">
              <p class="demo-title">Demo Credentials:</p>
              <p class="demo-item"><strong>Email:</strong> admin@statecounciladmin.com</p>
              <p class="demo-item"><strong>Password:</strong> admin123</p>
            </div>

            <div class="new-user">
              <span>New User? <a href="#">Create an Account</a></span>
            </div>
          </form>

          <div class="divider">
            <span>OR</span>
          </div>

          <div class="social-login">
            <button type="button" class="btn-facebook">
              <span class="icon">f</span>
              Login with Facebook
            </button>
            <button type="button" class="btn-google">
              <span class="icon">G</span>
              Login with Google
            </button>
          </div>
        </div>

        <div class="footer-text">
          Registering to this website, you accept our
          <a href="#">Terms of use</a> and our <a href="#">Privacy policy</a>
        </div>

        <div class="copyright">
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
      background: #f3f4f6;
      position: relative;
      overflow: hidden;
    }

    .login-page::before,
    .login-page::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
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
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    }

    .logo {
      position: absolute;
      top: 32px;
      left: 40px;
      z-index: 10;
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
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
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
      color: #6b7280;
      margin: 0 0 8px 0;
    }

    .login-header p {
      font-size: 14px;
      color: #9ca3af;
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
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    input[type="email"],
    input[type="password"] {
      padding: 12px 16px;
      border: none;
      border-bottom: 1px solid #e5e7eb;
      font-size: 15px;
      font-family: inherit;
      transition: border-color 0.2s;
      background: transparent;
    }

    input[type="email"]:focus,
    input[type="password"]:focus {
      outline: none;
      border-bottom-color: #0891b2;
    }

    input::placeholder {
      color: #d1d5db;
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
      color: #6b7280;
      cursor: pointer;
    }

    .remember-me input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .forgot-link {
      font-size: 13px;
      color: #0891b2;
      text-decoration: none;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 13px;
      border-left: 3px solid #dc2626;
    }

    .btn-login {
      background: #0891b2;
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
      background: #0e7490;
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
      color: #6b7280;
    }

    .new-user a {
      color: #0891b2;
      text-decoration: none;
      font-weight: 500;
    }

    .new-user a:hover {
      text-decoration: underline;
    }

    .divider {
      text-align: center;
      padding: 20px 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 1px;
      background: #e5e7eb;
    }

    .divider span {
      background: white;
      padding: 0 16px;
      font-size: 13px;
      color: #9ca3af;
      position: relative;
      z-index: 1;
    }

    .social-login {
      background: #2d3748;
      padding: 32px 40px;
      display: flex;
      gap: 16px;
    }

    .btn-facebook,
    .btn-google {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px 20px;
      border-radius: 6px;
      border: none;
      color: white;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-facebook {
      background: #3b5998;
    }

    .btn-facebook:hover {
      transform: translateY(-2px);
    }

    .btn-google {
      background: #db4437;
    }

    .btn-google:hover {
      transform: translateY(-2px);
    }

    .btn-facebook .icon,
    .btn-google .icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
    }

    .footer-text {
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      margin-top: 24px;
      max-width: 440px;
    }

    .footer-text a {
      color: #0891b2;
      text-decoration: none;
    }

    .footer-text a:hover {
      text-decoration: underline;
    }

    .copyright {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
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

      .logo svg {
        width: 80px;
        height: 32px;
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

      .login-form,
      .social-login {
        padding-left: 24px;
        padding-right: 24px;
      }

      .social-login {
        flex-direction: column;
        padding: 24px;
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

  protected email = '';
  protected password = '';
  protected rememberMe = false;
  protected errorMessage = signal('');
  protected isLoading = signal(false);

  protected onLogin(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    // Simulate a brief loading state
    setTimeout(() => {
      const success = this.authService.login(this.email, this.password);

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Invalid email or password. Please use the demo credentials.');
        this.isLoading.set(false);
      }
    }, 500);
  }
}
