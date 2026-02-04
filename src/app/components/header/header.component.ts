import { Component, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
    <header class="header">
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
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .greeting {
      font-size: 24px;
      font-weight: 400;
      margin: 0;
      color: #212529;
    }
  `]
})
export class HeaderComponent {
  protected userName = computed(() => {
    const user = this.authService.getCurrentUser()();
    return user?.name || 'Guest';
  });

  constructor(private authService: AuthService) {}
}
