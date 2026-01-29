import { Component, OnInit, ViewChild} from '@angular/core';
import { SearchBarComponent } from '../../shared/search-bar/search-bar';
import { BlogComponent } from "../blog/blog.component";
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component"
import { AddPostComponent } from "../add-post/add-post.component";

@Component({
 selector: 'app-blog-home',
 standalone: true,
 imports: [SearchBarComponent, BlogComponent, ThemeToggleComponent, AddPostComponent],
 templateUrl: './blog-home.component.html',
 styleUrl: './blog-home.component.scss'
})
export class BlogHomeComponent implements OnInit {
 @ViewChild(BlogComponent) blogComponent!: BlogComponent;

 public filterText: string = '';

 constructor() { }

 ngOnInit(): void { }

 getName($event: string): void {
   this.filterText = $event;
 }

 refreshPosts(): void {
   this.blogComponent.getAll();
 }
}
