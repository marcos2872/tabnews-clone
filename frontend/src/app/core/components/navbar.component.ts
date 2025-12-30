import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <a routerLink="/" class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <div class="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center text-white dark:text-black text-lg">Tn</div>
          TabNews
        </a>

        <div class="flex items-center gap-4">
          <button (click)="themeService.toggle()" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition">
             <!-- Sun/Moon Icon based on state -->
             <svg *ngIf="themeService.isDark()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
             </svg>
             <svg *ngIf="!themeService.isDark()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
             </svg>
          </button>

          <nav class="flex items-center gap-4">
            @if (authService.currentUser()) {
               <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ authService.currentUser()?.username }}
               </span>
               <button (click)="authService.logout()" 
                       class="text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-md transition">
                 Logout
               </button>
            } @else {
               <a routerLink="/login" 
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition">
                 Login
               </a>
               <a routerLink="/register" 
                  class="text-sm font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-4 py-2 rounded-md transition">
                 Cadastro
               </a>
            }
          </nav>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
}
