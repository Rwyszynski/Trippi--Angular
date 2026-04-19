import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private client!: Client;

  connect() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/messages', msg => {
        console.log(msg.body);
      });
    };

    this.client.activate();
  }

  send(msg: string) {
    this.client.publish({
      destination: '/app/chat',
      body: msg
    });
  }
}
