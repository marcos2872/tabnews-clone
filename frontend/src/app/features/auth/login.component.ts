import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" formControlName="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Senha</label>
          <input type="password" formControlName="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>
        
        <div *ngIf="error" class="text-red-500 text-sm">{{ error }}</div>

        <button type="submit" [disabled]="loginForm.invalid" 
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
          Entrar
        </button>
      </form>
    </div>
  `
})
export class LoginComponent {
    fb = inject(FormBuilder);
    auth = inject(AuthService);
    error = '';

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    onSubmit() {
        if (this.loginForm.valid) {
            this.auth.login(this.loginForm.value).subscribe({
                error: (err) => this.error = 'Login falhou. Verifique suas credenciais.'
            });
        }
    }
}
