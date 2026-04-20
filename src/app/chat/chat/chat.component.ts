import { Component } from '@angular/core';
import {ChatService} from '../chat.service';
import {WebsocketService} from '../../websocket/websocket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html'
})
export class ChatComponent {

  users: any[] = [];
  messages: any[] = [];
  message = '';
  selectedUser: any;

  constructor(
    private chat: ChatService,
    private ws: WebsocketService
  ) {}

  ngOnInit() {
    this.ws.connect();

    this.ws.onMessage((msg: any) => {
      this.messages.push(msg);
    });
  }

  send() {
    this.ws.send(this.message);
    this.message = '';
  }

  selectUser(u: any) {
    this.selectedUser = u;

    this.chat.getConversation(u.id)
      .subscribe((res: any) => {
        this.messages = res.messages ?? res;
      });
  }
}
