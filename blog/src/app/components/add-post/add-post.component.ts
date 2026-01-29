import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'add-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss'
})
export class AddPostComponent {
  public title: string = '';
  public text: string = '';
  public imageUrl: string = '';

  constructor(private dataService: DataService) {}

  createPost() {
    if (this.title && this.text) {
      const postObject = {
        title: this.title,
        text: this.text,
        image: this.imageUrl || 'https://via.placeholder.com/150'
      };


      this.dataService.addPost(postObject).subscribe(
        (res) => {
          this.resetForm();
          alert('Post dodany');
        },
        (err) => {
          console.error('Błąd podczas dodawania', err);
        }
      );

    } else {
      alert('Wypełnij tytuł i treść!');
    }
  }


  private resetForm() {
    this.title = '';
    this.text = '';
    this.imageUrl = '';
  }
}
