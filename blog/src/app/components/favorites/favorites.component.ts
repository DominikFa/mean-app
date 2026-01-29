import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { FavoritesService } from '../../services/favorites.service';
import { BlogItemComponent } from '../blog-item/blog-item.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, BlogItemComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private dataService = inject(DataService);
  private favoritesService = inject(FavoritesService);

  favoriteItems: any[] = [];

  ngOnInit() {
    this.dataService.getAll().subscribe((posts: any) => {
      const favIds = this.favoritesService.getFavorites();
      this.favoriteItems = posts.filter((post: any) => favIds.includes(post._id));
    });
  }
}
