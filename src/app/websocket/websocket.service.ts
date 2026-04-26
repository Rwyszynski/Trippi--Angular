import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private client!: Client;
  public messages$ = new Subject<string>();
  private connected = false;

  constructor(private auth: AuthService) {}

  connect() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://18.201.53.150:8080/ws'),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: 'Bearer ' + this.auth.getToken()
      }
    });

    this.client.onConnect = () => {
      this.connected = true;
      this.client.subscribe('/topic/messages', msg => {
        this.messages$.next(msg.body);
      });
    };

    this.client.activate();
  }

  send(msg: string) {
    if (!this.connected) return;
    this.client.publish({
      destination: '/app/chat',
      body: msg
    });
  }

  disconnect() {
    this.client?.deactivate();
  }
}
