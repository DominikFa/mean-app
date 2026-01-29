import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from "../../services/data.service";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CommentsSectionComponent} from '../comments-section/comments-section.component';

@Component({
 selector: 'app-blog-item-details',
 standalone: true,
 imports: [CommonModule, FormsModule, CommentsSectionComponent],
 providers: [DataService],
 templateUrl: './blog-item-details.component.html',
 styleUrl: './blog-item-details.component.scss'
})
export class BlogItemDetailsComponent implements OnInit {
 public image: string = '';
 public text: string = '';
 public title: string = '';
 public id: string = '';
 public views: number = 0;

 private revertData = {
   title: this.title,
   text: this.text,
   image: this.image
 };
 public isAuthor: boolean = false;
 public editMode: boolean = false;

 constructor(
   private service: DataService,
   private route: ActivatedRoute,
   private authService: AuthService,
   private router: Router
 ) {}


 ngOnInit() {
   this.route.paramMap.subscribe(params => {
     const id = params.get('id');
     if (!id) return;
     this.id = id;

     this.service.getById(id, true).subscribe((res: any) => {
       this.image = res.image;
       this.text = res.text;
       this.title = res.title;
       this.views = res.views;

       this.revertData.title = this.title;
       this.revertData.image = this.image;
       this.revertData.text = this.text;


       const currentUser = this.authService.currentUser;
       if (currentUser && res.userId === currentUser.userId) {
         this.isAuthor = true;
       }
     });
   });
 }


enableEdit() {
   this.editMode = !this.editMode;
 }

cancelEdit(){
  this.title = this.revertData.title;
  this.image = this.revertData.image;
  this.text = this.revertData.text;
  this.editMode = false;
}

  saveEdit() {
     const updatedData = {
      title: this.title,
      text: this.text,
      image: this.image
    };

    this.service.updatePost(this.id, updatedData).subscribe(
      (res) => {
        this.editMode = false;
      },
      (err) => {
        console.error('Błąd podczas edycji', err);
      }
    );
 }

  deletePost() {
    if(confirm('Czy na pewno chcesz usunąć ten post?')) {
      this.service.deletePost(this.id).subscribe(
        () => {
          this.router.navigate(['/blog']);
        },
        (err) => {
          console.error('Błąd podczas usuwania', err);
        }
      );
    }
  }
}
