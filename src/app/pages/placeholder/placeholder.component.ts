import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-placeholder',
  imports: [],
  template: `
    <div class="placeholder-page">
      <div class="placeholder-content">
        <span class="placeholder-icon">🚧</span>
        <h1>{{ copy().placeholderTitle }}</h1>
        <p>{{ copy().placeholderSubtitle }}</p>
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
      font-size: 62px;
      display: block;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 30px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #212529;
    }

    p {
      font-size: 14px;
      color: #6c757d;
      margin: 0;
    }
  `]
})
export class PlaceholderComponent {
  private languageService = inject(LanguageService);
  protected copy = this.languageService.copy;
}

