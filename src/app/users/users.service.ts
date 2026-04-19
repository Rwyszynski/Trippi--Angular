import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private api = 'http://localhost:8080/v1/users';

  constructor(private http: HttpClient) {}

  search(query: string) {
    return this.http.get<any>(`${this.api}/search?query=${query}`);
  }
}
