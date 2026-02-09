import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, UserProfile } from '../models/user.model';

type ApiUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'admin' | 'user' | string;
  createdAt?: string;
};

type ApiAuthResponse = {
  token?: string;
  accessToken?: string;
  user?: ApiUser;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUser = signal<User | null>(null);
  private storageKey = 'currentUser';
  private tokenKey = 'authToken';
  private apiBase = 'http://localhost:3001';

  constructor() {
    this.loadFromStorage();
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiAuthResponse>(`${this.apiBase}/api/auth/login`, { email, password })
      );

      const token = response.token ?? response.accessToken ?? '';
      const apiUser = response.user;

      if (!token || !apiUser) {
        return false;
      }

      const user: User = {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        avatar: apiUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        role: apiUser.role === 'admin' ? 'admin' : 'user',
        createdAt: apiUser.createdAt ? new Date(apiUser.createdAt) : new Date()
      };

      this.currentUser.set(user);
      this.saveToken(token);
      this.saveToStorage();
      return true;
    } catch {
      return false;
    }
  }

  async register(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiAuthResponse>(`${this.apiBase}/api/auth/register`, { email, password })
      );

      const token = response.token ?? response.accessToken ?? '';
      const apiUser = response.user;

      if (token && apiUser) {
        const user: User = {
          id: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          avatar: apiUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
          role: apiUser.role === 'admin' ? 'admin' : 'user',
          createdAt: apiUser.createdAt ? new Date(apiUser.createdAt) : new Date()
        };

        this.currentUser.set(user);
        this.saveToken(token);
        this.saveToStorage();
      }

      return true;
    } catch {
      return false;
    }
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
      localStorage.removeItem(this.tokenKey);
    }
  }

  getAuthToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      }
    }
  }

  private saveToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
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
