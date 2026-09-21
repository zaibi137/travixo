import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: ''
})
export class LogoutComponent implements OnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Observable ko subscribe karna lazmi hai taake backend API hit ho
    this.auth.logout().subscribe({
      next: () => {
        void this.router.navigateByUrl('/login');
      },
      error: () => {
        // Agar backend error bhi de, tab bhi user ko login page par bhej dein
        void this.router.navigateByUrl('/login');
      }
    });
  }
}