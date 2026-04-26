import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UsersResponse} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://localhost:8081/v1/auth';
  private TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/token`, {
      email,
      password
    });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/register`, {
      email,
      password
    });
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
    return this.http.get<any>('http://localhost:8082/v1/users/all', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
  }

  getUsers() {
    return this.http.get<UsersResponse>('http://localhost:8081/v1/users/all');
  }
}
