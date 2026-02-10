import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

type ApiUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  role?: 'admin' | 'user' | string | null;
  createdAt?: string | null;
  created_at?: string | null;
};

type ApiUsersResponse = {
  users?: ApiUser[];
  data?: ApiUser[];
  items?: ApiUser[];
  results?: ApiUser[];
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private users = signal<User[]>([]);
  private apiBase = environment.apiBaseUrl;

  getUsers() {
    return this.users.asReadonly();
  }

  async loadUsers(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiUser[] | ApiUsersResponse>(`${this.apiBase}/api/users`, { headers: this.getAuthHeaders() })
      );
      const users = this.extractUsers(response).map((user) => this.mapUser(user));
      this.users.set(users);
      return true;
    } catch {
      return false;
    }
  }

  private extractUsers(response: ApiUser[] | ApiUsersResponse): ApiUser[] {
    if (Array.isArray(response)) {
      return response;
    }
    return response.users ?? response.data ?? response.items ?? response.results ?? [];
  }

  private mapUser(user: ApiUser): User {
    return {
      id: user.id,
      name: user.name ?? 'Unknown',
      email: user.email ?? 'unknown@example.com',
      avatar: user.avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      role: user.role === 'admin' ? 'admin' : 'user',
      createdAt: user.createdAt
        ? new Date(user.createdAt)
        : user.created_at
          ? new Date(user.created_at)
          : new Date()
    };
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
