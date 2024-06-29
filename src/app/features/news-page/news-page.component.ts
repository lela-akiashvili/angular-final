import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsFirebaseService } from '../../shared/services/NewsFirebase.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [DatePipe, AsyncPipe],
  template: `<section>
    @if (newsPage$ | async; as newsPage) {
      <div class="all">
        <h4>
          Published:
          <span>
            {{ newsPage.date }}
          </span>
        </h4>
        <h4>
          Tags:
          @for (tag of newsPage.about; track $index) {
            <span> {{ tag }}</span
            >,
          }
        </h4>
        <img [src]="newsPage.src" alt="" />
        <div>
          <h1>{{ newsPage.title }}</h1>

          <p>{{ newsPage.text }}</p>
        </div>
      </div>
    }
  </section> `,
  styleUrl: './news-page.component.css',
})
export class NewsPageComponent {
  activatedRoutes = inject(ActivatedRoute);
  newsFierbaseService = inject(NewsFirebaseService);

  // სუბსქრაიბის შიგნით სუბქსრაიბი ხშირად იწვევს memory leak-ს, და ასე ამ ამბავს თავს ავარიდებთ.
  // ამასთანავე, ასე უფრო *დეკლარაციულია*
  newsPage$ = this.activatedRoutes.paramMap.pipe(
    switchMap((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        console.log(id);
        return this.newsFierbaseService.getNewsById(id);
      }
      return of(null);
    }),
  );
}
