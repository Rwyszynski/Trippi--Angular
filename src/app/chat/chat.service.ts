import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = 'http://localhost:8080/v1/messages';

  constructor(private http: HttpClient) {}

  sendMessage(text: string, receiverId: number) {
    return this.http.post(`${this.api}/`, {
      messageText: text,
      receiverId: receiverId
    });
  }

  getConversation(userId: number) {
    return this.http.get(`${this.api}/conversations/get/${userId}/`);
  }
}
