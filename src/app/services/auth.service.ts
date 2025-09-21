import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { tap } from "rxjs";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private tokenKey = 'auth_token';
  private userSignal = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  register(email: string, name: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, name, password })
      .pipe(tap(response => this.handleAuth(response)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(response => this.handleAuth(response)));
  }

  private handleAuth(response: AuthResponse) {
    localStorage.setItem(this.tokenKey, response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.userSignal.set(response.user);
  }

  private loadUserFromStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.userSignal.set(JSON.parse(userStr));
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  currentUser() {
    return this.userSignal();
  }
}
