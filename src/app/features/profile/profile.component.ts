import { Component, OnInit, inject, signal } from '@angular/core';
import { UsersFirebaseService } from '../../shared/services/UsersFirebase.service';
import { User } from '../../types/users';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/services/Auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsFirebaseService } from '../../shared/services/NewsFirebase.service';
import { News } from '../../types/news';
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ReactiveFormsModule, NewsCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private usersFirebaseService = inject(UsersFirebaseService);
  private activatedRoutes = inject(ActivatedRoute);
  private newsFirebaseService = inject(NewsFirebaseService);
  private auth = inject(AuthService);

  addButton = false;
  togglebutton() {
    this.addButton = !this.addButton;
  }
  allNews: News[] = [];
  user: User | null = null;
  show:
    | 'news'
    | 'favourites'
    | 'tickets'
    | 'bio'
    | 'addManager'
    | 'addPlayer'
    | 'manageTeam' = 'bio';
  get controls() {
    return this.addNewsForm.controls;
  }
  private fb = inject(FormBuilder);
  addNewsForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(7)]],
    about: [''],
    text: ['', [Validators.required, Validators.minLength(120)]],
    src: ['', [Validators.required, Validators.minLength(7)]],
    date: [new Date(), [Validators.required]],
  });
  ngOnInit(): void {
    this.activatedRoutes.paramMap.subscribe((paramMap) => {
      const userId = paramMap.get('uid');
      if (userId) {
        console.log(userId);
        this.usersFirebaseService.getUserById(userId).subscribe((data) => {
          this.user = data;
        });
        this.newsFirebaseService.getNewsByUserId(userId).subscribe((news) => {
          this.allNews = news;
          console.log(this.allNews);
          console.log(news);
        });
      }
    });
  }

  addNews() {
    if (this.addNewsForm.valid && this.user) {
      const news: Omit<News, 'id'> = {
        title: this.addNewsForm.value.title as string,
        about: this.addNewsForm.value.about
          ? this.addNewsForm.value.about.split(',').map((tag) => tag.trim())
          : null,
        text: this.addNewsForm.value.text as string,
        src: this.addNewsForm.value.src as string,
        date: this.addNewsForm.value.date as Date,
        userId: this.user.id as string,
      };

      this.newsFirebaseService.addNews(news).subscribe(
        (newId) => {
          const newNews: News = { id: newId, ...news };
          this.allNews.push(newNews);
          console.log('Added new news with ID:', newId);
        },
        (error) => {
          console.log('Cannot add new news', error);
        },
      );
    }
  }
  deleteNews(id: string) {
    this.newsFirebaseService.deleteNews(id).subscribe({
      next: () => {
        console.log('news deleted');
        this.allNews = this.allNews.filter((news) => news.id !== id);
      },
      error: (error) => {
        console.log("cant kill what's already dead", error.message);
      },
    });
  }
}
