import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  country = '';
  gender = '';
  age: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // załaduj aktualne dane profilu
  }

  save() {
    this.auth.updateProfile({ country: this.country, gender: this.gender, age: this.age })
      .subscribe({
        next: () => { this.successMessage = 'Profil zaktualizowany!'; },
        error: () => { this.errorMessage = 'Błąd zapisu.'; }
      });
  }

  back() {
    this.router.navigate(['/chat']);
  }
}
