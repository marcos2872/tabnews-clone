import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PostService, Post } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { marked } from 'marked';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Create Post Form -->
      @if (auth.currentUser()) {
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
           <div class="flex gap-2 mb-4 border-b dark:border-gray-700">
             <button type="button" (click)="isPreview = false" 
                     [class.border-b-2]="!isPreview" [class.border-blue-600]="!isPreview"
                     [class.text-blue-600]="!isPreview"
                     class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
               Escrever
             </button>
             <button type="button" (click)="togglePreview()" 
                     [class.border-b-2]="isPreview" [class.border-blue-600]="isPreview"
                     [class.text-blue-600]="isPreview"
                     class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
               Preview
             </button>
           </div>

           <form [formGroup]="postForm" (ngSubmit)="createPost()" class="space-y-3">
             <div [class.hidden]="isPreview">
                <input type="text" formControlName="title" placeholder="Título da publicação" 
                       class="w-full p-2 border rounded-md mb-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                <textarea formControlName="content" rows="6" placeholder="Conteúdo (Markdown suportado)" 
                          class="w-full p-2 border rounded-md text-sm font-mono bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"></textarea>
             </div>

             <div *ngIf="isPreview" class="min-h-[150px] p-4 border rounded-md bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 prose dark:prose-invert max-w-none">
                <h3 *ngIf="postForm.value.title" class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ postForm.value.title }}</h3>
                <div [innerHTML]="previewContent"></div>
             </div>

             <div class="flex justify-end pt-2">
               <button type="submit" [disabled]="postForm.invalid" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50">Publicar</button>
             </div>
           </form>
        </div>
      }

      <!-- Feed -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors">
        @for (post of posts; track post.id) {
          <div class="p-4 border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
             <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
               <span class="bg-gray-200 dark:bg-gray-700 px-1 rounded text-gray-700 dark:text-gray-300">{{ post.tabcoins }} tabcoins</span>
               <span>· {{ post.username }}</span>
               <span>· {{ post.created_at | date }}</span>
             </div>
             <a [routerLink]="['/post', post.id]" class="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 block">
               {{ post.title }}
             </a>
          </div>
        } @empty {
          <div class="p-8 text-center text-gray-500 dark:text-gray-400">
            Nenhuma publicação encontrada.
          </div>
        }
      </div>
    </div>
  `
})
export class PostListComponent implements OnInit {
  postService = inject(PostService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);

  posts: Post[] = [];
  isPreview = false;
  previewContent = '';

  postForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  async togglePreview() {
    this.isPreview = true;
    const content = this.postForm.value.content || '';
    this.previewContent = await marked.parse(content);
  }

  createPost() {
    if (this.postForm.valid) {
      this.postService.createPost(this.postForm.value as any).subscribe(() => {
        this.postForm.reset();
        this.isPreview = false;
        this.loadPosts();
      });
    }
  }
}
