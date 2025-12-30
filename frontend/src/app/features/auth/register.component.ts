import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mt-10 transition-colors">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Cadastro</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input type="text" formControlName="username" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>
         <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input type="email" formControlName="email" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
          <input type="password" formControlName="password" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>

        <div *ngIf="error" class="text-red-500 text-sm">{{ error }}</div>

        <button type="submit" [disabled]="registerForm.invalid" 
                class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50">
          Criar conta
        </button>
      </form>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  error = '';

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm.value).subscribe({
        error: (err) => this.error = 'Erro ao cadastrar. Tente novamente.'
      });
    }
  }
}
