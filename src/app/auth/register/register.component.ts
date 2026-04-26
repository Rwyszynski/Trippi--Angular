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

  successMessage = '';
  errorMessage = '';

  register() {
    this.errorMessage = '';

    if (!this.email || !this.email.includes('@')) {
      this.errorMessage = 'Podaj poprawny email';
      return;
    }
    if (!this.password || this.password.length < 5) {
      this.errorMessage = 'Hasło musi mieć co najmniej 5 znaków';
      return;
    }

    this.auth.register(this.email, this.password).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.successMessage = 'Rejestracja zakończona pomyślnie! Możesz się zalogować.';
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = 'Użytkownik z tym emailem już istnieje.';
        } else {
          this.errorMessage = 'Rejestracja nie powiodła się. Spróbuj ponownie.';
        }
      }
    });
  }
}
