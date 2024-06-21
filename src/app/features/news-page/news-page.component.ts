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
      <div class="all"><h4>Published: 
        <span>
          {{newsPage.date}}
        </span></h4>
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
export class NewsPageComponent implements OnInit {
  activatedRoutes = inject(ActivatedRoute);
  newsFierbaseService = inject(NewsFirebaseService);
  newsPage: News | null = null;
  ngOnInit(): void {
    this.activatedRoutes.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        console.log(id);
        this.newsFierbaseService.getNewsById(id).subscribe((news) => {
          this.newsPage = news;
        });
      }
    });
  }
}
