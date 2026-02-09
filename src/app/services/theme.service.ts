import { Injectable, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

type ThemeName = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storageKey = 'theme';
  private document = inject(DOCUMENT);
  private theme = signal<ThemeName>('light');

  readonly themeName = this.theme.asReadonly();

  constructor() {
    this.theme.set(this.getInitialTheme());

    effect(() => {
      const value = this.theme();
      const root = this.document.documentElement;

      root.setAttribute('data-theme', value);
      root.style.colorScheme = value;

      const view = this.document.defaultView;
      if (view?.localStorage) {
        view.localStorage.setItem(this.storageKey, value);
      }
    });
  }

  toggleTheme(): void {
    this.theme.update((value) => (value === 'light' ? 'dark' : 'light'));
  }

  setTheme(value: ThemeName): void {
    this.theme.set(value);
  }

  private getInitialTheme(): ThemeName {
    const view = this.document.defaultView;
    if (!view) {
      return 'light';
    }

    const stored = view.localStorage?.getItem(this.storageKey) as ThemeName | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return view.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
