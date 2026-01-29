import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogItemImageComponent } from "../blog-item-image/blog-item-image.component";
import { BlogItemTextComponent } from "../blog-item-text/blog-item-text.component";
import { FavoritesService } from '../../services/favorites.service';
import { RatingComponent } from '../../shared/rating/rating.component';
import { LikeComponent } from '../like/like.component';

@Component({
  selector: 'blog-item',
  standalone: true,
  imports: [
    CommonModule,
    BlogItemImageComponent,
    BlogItemTextComponent,
    RatingComponent,
    LikeComponent
  ],
  templateUrl: './blog-item.component.html',
  styleUrl: './blog-item.component.scss'
})
export class BlogItemComponent {
  @Input() image?: string;
  @Input() text?: string;
  @Input() title?: string;
  @Input() _id!: string;
  @Input() likes: string[] = [];
  @Input() authorId!: string;

  private favoritesService = inject(FavoritesService);

  get isFavorite(): boolean {
    return this.favoritesService.isFavorite(this._id);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this._id);
  }
}
