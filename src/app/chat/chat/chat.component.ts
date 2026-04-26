import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import {WebsocketService} from '../../websocket/websocket.service';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  constructor(
    private auth: AuthService,
    private router: Router,
    private ws: WebsocketService
  ) {}

  users: any[] = [];
  messages: any[] = [];
  selectedUser: any = null;
  newMessage = '';

  ngOnInit() {
    this.loadUsers();
    this.ws.connect();
    this.ws.messages$.subscribe(msg => {
      this.messages.push({ text: msg, me: false });
    });
  }

  loadUsers() {
    this.auth.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.users;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.messages = [];
  }

  send() {
    if (!this.newMessage.trim()) return;
    this.ws.send(this.newMessage);
    this.messages.push({ text: this.newMessage, me: true });
    this.newMessage = '';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.ws.disconnect();
  }
}
