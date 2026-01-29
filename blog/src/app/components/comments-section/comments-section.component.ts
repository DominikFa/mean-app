import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'comments-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-section.component.html',
  styleUrl: './comments-section.component.scss'
})
export class CommentsSectionComponent implements OnInit {
  @Input() postId!: string;

  public comments: any[] = [];
  public newCommentText: string = '';

  constructor(
    private commentsService: CommentsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.refreshComments();
  }

  addComment() {
    if (!this.newCommentText.trim()) return;

    if (!this.authService.isLoggedIn()) {
      alert('Musisz być zalogowany, aby komentować.');
      return;
    }


    this.commentsService.addComment(this.postId, this.newCommentText).subscribe(
      () => {
        this.newCommentText = '';
        this.refreshComments();
      },
      (err) => {
        console.error('Błąd dodawania komentarza', err);
        alert('Nie udało się dodać komentarza.');
      }
    );
  }

  refreshComments() {
      if (!this.postId) return;
      this.commentsService.getCommentsByPostId(this.postId).subscribe(
        (res) => {
          this.comments = res;
        },
        (err) => console.error(err)
      );
  }

  deleteComment(commentId: string) {
    if(!confirm('Usunąć komentarz?')) return;

    this.commentsService.deleteComment(commentId).subscribe(
      () => this.refreshComments(),
      (err) => alert('Błąd usuwania komentarza')
    );
  }

  isAuthor(commentUserId: any): boolean {
    const currentUser = this.authService.currentUser;
    if (!currentUser) return false;

    return commentUserId._id === currentUser.userId;
  }

  isLoggedIn(): boolean {
      return this.authService.isLoggedIn();
  }
}
