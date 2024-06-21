import { Component, OnInit, inject, signal } from '@angular/core';
import { NewsFirebaseService } from '../../services/NewsFirebase.service';
import { News } from '../../../types/news';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersFirebaseService } from '../../services/UsersFirebase.service';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [RouterLink],
  template: `<div class="search">
      <input type="text" /> <button>Search</button>
    </div>
    <div class="card-container">
      @for (news of filteredNews; track news.id) {
        <div class="card">
          <img [src]="news.src" alt="" />
          <span>
            <h4>
              <a routerLink="/news-page/{{ news.id }}">{{ news.title }}</a>
            </h4>
            <h5 class="about">
              tags:
              @for (item of news.about; track $index) {
                <span>{{ item }}, </span>
              }
              <i
                class="bi bi-bookmark-heart"
                (click)="addToFavorites(news.id!)"
              ></i>
            </h5>
            <!-- <p>{{ news.text }}</p> -->
          </span>
        </div>
      }
    </div> `,
  styleUrl: `./news.component.css`,
})
export class NewsCardComponent implements OnInit {
  private newsFirebaseService = inject(NewsFirebaseService);
  private usersFirebaseService = inject(UsersFirebaseService);
  private auth = inject(AuthService);
  private activatedRouter = inject(ActivatedRoute);
  newsSig:News[]=[];
  filteredNews: News[] = [];
  ngOnInit(): void {
    this.newsFirebaseService.getNews().subscribe((news) => {
      this.newsSig = news;
      this.filterNews(this.activatedRouter.snapshot.queryParams['sport']);
    });
    this.activatedRouter.queryParams.subscribe((params) => {
      this.filterNews(params['sport']);
    });
  }
  addToFavorites(newsId: string): void {
    const userId = this.auth.getCurrentUserId();
    if (userId) {
      this.usersFirebaseService.addToFavorites(userId, newsId).subscribe({
        next: () => console.log('added to faves'),
        error: (error) => console.log(error),
      });
    } else {
      console.log('user not in my guy what did you expect', newsId);
    }
  }
  filterNews(sport?: string) {
    if (sport) {
      this.filteredNews = this.newsSig.filter((newsItem) =>
        newsItem.about?.includes(sport),
      );
      console.log('hi');
    } else {
      this.filteredNews = this.newsSig;
    }
  }
}
