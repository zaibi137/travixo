import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface AuthUser {
  userId: string;
  displayName: string;
  role: string;
}

export interface ActionResult {
  success: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'travixo-auth-user';
  private readonly tokenKey = 'authToken';
  private readonly refreshTokenKey = 'refreshToken';
  private readonly expiresAtKey = 'expiresAt';
  private readonly branchIdKey = 'branchId';
  private readonly branchKeyKey = 'branchKey';

  constructor() {}

  // 🛠️ MOCK LOGIN (Uses LocalStorage instead of HTTP API)
  login(email: string, password: string): Observable<boolean> {
    const dummyToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
    const dummyUser: AuthUser = {
      userId: email,
      displayName: email.split('@')[0] || 'Demo User',
      role: 'Admin'
    };

    // Save mock auth session to LocalStorage
    localStorage.setItem(this.tokenKey, dummyToken);
    localStorage.setItem(this.refreshTokenKey, 'mock-refresh-token');
    localStorage.setItem(this.expiresAtKey, new Date(Date.now() + 86400000).toISOString());
    localStorage.setItem(this.branchIdKey, '1');
    localStorage.setItem(this.branchKeyKey, '1');
    this.storeUser(dummyUser);

    // Simulate short network delay
    return of(true).pipe(delay(400));
  }

  // 🛠️ MOCK FORGOT PASSWORD
  forgotPassword(email: string, userCode: string): Observable<ActionResult> {
    return of({
      success: true,
      message: 'OTP sent to ' + email
    }).pipe(delay(400));
  }

  // 🛠️ MOCK VERIFY OTP
  verifyResetToken(resetToken: string, userCode: string): Observable<ActionResult> {
    // Accepts any 4-digit code
    return of({
      success: true,
      message: 'OTP verified successfully.'
    }).pipe(delay(300));
  }

  // 🛠️ MOCK RESET PASSWORD
  resetPassword(resetToken: string, newPassword: string, userCode: string): Observable<ActionResult> {
    return of({
      success: true,
      message: 'Password reset successfully.'
    }).pipe(delay(400));
  }

  // 🛠️ MOCK LOGOUT
  logout(): Observable<ActionResult> {
    this.clearLocalStorage();
    return of({
      success: true,
      message: 'Logged out successfully.'
    });
  }

  // HELPER METHODS
  private clearLocalStorage(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.expiresAtKey);
    localStorage.removeItem(this.branchIdKey);
    localStorage.removeItem(this.branchKeyKey);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null && this.getToken() !== null;
  }

  currentUser(): AuthUser | null {
    const rawUser = localStorage.getItem(this.storageKey);
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private storeUser(user: AuthUser): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }
}