import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from "../../services/data.service";
import { BlogItemComponent } from "../blog-item/blog-item.component";
import { FilterTextPipe } from "../../pipes/filter-text-pipe";
import { PaginatePipe } from "../../pipes/paginate.pipe";
import { PaginationComponent } from "../../shared/pagination/pagination.component";

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    BlogItemComponent,
    CommonModule,
    FilterTextPipe,
    PaginatePipe,
    PaginationComponent
  ],
  providers: [DataService],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {

 @Input() filterText: string = '';

 public items$: any[] = [];
 public currentPage: number = 1;
 public itemsPerPage: number = 6;

 constructor(
   private service: DataService,
   private route: ActivatedRoute,
   private router: Router
 ) {}

 ngOnInit() {
   this.route.queryParams.subscribe(params => {
     this.currentPage = params['page'] ? +params['page'] : 1;
   });
   this.getAll();
 }

 getAll(){
   this.service.getAll().subscribe((response: any) => {
     this.items$ = response;
   });
 }

 onPageChange(page: number): void {
   this.currentPage = page;
   this.router.navigate([], {
     relativeTo: this.route,
     queryParams: { page: page },
     queryParamsHandling: 'merge'
   });
   window.scrollTo(0, 0);
 }
}
