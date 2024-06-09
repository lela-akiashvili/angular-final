import { Component, OnInit, Signal, inject, signal } from '@angular/core';
import { NewsFirebaseService } from '../../shared/services/NewsFirebase.service';
import { Observable } from 'rxjs';
import { News } from '../../types/news';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [DatePipe],
  template: ` <h1>hi</h1>
    @if (news) {
      <img [src]="news.src" alt="" />
      <h1>{{ news.title }}</h1>
      <p>{{ news.date | date }}</p>
      <h3>tags: {{ news.about }}</h3>
      <p>{{ news.text }}</p>
    }`,
  styleUrl: './news-page.component.css',
})
export class NewsPageComponent implements OnInit {
  route = inject(ActivatedRoute);
  newsFierbaseService = inject(NewsFirebaseService);
  news: News | null = null;
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
     console.log(id) ;
    //  this.news.id
      }
    });
  }
}
