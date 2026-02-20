import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private titleService = inject(Title);

  constructor() {
    // Update page title when language changes
    effect(() => {
      const copy = this.languageService.copy();
      this.titleService.setTitle(copy.sidebarTitle);
    });
  }
}
