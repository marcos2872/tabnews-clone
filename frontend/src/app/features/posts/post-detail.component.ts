import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService, Post } from '../../core/services/post.service';

@Component({
    selector: 'app-post-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (post) {
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="mb-4">
           <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ post.title }}</h1>
           <div class="text-sm text-gray-500 flex items-center gap-2">
             <span class="font-bold text-gray-700">{{ post.username }}</span>
             <span>· {{ post.created_at | date:'medium' }}</span>
           </div>
        </div>

        <div class="prose max-w-none border-t pt-4">
           <!-- Ideally use a Markdown pipe here, for MVP just displaying text -->
           <pre class="whitespace-pre-wrap font-sans text-gray-800">{{ post.content }}</pre>
        </div>

        <div class="mt-6 flex items-center gap-4 border-t pt-4">
           <button (click)="vote()" class="flex items-center gap-1 text-gray-600 hover:text-blue-600">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
             </svg>
             <span>{{ post.tabcoins }} TabCoins</span>
           </button>
        </div>
      </div>
    } @else {
      <div class="p-8 text-center">Carregando...</div>
    }
  `
})
export class PostDetailComponent implements OnInit {
    route = inject(ActivatedRoute);
    postService = inject(PostService);
    post: Post | null = null;

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadPost(id);
        }
    }

    loadPost(id: string) {
        this.postService.getPost(id).subscribe(p => this.post = p);
    }

    vote() {
        if (this.post) {
            this.postService.vote(this.post.id).subscribe(() => {
                if (this.post) this.post.tabcoins++;
            });
        }
    }
}
