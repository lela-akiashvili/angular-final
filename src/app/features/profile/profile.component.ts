import { Component, OnInit, inject, signal } from '@angular/core';
import { UsersFirebaseService } from '../../shared/services/UsersFirebase.service';
import { User } from '../../types/users';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../shared/services/Auth.service';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NewsFirebaseService } from '../../shared/services/NewsFirebase.service';
import { News } from '../../types/news';
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';
import { validatePassword } from 'firebase/auth';
import { routes } from '../../app.routes';

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
  private router = inject(Router);
  addButton = false;
  togglebutton() {
    this.addButton = !this.addButton;
  }
  allNews: News[] = [];
  faveNews: News[] = [];
  user: User | null = null;
  show:
    | 'news'
    | 'favourites'
    | 'tickets'
    | 'bio'
    | 'addManager'
    | 'addPlayer'
    | 'manageTeam'
    | 'games'
    | 'team' = 'favourites';
  get controls() {
    return this.addNewsForm.controls;
  }
  get addplayerControl() {
    return this.addPlayerForm.controls;
  }
  get addManagerControl() {
    return this.addManagerForm.controls;
  }
  private fb = inject(FormBuilder);

  addPlayerForm = this.fb.group({
    role: ['player'],
    team: ['', [Validators.required]],
    position: ['', [Validators.required]],
    experience: ['', [Validators.required]],
    firstName: ['', [Validators.required, Validators.maxLength(15)]],
    lastName: ['', [Validators.required]],
    age: ['', [Validators.required, Validators.maxLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    src: [''],
  });
  addManagerForm = this.fb.group({
    role: ['manager'],
    team: ['', [Validators.required]],
    experience: ['', [Validators.required]],
    firstName: ['', [Validators.required, Validators.maxLength(15)]],
    lastName: ['', [Validators.required]],
    age: ['', [Validators.required, Validators.maxLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    src: [''],
  });
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
          console.log(news);
        });
        this.loadFavoriteNews(userId);
        {
          console.log(userId);
        }
      }
    });
    this.addPlayerForm.addValidators(this.passwordMatch());
    this.addManagerForm.addValidators(this.passwordMatch());
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
  addNewPlayer() {
    console.log(this.addPlayerForm.value);
    if (this.addPlayerForm.valid) {
      const teamMemberData: User = this.addPlayerForm.value as User;
      this.auth
        .registerUser(
          this.addplayerControl.email.value!,
          this.addplayerControl.password.value!,
          teamMemberData,
        )
        .subscribe({
          next: (userCredential) => {
            console.log('User registered successfully:', userCredential);
            alert(
              'Make sure new user vertifies their email before signing in.',
            );
          },
          error: (error) => {
            console.error('Error registering user:', error.message);
          },
        });
    }
  }
  addManager() {
    console.log(this.addManagerForm.value);
    if (this.addManagerForm.valid) {
      const teamMemberData: User = this.addManagerForm.value as User;
      this.auth
        .registerUser(
          this.addManagerControl.email.value!,
          this.addManagerControl.password.value!,
          teamMemberData,
        )
        .subscribe({
          next: (userCredential) => {
            console.log('User registered successfully:', userCredential);
            alert(
              'Make sure new user vertifies their email before signing in.',
            );
          },
          error: (error) => {
            console.error('Error registering user:', error.message);
          },
        });
    }
  }
  passwordMatch() {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.password === control.value.confirmPassword
        ? null
        : {
            passwordsMatching: 'Passwords do not match!',
          };
    };
  }
  deleteUser() {
    this.auth.deleteUser().subscribe({
      next: () => {
        console.log('guy just got obliterated from existance');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log('cant find user', error);
      },
    });
  }

  loadFavoriteNews(userId: string): void {
    this.usersFirebaseService.getFavorites(userId).subscribe({
      next: (favoriteIds) => {
        favoriteIds.forEach((newsId) => {
          this.newsFirebaseService.getNewsById(newsId).subscribe({
            next: (news) => {
              if (news) {
                this.faveNews.push(news);
              }
            },
            error: (error) => console.error('Failed to fetch news', error),
          });
        });
      },
      error: (error) => console.error('Failed to get favorites', error),
    });
  }
}
