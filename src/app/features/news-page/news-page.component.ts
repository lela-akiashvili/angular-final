import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsFirebaseService } from '../../shared/services/NewsFirebase.service';
import { News } from '../../types/news';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [DatePipe],
  template: `<section>
    @if (newsPage) {
      <img [src]="newsPage.src" alt="" />
      <h1>{{ newsPage.title }}</h1>
      <h3>
        tags:
        @for (tag of newsPage.about; track $index) {
          <span> {{ tag }}</span
          >,
        }
      </h3>
      <p>{{ newsPage.text }}</p>
    }
  </section> `,
  styleUrl: './news-page.component.css',
})
export class NewsPageComponent implements OnInit {
  activatedRoutes = inject(ActivatedRoute);
  newsFierbaseService = inject(NewsFirebaseService);
  newsPage: News | null = null;
  ngOnInit(): void {
    // this.activatedRoutes.paramMap.subscribe((paramMap) => {
    //   const id = paramMap.get('id');
    //   if (id) {
    //     console.log(id);
    //     this.newsFierbaseService.getItemById(id).then((news) => {
    //       this.newsPage = news;
    //       console.log(this.newsPage);
    //     });
    //   }
    // });
  }
}
