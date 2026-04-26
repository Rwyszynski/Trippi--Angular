import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import {WebsocketService} from '../../websocket/websocket.service';
import {Observable} from 'rxjs';

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
        console.log('users response:', res);
        this.users = res.users;
      },
      error: (err) => console.error(err)
    });
  }

  selectUser(user: any) {
    console.log('selectUser called, user:', user);
    this.selectedUser = user;
    this.messages = [];
    this.auth.getConversation(user.id).subscribe({
      next: (res: any) => {
        console.log('conversation response:', res);
        this.messages = res.messages.map((m: any) => ({
          text: m.messageText,
          me: m.senderId === this.auth.getMyId()
        }));
      },
      error: (err: any) => console.error(err)
    });
  }

  send() {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    this.auth.sendMessage(this.newMessage, this.selectedUser.id).subscribe({
      next: () => {
        this.messages.push({ text: this.newMessage, me: true });
        this.newMessage = '';
      },
      error: (err: any) => console.error(err)
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.ws.disconnect();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  hoveredUser: any = null;

  loadUserInfo(user: any) {
    this.auth.getUserById(user.id).subscribe({
      next: (res: any) => { this.hoveredUser = res; },
      error: () => { this.hoveredUser = user; }
    });
  }

}
