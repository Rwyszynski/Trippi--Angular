import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    console.log('REGISTER CLICK');

    this.auth.register(this.email, this.password).subscribe({
      next: (res) => {
        console.log('SUCCESS', res);
      },
      error: (err) => {
        console.error('ERROR:', err);
      }
    });
  }
}
