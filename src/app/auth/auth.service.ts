import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {UsersResponse} from '../models/user.model';

const BASE = 'https://trippi-api.robertointerwento.workers.dev';
const NGROK_HEADER = { 'ngrok-skip-browser-warning': 'true' };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = `${BASE}/auth/v1/auth`;
  private TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  private headers(withAuth = false) {
    const h: any = { ...NGROK_HEADER };
    if (withAuth) h['Authorization'] = 'Bearer ' + this.getToken();
    return h;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/token`, { email, password }, { headers: this.headers() });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/register`, { email, password }, { headers: this.headers() });
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getAllUsers() {
    const myId = this.getMyId();
    return this.http.get<any>(`${BASE}/users/v1/users/all`, {
      headers: this.headers(true)
    }).pipe(
      map((res: any) => ({
        ...res,
        users: res.users.filter((u: any) => u.id !== myId)
      }))
    );
  }

  getUsers() {
    return this.http.get<UsersResponse>(`${BASE}/auth/v1/users/all`, { headers: this.headers() });
  }

  getMyId(): number {
    const token = this.getToken();
    if (!token) return 0;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Number(payload.sub);
  }

  getConversation(userId: number): Observable<any> {
    return this.http.get(`${BASE}/chat/v1/messages/conversations/get/${userId}/`, {
      headers: this.headers(true)
    });
  }

  sendMessage(text: string, receiverId: number): Observable<any> {
    return this.http.post(`${BASE}/chat/v1/messages/`, {
      messageText: text,
      receiverId: receiverId
    }, { headers: this.headers(true) });
  }

  updateProfile(data: { country: string, gender: string, age: number | null }): Observable<any> {
    return this.http.patch(`${BASE}/users/v1/users/profile`, data, { headers: this.headers(true) });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${BASE}/users/v1/users/${id}`, { headers: this.headers(true) });
  }
}
