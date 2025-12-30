import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
    username: string;
    token: string;
    id: string; // Add ID for ownership checks
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';

    // Using Signals for state management
    currentUser: WritableSignal<User | null> = signal(this.getUserFromStorage());

    constructor(private http: HttpClient, private router: Router) { }

    private getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    register(data: any): Observable<any> {
        return this.http.post<User>(`${this.apiUrl}/register`, data).pipe(
            tap(user => {
                this.setSession(user);
            })
        );
    }

    login(data: any): Observable<any> {
        return this.http.post<User>(`${this.apiUrl}/login`, data).pipe(
            tap(user => {
                this.setSession(user);
            })
        );
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    private setSession(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
        this.router.navigate(['/']);
    }

    isAuthenticated(): boolean {
        return !!this.currentUser();
    }
}
