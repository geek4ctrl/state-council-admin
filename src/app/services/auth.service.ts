import { Injectable, signal } from '@angular/core';
import { User, UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private storageKey = 'currentUser';

  constructor() {
    this.loadFromStorage();

    // Auto-login with default user if not logged in
    if (!this.currentUser()) {
      this.loginAsAdmin();
    }
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  loginAsAdmin(): void {
    const admin: User = {
      id: 'admin',
      name: 'Admin',
      email: 'admin@newscenter.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      role: 'admin',
      createdAt: new Date()
    };

    this.currentUser.set(admin);
    this.saveToStorage();
  }

  updateProfile(profile: UserProfile): void {
    const user = this.currentUser();
    if (user) {
      const updated: User = {
        ...user,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar
      };
      this.currentUser.set(updated);
      this.saveToStorage();
    }
  }

  logout(): void {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      }
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.currentUser.set({
            ...parsed,
            createdAt: new Date(parsed.createdAt)
          });
        } catch (e) {
          console.error('Error loading user from storage:', e);
        }
      }
    }
  }
}
