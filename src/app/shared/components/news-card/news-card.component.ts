import { Component, OnInit, inject, signal } from '@angular/core';
import { NewsFirebaseService } from '../../services/NewsFirebase.service';
import { News } from '../../../types/news';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [RouterLink],
  template: `
  <div>
     @for (news of newsSig(); track news.id) {
    <div class="card">
      <img [src]="news.src" alt="" />
      <span>
        <h4>
          <a routerLink="/news-page/{{news.id}}">{{ news.title }}</a> </h4>
        <span class="about"
          >tags:
          @for (item of news.about; track $index) {
            <h5>{{ item }},</h5>
          }<i class="bi bi-bookmark-heart"></i>
        </span>
        <p>{{ news.text }}</p>
      </span>
    </div>
  }
  </div>

  
  `,
  styleUrl: `./news.component.css`,
})
export class NewsCardComponent implements OnInit {
  private newsFirebaseService = inject(NewsFirebaseService);
  newsSig = signal<News[]>([]);
  ngOnInit(): void {
    this.newsFirebaseService.getNews().subscribe((news) => {
      this.newsSig.set(news);
      // console.log(this.newsSig());
    });
  }
}
