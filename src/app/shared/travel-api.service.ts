import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, startWith, tap } from 'rxjs';
import { API_BASE_URL, ScreenConfig } from './api-screen.config';

export interface ApiLoadResult {
  status: 'loading' | 'ready' | 'unauthorized' | 'missing' | 'error';
  message: string;
  rows: Record<string, unknown>[];
}

@Injectable({ providedIn: 'root' })
export class TravelApiService {
  constructor(private readonly http: HttpClient) {}

  loadRows(config: ScreenConfig) {
    if (!config.api) {
      return of<ApiLoadResult>({
        status: 'missing',
        message: config.missingReason ?? 'No API endpoint configured.',
        rows: []
      });
    }

    const baseUrl = API_BASE_URL.replace(/\/$/, '');
    const endpoint = config.api.listUrl.startsWith('/') ? config.api.listUrl : `/${config.api.listUrl}`;

    let endpointNormalized = endpoint;
    if (baseUrl === '/api' && endpoint.startsWith('/api')) {
      endpointNormalized = endpoint.replace(/^\/api/, '');
    }

    const fullUrl = `${baseUrl}${endpointNormalized}`;
    const params = new HttpParams();

    const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Fetching live rows from:', fullUrl);

    return this.http.get<unknown>(fullUrl, { params, headers }).pipe(
      tap(response => console.log('Raw API Response:', response)),
      map((payload) => ({
        status: 'ready' as const,
        message: `Loaded live data successfully.`,
        rows: this.extractRows(payload)
      })),
      catchError((error: HttpErrorResponse) => {
        console.error('API Error Details:', error);

        if (error.status === 401 || error.status === 0) {
          return of<ApiLoadResult>({
            status: 'unauthorized',
            message: 'Authentication failed! Please make sure you are logged in and your token is saved.',
            rows: []
          });
        }

        return of<ApiLoadResult>({
          status: 'error',
          message: `Error ${error.status}: ${error.statusText}`,
          rows: []
        });
      }),
      startWith({
        status: 'loading' as const,
        message: 'Fetching...',
        rows: []
      })
    );
  }

  saveRow(config: ScreenConfig, payload: Record<string, unknown>) {
    if (!config.api?.saveUrl) {
      throw new Error('No save endpoint configured for this screen.');
    }

    const baseUrl = API_BASE_URL.replace(/\/$/, '');
    const endpoint = config.api.saveUrl.startsWith('/') ? config.api.saveUrl : `/${config.api.saveUrl}`;

    let endpointNormalized = endpoint;
    if (baseUrl === '/api' && endpoint.startsWith('/api')) {
      endpointNormalized = endpoint.replace(/^\/api/, '');
    }

    const fullUrl = `${baseUrl}${endpointNormalized}`;
    const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Posting new record to live API:', fullUrl, payload);
    return this.http.post(fullUrl, payload, { headers });
  }

  private extractRows(payload: unknown): Record<string, unknown>[] {
    if (Array.isArray(payload)) return payload;

    if (payload && typeof payload === 'object') {
      const candidate = payload as Record<string, unknown>;
      const possibleArrays = [
        'data', 'items', 'result', 'results', 'records', 'list', 
        'customers', 'transactions', 'vendors', 'payments', 'purchases', 
        'invoices', 'expenses', 'allocations', 'expense_allocations',
        'receipts', 'customer_receipts', 'customer_receipt', 'cheques', 'cheque',
        'branches', 'branch'
      ];
      
      // 1. Root level array search
      for (const key of possibleArrays) {
        if (Array.isArray(candidate[key])) {
          return candidate[key] as Record<string, unknown>[];
        }
      }

      // 2. Nested 'data' object search
      if (candidate['data'] && typeof candidate['data'] === 'object') {
        const innerData = candidate['data'] as Record<string, unknown>;

        if (Array.isArray(innerData)) {
          return innerData as Record<string, unknown>[];
        }

        for (const key of possibleArrays) {
          if (Array.isArray(innerData[key])) {
            return innerData[key] as Record<string, unknown>[];
          }
        }
      }
    }

    console.warn('extractRows: Could not locate array in response payload.', payload);
    return [];
  }
}