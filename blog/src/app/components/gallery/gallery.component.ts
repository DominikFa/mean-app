import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  public images: string[] = [];
  public selectedImage: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getAll().subscribe((posts: any) => {
      this.images = posts.map((post: any) => post.image).filter((img: string) => img !== '');
    });
  }

  openLightbox(imgUrl: string) {
    this.selectedImage = imgUrl;
  }

  closeLightbox() {
    this.selectedImage = null;
  }
}
