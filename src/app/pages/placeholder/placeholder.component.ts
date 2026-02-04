import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  imports: [],
  template: `
    <div class="placeholder-page">
      <div class="placeholder-content">
        <span class="placeholder-icon">🚧</span>
        <h1>Coming Soon</h1>
        <p>This feature is under development</p>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 500px;
    }

    .placeholder-content {
      text-align: center;
    }

    .placeholder-icon {
      font-size: 64px;
      display: block;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 32px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #212529;
    }

    p {
      font-size: 16px;
      color: #6c757d;
      margin: 0;
    }
  `]
})
export class PlaceholderComponent {}
