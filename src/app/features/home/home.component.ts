import { Component, OnInit, inject } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';
import { map } from 'rxjs';
import { NewsFirebaseService } from '../../shared/services/NewsFirebase.service';
import { RouterLink } from '@angular/router';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { News } from '../../types/news';
import { GamesFirebaseService } from '../../shared/services/gamesFirebase.service';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProfileComponent,
    NewsCardComponent,
    CarouselComponent,
    RouterLink,
    AsyncPipe,
  ],
  template: `
    <section>
      <div>
        @if(newsCarousel$ | async; as newsCarousel) {
          <app-carousel [items]="newsCarousel"></app-carousel>
        }
        <app-news-card></app-news-card>
      </div>

      <aside>
        <h2>Upcoming Matches</h2>
        <div class="game-container">
          @if (gamesArr$ | async; as gamesArr) {
            @for (game of gamesArr; track game) {
              <div class="game">
                <div class="team">
                  <img [src]="game.src1" alt="" />
                  <h3>{{ game.team1 }}</h3>
                </div>
                <span>VS</span>
                <div class="team">
                  <img [src]="game.src2" alt="" />
                  <h3>{{ game.team2 }}</h3>
                </div>
              </div>
            }
          }
        </div>
        <a routerLink="/tickets">more</a>
      </aside>
    </section>
  `,
  styles: `
    section {
      margin-top: 7rem;
      min-height: 100vh;
      max-width: 100vw;
    }
    h2,
    h3,
    a {
      text-align: center;
      color: black;
    }
    img {
      min-width: 5vw;
      border-radius: 50%;
    }
    .game {
      display: flex;
      align-items: center;
      border-top: 1px solid red;
      padding-top: 1rem;
    }
    .team {
    }
    .game-container {
      margin: auto;
      max-width: fit-content;
      text-align: center;
    }

    @media (max-width: 799px) {
      aside {
        padding: 0 1rem;
        background-color: rgb(235, 235, 235);
        margin: 1rem;
      }
      img {
        max-width: 30vw;
      }
    }

    @media (min-width: 800px) {
      section {
        padding: 1rem 2.5rem;
        display: flex;
      }
      aside {
        float: right;
        margin: 7rem 2rem 0 3rem;
        min-width: fit-content;
      }
      .team {
        max-width: fit-content;
      }
      img {
        width: 5vw;
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
export class HomeComponent {
  private newsFirebase = inject(NewsFirebaseService);
  private gamesFirebase = inject(GamesFirebaseService);

  // ასე უფრო *დეკლარაციულია*
  gamesArr$ = this.gamesFirebase
    .getGames()
    .pipe(map((news) => news.slice(0, 4)));

  newsCarousel$ = this.newsFirebase
    .getNews()
    .pipe(map((news: News[]) => news.slice(0, 4)));

}
