import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PostService, Post } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-post-list',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    template: `
    <div class="space-y-6">
      
      <!-- Create Post Form -->
      @if (auth.currentUser()) {
        <div class="bg-white p-4 rounded-lg shadow">
           <form [formGroup]="postForm" (ngSubmit)="createPost()" class="space-y-3">
             <input type="text" formControlName="title" placeholder="Título da publicação" class="w-full p-2 border rounded-md">
             <textarea formControlName="content" rows="3" placeholder="Conteúdo (Markdown suportado)" class="w-full p-2 border rounded-md text-sm"></textarea>
             <div class="flex justify-end">
               <button type="submit" [disabled]="postForm.invalid" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Publicar</button>
             </div>
           </form>
        </div>
      }

      <!-- Feed -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        @for (post of posts; track post.id) {
          <div class="p-4 border-b last:border-b-0 hover:bg-gray-50 transition">
             <div class="flex items-center gap-2 text-xs text-gray-500 mb-1">
               <span class="bg-gray-200 px-1 rounded">{{ post.tabcoins }} tabcoins</span>
               <span>· {{ post.username }}</span>
               <span>· {{ post.created_at | date }}</span>
             </div>
             <a [routerLink]="['/post', post.id]" class="text-lg font-medium text-gray-900 hover:text-blue-600 block">
               {{ post.title }}
             </a>
          </div>
        } @empty {
          <div class="p-8 text-center text-gray-500">
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

    createPost() {
        if (this.postForm.valid) {
            this.postService.createPost(this.postForm.value as any).subscribe(() => {
                this.postForm.reset();
                this.loadPosts();
            });
        }
    }
}
