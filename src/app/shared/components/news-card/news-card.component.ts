import { Component, OnInit, inject, signal } from '@angular/core';
import { NewsFirebaseService } from '../../services/NewsFirebase.service';
import { News } from '../../../types/news';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [],
  template: `@for (news of newsSig(); track news.id) {
    <div>
      <img [src]="news.src" alt="" />
      <span>
        <h4>{{ news.title }}</h4>
        <span class="about"
          >tags:
          @for (item of news.about; track $index) {
            <h5>{{ item }},</h5>
          }
        </span>
        <p>{{ news.text }}</p>
      </span>
    </div>
  } `,
  styleUrl: `./news.component.css`,
})
export class NewsCardComponent implements OnInit {
  private newsFirebaseService = inject(NewsFirebaseService);
  newsSig = signal<News[]>([]);
  ngOnInit(): void {
    this.newsFirebaseService.getNews().subscribe((news) => {
      this.newsSig.set(news);
      console.log(this.newsSig());
    });
  }
}
