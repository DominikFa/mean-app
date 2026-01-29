import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface RatingData {
  sum: number;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly STORAGE_KEY = 'blog_ratings';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Pobiera oceny dla wszystkich postów
  private getRatings(): Record<string, RatingData> {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    }
    return {};
  }

  getRating(postId: string): RatingData {
    const ratings = this.getRatings();
    return ratings[postId] || { sum: 0, count: 0 };
  }

  addRating(postId: string, rating: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const ratings = this.getRatings();
      if (!ratings[postId]) {
        ratings[postId] = { sum: 0, count: 0 };
      }
      ratings[postId].sum += rating;
      ratings[postId].count += 1;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ratings));
    }
  }
}
