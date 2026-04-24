import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 TO JEST KLUCZ
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  users = [
    { id: 1, email: 'user1@test.com' },
    { id: 2, email: 'user2@test.com' }
  ];

  messages: any[] = [];
  selectedUser: any = null;
  newMessage = '';

  selectUser(user: any) {
    this.selectedUser = user;
    this.messages = [];
  }

  send() {
    if (!this.newMessage.trim()) return;

    this.messages.push({
      text: this.newMessage,
      me: true
    });

    this.newMessage = '';
  }
}
