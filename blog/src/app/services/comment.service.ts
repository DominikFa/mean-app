import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'http://localhost:3100/api/posts';

  constructor(private http: HttpClient) { }

  getCommentsByPostId(postId: string): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/${postId}/comments`);
  }

  addComment(postId: string, text: string): Observable<any> {

    return this.http.post(`${this.apiUrl}/${postId}/comments`, { text });
  }

  deleteComment(commentId: string): Observable<any> {

    return this.http.delete(`${this.apiUrl}/comments/${commentId}`);
  }
}
