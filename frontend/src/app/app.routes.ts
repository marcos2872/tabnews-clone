import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/posts/post-list.component').then(m => m.PostListComponent)
    },
    {
        path: 'post/:id',
        loadComponent: () => import('./features/posts/post-detail.component').then(m => m.PostDetailComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
    },
    { path: '**', redirectTo: '' }
];
