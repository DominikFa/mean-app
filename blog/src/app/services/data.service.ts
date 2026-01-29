import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
 providedIn: 'root'
})
export class DataService {

 private url = 'http://localhost:3100';

 constructor(private http: HttpClient) {
 }

 getAll() {
   return this.http.get(this.url + '/api/posts');
 }

 addPost(post: any) {
   return this.http.post(this.url + '/api/post', post);
 }

  getById(id: string, incrementViews: boolean) {

   return this.http.get(this.url + '/api/post/' + id+'?incrementViews='+incrementViews.toString());
  }

 updatePost(id: string, post: any) {
   return this.http.put(this.url + '/api/post/' + id, post);
 }

 deletePost(id: string) {
   return this.http.delete(this.url + '/api/post/' + id);
 }

}
