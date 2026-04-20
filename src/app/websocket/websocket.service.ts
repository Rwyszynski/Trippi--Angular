import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({ providedIn: 'root' })
export class WebsocketService {

  private client!: Client;
  private messageHandler?: (msg: any) => void;

  connect() {
    if (this.client) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/messages', message => {
        this.messageHandler?.(JSON.parse(message.body));
      });
    };

    this.client.activate();
  }

  onMessage(handler: (msg: any) => void) {
    this.messageHandler = handler;
  }

  send(message: string) {
    this.client.publish({
      destination: '/app/chat',
      body: message
    });
  }
}
