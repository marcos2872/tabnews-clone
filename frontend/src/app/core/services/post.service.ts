import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
    id: string;
    title?: string;
    content: string;
    username: string; // From join
    user_id: string;
    parent_id?: string;
    tabcoins: number;
    created_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = 'http://localhost:3000/api/posts';

    constructor(private http: HttpClient) { }

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(this.apiUrl);
    }

    getPost(id: string): Observable<Post> {
        return this.http.get<Post>(`${this.apiUrl}/${id}`);
    }

    createPost(post: { title?: string, content: string, parent_id?: string }): Observable<Post> {
        return this.http.post<Post>(this.apiUrl, post);
    }

    vote(id: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/vote`, {});
    }
}
