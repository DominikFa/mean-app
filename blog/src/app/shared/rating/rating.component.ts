import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent implements OnInit {
  @Input() postId!: string;
  @Input() readonly: boolean = false;

  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0;

  ratingService = inject(RatingService);

  private ratingSum: number = 0;
  public votesCount: number = 0;

  get currentRating(): number {
    return this.votesCount === 0 ? 0 : Math.round(this.ratingSum / this.votesCount);
  }

  get averageRating(): number {
    return this.votesCount === 0 ? 0 : this.ratingSum / this.votesCount;
  }

  ngOnInit() {
    this.refreshRating();
  }

  refreshRating() {
    const data = this.ratingService.getRating(this.postId);
    this.ratingSum = data.sum;
    this.votesCount = data.count;
  }

  onStarHover(rating: number): void {
    if (!this.readonly) this.hoverRating = rating;
  }

  onStarClick(rating: number): void {
    if (!this.readonly) {
      this.ratingService.addRating(this.postId, rating);
      this.refreshRating();
    }
  }
}
