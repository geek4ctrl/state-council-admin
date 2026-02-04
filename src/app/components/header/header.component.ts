import { Component, computed, output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
    <header class="header">
      <button class="hamburger" (click)="toggleSidebar.emit()">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <h2 class="greeting">Hello, {{ userName() }}</h2>
    </header>
  `,
  styles: [`
    .header {
      height: 64px;
      background: white;
      border-bottom: 1px solid #e9ecef;
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
      background: #0891b2;
      border-radius: 2px;
      transition: all 0.3s;
    }

    .hamburger:hover span {
      background: #0e7490;
    }

    .greeting {
      font-size: 24px;
      font-weight: 400;
      margin: 0;
      color: #212529;
      flex: 1;
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

  protected userName = computed(() => {
    const user = this.authService.getCurrentUser()();
    return user?.name || 'Guest';
  });

  constructor(private authService: AuthService) {}
}
