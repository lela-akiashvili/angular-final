import { Component, Input } from '@angular/core';
import { News } from '../../../types/news';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  template: ` <div class="carousel">
    @for (item of items; track $index) {
      <div
        class="carousel-item"
        [class]="{ active: $index === currentIndex }"
        [style]="{ 'background-image': 'url(' + item.src + ')' }"
      >
        <h1>{{ item.title }}</h1>
      </div>
    }
    <button class="carousel-control prev" (click)="prev()">&#10094;</button>
    <button class="carousel-control next" (click)="next()">&#10095;</button>
  </div>`,
  styles: `
    .carousel {
      position: relative;
      width: 100%;
      height: 50vh;
      margin: 7rem auto 0 auto;
      padding: 0 1rem;
      overflow: hidden;
    }
    .carousel-item {
      border-radius: 10px;
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      color: white;
      text-transform: capitalize;
      padding: 0 1rem;
    }
    .carousel-item.active {
      display: flex;
      position: relative;
      opacity: 1;
      align-items: flex-end;
      box-shadow: inset 0 -40px 50px rgb(11, 11, 11);
    }
    .carousel-control {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: red;
      color: white;
      border: none;
      padding: 10px;
      cursor: pointer;
      z-index: 1;
    }
    .carousel-control.prev {
      left: 16px;
    }
    .carousel-control.next {
      right: 16px;
    }
    h1 {
      -webkit-text-stroke: 1.5px black;
    }
    @media (min-width: 800px) {
      h1 {
        font-size: 2rem;
      }
    }
  `,
})
export class CarouselComponent {
  @Input() items: News[] = [];
  currentIndex = 0;
  prev() {
    this.currentIndex =
      this.currentIndex > 0 ? this.currentIndex - 1 : this.items.length - 1;
    console.log('hi');
  }
  next() {
    this.currentIndex =
      this.currentIndex < this.items.length - 1 ? this.currentIndex + 1 : 0;
  }
}
