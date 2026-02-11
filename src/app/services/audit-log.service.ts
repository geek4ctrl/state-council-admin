import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuditLog } from '../models/audit-log.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

type ApiAuditLog = {
  id: number | string;
  actor_id?: number | string | null;
  actorId?: number | string | null;
  actor_email?: string | null;
  actorEmail?: string | null;
  action?: string | null;
  entity_type?: string | null;
  entityType?: string | null;
  entity_id?: number | string | null;
  entityId?: number | string | null;
  details?: Record<string, unknown> | null;
  ip?: string | null;
  user_agent?: string | null;
  userAgent?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
};

type ApiAuditLogListResponse = {
  logs?: ApiAuditLog[];
  total?: number;
};

export type AuditLogQuery = {
  action?: string;
  entityType?: string;
  actorId?: string | number;
  from?: string;
  to?: string;
  q?: string;
  limit?: number;
  offset?: number;
};

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiBase = environment.apiBaseUrl;

  async listLogs(params: AuditLogQuery): Promise<{ logs: AuditLog[]; total: number }> {
    const httpParams = new HttpParams({
      fromObject: Object.fromEntries(
        Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== null && String(value).length > 0)
          .map(([key, value]) => [key, String(value)])
      )
    });

    const response = await firstValueFrom(
      this.http.get<ApiAuditLogListResponse>(`${this.apiBase}/api/audit`, {
        headers: this.getAuthHeaders(),
        params: httpParams
      })
    );

    const logs = (response.logs ?? []).map((log) => this.mapLog(log));
    return { logs, total: response.total ?? logs.length };
  }

  private mapLog(log: ApiAuditLog): AuditLog {
    return {
      id: String(log.id),
      actorId: log.actorId ? String(log.actorId) : log.actor_id ? String(log.actor_id) : null,
      actorEmail: log.actorEmail ?? log.actor_email ?? null,
      action: log.action ?? 'unknown',
      entityType: log.entityType ?? log.entity_type ?? 'unknown',
      entityId: log.entityId ? String(log.entityId) : log.entity_id ? String(log.entity_id) : null,
      details: log.details ?? null,
      ip: log.ip ?? null,
      userAgent: log.userAgent ?? log.user_agent ?? null,
      createdAt: new Date(log.createdAt ?? log.created_at ?? new Date().toISOString())
    };
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
