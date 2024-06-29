import { Component, OnInit, inject } from '@angular/core';
import { NewsFirebaseService } from '../../services/NewsFirebase.service';
import { News } from '../../../types/news';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersFirebaseService } from '../../services/UsersFirebase.service';
import { AuthService } from '../../services/Auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="search-input">
      <input type="text" id="searchByInput" [(ngModel)]="search" />
      <button (click)="filterNews()">Search</button>
    </div>
    <form action="">
      <p><i class="bi bi-funnel"></i> filter</p>
      <div class="sort-div">
        <div>
          <label for="desc">Date <i class="bi bi-sort-down-alt"></i></label>
          <input type="radio" id="sortBy" name="SortBy" value="desc" (change)="sortNews('desc')" />
        </div>
        <div>
          <label for="asc">Date <i class="bi bi-sort-up"></i></label>
          <input type="radio" id="sortBy" name="SortBy" value="asc" (change)="sortNews('asc')" />
        </div>
      </div>
    </form>
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
            <h5>{{ news.date }}</h5>
          </span>
        </div>
      }
    </div>
  `,
  styleUrl: './news.component.css',
})
// NewsCards (მრავლობითში) უფრო სწორი იქნებოდა ამ ფაილისთვის.
export class NewsCardComponent implements OnInit {
  private newsFirebaseService = inject(NewsFirebaseService);
  private usersFirebaseService = inject(UsersFirebaseService);
  private auth = inject(AuthService);
  private activatedRouter = inject(ActivatedRoute);
  private router = inject(Router);

  newsSig: News[] = [];
  filteredNews: News[] = [];
  search: string = '';
  sortOrder: string = '';

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
    let filtered = this.newsSig;
    if (sport) {
      filtered = filtered.filter((newsItem) => newsItem.about?.includes(sport));
    }
    if (this.search) {
      const searchTerm = this.search.toLowerCase();
      filtered = filtered.filter((newsItem) =>
        newsItem.title?.toLowerCase().includes(searchTerm) ||
        newsItem.about?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    this.filteredNews = this.sortNewsArray(filtered);
  }

  filterBySearch(term: string) {
    this.search = term;
    this.filterNews();
  }

  sortNews(way: string) {
    this.sortOrder = way;
    this.filteredNews = this.sortNewsArray(this.filteredNews);
  }

  sortNewsArray(newsArray: News[]): News[] {
    return newsArray.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (this.sortOrder === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else if (this.sortOrder === 'desc') {
        return dateB.getTime() - dateA.getTime();
      }
      return 0;
    });
  }
}
