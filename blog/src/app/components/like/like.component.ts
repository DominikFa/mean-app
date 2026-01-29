import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LikesService } from '../../services/likes.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-like',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './like.component.html',
  styleUrl: './like.component.scss'
})

export class LikeComponent implements OnInit {
  @Input() postId!: string;
  @Input() likes: string[] = [];
  @Input() authorId!: string;

  private currentUserId: string | null = null;
  public errorMessage: string = '';

  constructor(
    private likesService: LikesService,
    private authService: AuthService
  ){}


  ngOnInit() {
    this.currentUserId = this.authService.currentUser.userId;

    if (this.postId) {
      this.fetchLikes();
    }
  }

  get isOwnPost(): boolean {
    if (!this.currentUserId || !this.authorId) return false;
    return this.currentUserId === this.authorId;

  }
  fetchLikes() {
    this.likesService.getLikes(this.postId).subscribe(
        (data) => this.likes = data,
        (err) => console.error('Nie udało się pobrać likeow', err)
    );
  }

  get isLiked(): boolean {
    if (!this.currentUserId || !this.likes) return false;
    return this.likes.includes(this.currentUserId);
  }

  get likesCount(): number {
    return this.likes ? this.likes.length : 0;
  }

  toggleLike(event: Event): void {
    event.stopPropagation();

    if (this.isOwnPost) {
      return;
    }

    this.likesService.toggleLike(this.postId).subscribe(
      (updatedLikes) => {
        this.likes = updatedLikes;
      },
      (err) => console.error('Błąd like:', err)
    );
  }
}
