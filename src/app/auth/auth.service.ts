import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {UsersResponse} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = '/api/auth/v1/auth';
  private TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/token`, { email, password });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/register`, { email, password });
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
    const token = this.getToken();
    const myId = this.getMyId();
    return this.http.get<any>('/api/users/v1/users/all', {
      headers: { Authorization: 'Bearer ' + token }
    }).pipe(
      map((res: any) => ({
        ...res,
        users: res.users.filter((u: any) => u.id !== myId)
      }))
    );
  }

  getUsers() {
    return this.http.get<UsersResponse>('/api/auth/v1/users/all');
  }

  getMyId(): number {
    const token = this.getToken();
    if (!token) return 0;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Number(payload.sub);
  }

  getConversation(userId: number): Observable<any> {
    return this.http.get(`/api/chat/v1/messages/conversations/get/${userId}/`, {
      headers: { Authorization: 'Bearer ' + this.getToken() }
    });
  }

  sendMessage(text: string, receiverId: number): Observable<any> {
    const token = this.getToken();
    return this.http.post('/api/chat/v1/messages/', {
      messageText: text,
      receiverId: receiverId
    }, {
      headers: { Authorization: 'Bearer ' + token }
    });
  }

  updateProfile(data: { country: string, gender: string, age: number | null }): Observable<any> {
    const token = this.getToken();
    return this.http.patch('/api/users/v1/users/profile', data, {
      headers: { Authorization: 'Bearer ' + token }
    });
  }

  getUserById(id: number): Observable<any> {
    const token = this.getToken();
    return this.http.get(`/api/users/v1/users/${id}`, {
      headers: { Authorization: 'Bearer ' + token }
    });
  }
}
