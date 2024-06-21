import { Component, OnInit, inject } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';
import { NewsFirebaseService } from '../../shared/services/NewsFirebase.service';
import { News } from '../../types/news';
import { map, take } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProfileComponent, NewsCardComponent],
  template: `
    <section>
      <app-news-card></app-news-card>
    </section>
  `,
  styles: `
    section {
      min-height: 100vh;
      // padding: 20px 5px 0 5px;
    }
    @media (min-width: 800px) {
      section {
        padding: 1rem 2.5rem;
      }
    }

    @media (min-width: 1400px) {
      section {
        max-width: 85vw;
        margin: auto;
      }
    }
  `,
})
export class HomeComponent implements OnInit {
  private newsFirebase = inject(NewsFirebaseService);
  newsCarousel: News[] = [];
  ngOnInit(): void {
    this.newsFirebase.getNews().pipe(map((news: News[]) => news.slice(0, 4))).subscribe((news)=>{
      this.newsCarousel = news;
      console.log(this.newsCarousel)
    });
  }
}
