import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService, Post } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { marked } from 'marked';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (post) {
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
        
        <!-- View Mode -->
        <div *ngIf="!isEditing">
            <div class="mb-4">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ post.title }}</h1>
            <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span class="font-bold text-gray-700 dark:text-gray-300">{{ post.username }}</span>
                <span>· {{ post.created_at | date:'medium' }}</span>
                
                @if (isOwner()) {
                    <span class="mx-2">|</span>
                    <button (click)="startEdit()" class="text-blue-600 hover:underline dark:text-blue-400">Editar</button>
                    <button (click)="deletePost()" class="text-red-600 hover:underline dark:text-red-400">Deletar</button>
                }
            </div>
            </div>

            <div class="prose dark:prose-invert max-w-none border-t dark:border-gray-700 pt-4" [innerHTML]="renderedContent"></div>
            
            <div class="mt-6 flex items-center gap-4 border-t dark:border-gray-700 pt-4">
            <button (click)="vote()" class="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span>{{ post.tabcoins }} TabCoins</span>
            </button>
            </div>
        </div>

        <!-- Edit Mode -->
        <div *ngIf="isEditing">
           <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Editar Publicação</h2>
           
           <div class="flex gap-2 mb-4 border-b dark:border-gray-700">
             <button type="button" (click)="isPreviewEdit = false" 
                     [class.border-b-2]="!isPreviewEdit" [class.border-blue-600]="!isPreviewEdit"
                     [class.text-blue-600]="!isPreviewEdit"
                     class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
               Escrever
             </button>
             <button type="button" (click)="toggleEditPreview()" 
                     [class.border-b-2]="isPreviewEdit" [class.border-blue-600]="isPreviewEdit"
                     [class.text-blue-600]="isPreviewEdit"
                     class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
               Preview
             </button>
           </div>

           <form [formGroup]="editForm" (ngSubmit)="saveEdit()" class="space-y-4">
             <div [class.hidden]="isPreviewEdit">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                    <input formControlName="title" class="w-full p-2 border rounded-md bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo</label>
                    <textarea formControlName="content" rows="6" class="w-full p-2 border rounded-md font-mono bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"></textarea>
                </div>
             </div>

             <div *ngIf="isPreviewEdit" class="min-h-[150px] p-4 border rounded-md bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 prose dark:prose-invert max-w-none">
                <h3 *ngIf="editForm.value.title" class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ editForm.value.title }}</h3>
                <div [innerHTML]="previewEditContent"></div>
             </div>

             <div class="flex justify-end gap-2">
                 <button type="button" (click)="cancelEdit()" class="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600">Cancelar</button>
                 <button type="submit" [disabled]="editForm.invalid" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">Salvar</button>
             </div>
           </form>
        </div>

      </div>
    } @else {
      <div class="p-8 text-center text-gray-500 dark:text-gray-400">Carregando...</div>
    }
  `
})
export class PostDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  postService = inject(PostService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  post: Post | null = null;
  renderedContent = '';
  isEditing = false;
  isPreviewEdit = false;
  previewEditContent = '';

  editForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
    }
  }

  loadPost(id: string) {
    this.postService.getPost(id).subscribe(async p => {
      this.post = p;
      this.renderedContent = await marked.parse(p.content);
    });
  }

  isOwner(): boolean {
    const currentUser = this.authService.currentUser();
    return !!(this.post && currentUser && this.post.user_id === currentUser.id);
  }

  startEdit() {
    if (this.post) {
      this.editForm.patchValue({
        title: this.post.title || '',
        content: this.post.content
      });
      this.isEditing = true;
      this.isPreviewEdit = false;
    }
  }

  async toggleEditPreview() {
    this.isPreviewEdit = true;
    const content = this.editForm.value.content || '';
    this.previewEditContent = await marked.parse(content);
  }

  cancelEdit() {
    this.isEditing = false;
    this.isPreviewEdit = false;
  }

  saveEdit() {
    if (this.editForm.valid && this.post) {
      this.postService.updatePost(this.post.id, this.editForm.value as any).subscribe(async updated => {
        this.post = updated;
        this.renderedContent = await marked.parse(updated.content);
        this.isEditing = false;
      });
    }
  }

  deletePost() {
    if (this.post && confirm('Tem certeza que deseja deletar esta publicação?')) {
      this.postService.deletePost(this.post.id).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  vote() {
    if (this.post) {
      this.postService.vote(this.post.id).subscribe(() => {
        if (this.post) this.post.tabcoins++;
      });
    }
  }
}
