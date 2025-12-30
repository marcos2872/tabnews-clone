import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <a routerLink="/" class="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <div class="w-8 h-8 bg-black rounded flex items-center justify-center text-white text-lg">Tn</div>
          TabNews
        </a>

        <nav class="flex items-center gap-4">
          @if (authService.currentUser()) {
             <span class="text-sm font-medium text-gray-700">
                {{ authService.currentUser()?.username }}
             </span>
             <button (click)="authService.logout()" 
                     class="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition">
               Logout
             </button>
          } @else {
             <a routerLink="/login" 
                class="text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition">
               Login
             </a>
             <a routerLink="/register" 
                class="text-sm font-medium bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md transition">
               Cadastro
             </a>
          }
        </nav>
      </div>
    </header>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
}
