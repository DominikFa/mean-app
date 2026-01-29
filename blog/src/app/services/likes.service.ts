import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private url = 'http://localhost:3100/api/post';

  constructor(private http: HttpClient) {}

  toggleLike(postId: string): Observable<string[]> {
    return this.http.post<string[]>(`${this.url}/like/${postId}`, {});
  }

  getLikes(postId: string): Observable<string[]> {
      return this.http.get<string[]>(`${this.url}/likes/${postId}`);
  }
}
