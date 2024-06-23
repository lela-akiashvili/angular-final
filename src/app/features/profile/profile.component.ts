import { Component, OnInit, inject } from '@angular/core';
import { UsersFirebaseService } from '../../shared/services/UsersFirebase.service';
import { NewsFirebaseService } from '../../shared/services/NewsFirebase.service';
import { GamesFirebaseService } from '../../shared/services/GamesFirebase.service';
import { AnnouncementsFirebase } from '../../shared/services/Announcements.service';
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
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';
import { Observable, TimestampProvider, tap, timestamp } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { User } from '../../types/users';
import { News } from '../../types/news';
import { Game } from '../../types/game';
import { Announcement } from '../../types/announcement';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    ReactiveFormsModule,
    NewsCardComponent,
    DatePipe,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  
})
export class ProfileComponent implements OnInit {
  private usersFirebaseService = inject(UsersFirebaseService);
  private activatedRoutes = inject(ActivatedRoute);
  private newsFirebaseService = inject(NewsFirebaseService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private gamesService = inject(GamesFirebaseService);
  private announcements = inject(AnnouncementsFirebase);
  private fb = inject(FormBuilder);

  addButton = false;
  announcementsByTeam$: Observable<Announcement[]> | undefined;
  allNews: News[] = [];
  faveNews: News[] = [];
  user: User | null = null;
  ann: Announcement[] = [];
  UsersByTeam: User[] = [];
  show:
    | 'news'
    | 'favourites'
    | 'tickets'
    | 'bio'
    | 'addManager'
    | 'addPlayer'
    | 'manageTeam'
    | 'games'
    | 'announce' = 'bio';

  togglebutton() {
    this.addButton = !this.addButton;
  }

  get controls() {
    return this.addNewsForm.controls;
  }

  get addplayerControl() {
    return this.addPlayerForm.controls;
  }

  get addManagerControl() {
    return this.addManagerForm.controls;
  }

  get addGamesControl() {
    return this.addGamesForm.controls;
  }
  get addAnnouncementsControl() {
    return this.addAnnouncementForm.controls;
  }
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

  addGamesForm = this.fb.group({
    team1: ['', [Validators.required]],
    src1: ['', [Validators.required]],
    team2: ['', [Validators.required]],
    src2: ['', [Validators.required]],
    date: [new Date(), [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    tickets: [20, [Validators.required]],
  });
  addAnnouncementForm = this.fb.group({
    importance: ['low', [Validators.required]],
    date: ['', [Validators.required]],
    place: ['', [Validators.required, Validators.minLength(5)]],
    team: [`${this.auth.currentUserTeam$.value}`, [Validators.required]],
    note: ['', [Validators.required]],
    subject: ['', [Validators.required]],
    agree: [0],
    dissagree: [0],
  });
  ngOnInit(): void {
    this.activatedRoutes.paramMap.subscribe((paramMap) => {
      const userId = paramMap.get('uid');
      if (userId) {
        this.usersFirebaseService.getUserById(userId).subscribe((data) => {
          this.user = data;
          console.log('User data:', data);
        });
        this.usersFirebaseService.getUsersByTeam().subscribe((users) => {
          this.UsersByTeam = users;
        });
        this.newsFirebaseService.getNewsByUserId(userId).subscribe((news) => {
          this.allNews = news;
        });
        this.loadFavoriteNews(userId);
        this.loadAnnouncements();
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
          // this.addNewsForm.reset();
        },
        (error) => {
          console.log('Cannot add new news', error);
        },
      );
    }
  }

  addNewGames() {
    if (this.addGamesForm.valid && this.user) {
      const gameData: Game = {
        team1: this.addGamesForm.value.team1 as string,
        src1: this.addGamesForm.value.src1 as string,
        team2: this.addGamesForm.value.team2 as string,
        src2: this.addGamesForm.value.src2 as string,
        date: this.addGamesForm.value.date as Date | null,
        address: this.addGamesForm.value.address as string,
        tickets: this.addGamesForm.value.tickets as number | null,
      };

      this.gamesService.addGames(gameData).subscribe({
        next: (docId) => {
          console.log('Game added:', docId);
          this.addGamesForm.reset();
        },
        error: (error) => {
          console.error('Error adding game:', error);
        },
      });
    } else {
      console.log('there is a problem');
    }
  }

  deleteNews(id: string) {
    this.newsFirebaseService.deleteNews(id).subscribe({
      next: () => {
        console.log('News deleted');
        this.allNews = this.allNews.filter((news) => news.id !== id);
      },
      error: (error) => {
        console.log('Cannot delete news', error.message);
      },
    });
  }
  // ეს მეთოდი ბოლომდე დასრულებული არაა, ჯერ მხოლოდ მომხმარებლის firestore data-ს შლის და არა მთლიან auth credentials. ვერ ვასწრებ ყველაფრის დასრულებას დედლაინამდე ამიტომ, მოგვიანებით კიდევ დავხვეწავ.
  deleteUsers(id: string) {
    this.usersFirebaseService.deleteUser(id).subscribe({
      next: () => {
        console.log('User deleted successfully');
        this.UsersByTeam = this.UsersByTeam.filter((user) => user.id !== id);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      },
    });
  }
  // ეს და addNewManager მეთოდებიც არაა დასრულებული, მწვრთელს ჯერ ვერ მოვასწარი რომ ახალი იუსერების დამატების უფლება მივცე, ამასაც მოგვიანებით დავამთავრებ.
  addNewPlayer() {
  //   console.log(this.addPlayerForm.value);
  //   if (this.addPlayerForm.valid) {
  //     const teamMemberData: User = this.addPlayerForm.value as User;
  //     this.auth
  //       .registerUser(
  //         this.addplayerControl.email.value!,
  //         this.addplayerControl.password.value!,
  //         teamMemberData,
  //       )
  //       .subscribe({
  //         next: (userCredential) => {
  //           console.log('User registered successfully:', userCredential);
  //           alert('Make sure new user verifies their email before signing in.');
  //         },
  //         error: (error) => {
  //           console.error('Error registering user:', error.message);
  //         },
  //       });
  //   }
  }

  addManager() {
    // console.log(this.addManagerForm.value);
    // if (this.addManagerForm.valid) {
    //   const teamMemberData: User = this.addManagerForm.value as User;
    //   this.auth
    //     .registerUser(
    //       this.addManagerControl.email.value!,
    //       this.addManagerControl.password.value!,
    //       teamMemberData,
    //     )
    //     .subscribe({
    //       next: (userCredential) => {
    //         console.log('User registered successfully:', userCredential);
    //         alert('Make sure new user verifies their email before signing in.');
    //       },
    //       error: (error) => {
    //         console.error('Error registering user:', error.message);
    //       },
    //     });
    // }
  }
  addAnnouncement() {
    if (this.addAnnouncementForm.valid && this.user) {
      const formValue = this.addAnnouncementForm.value;
      const dateValue = formValue.date ? new Date(formValue.date) : new Date();
      const timestamp = Timestamp.fromDate(dateValue);
      const announcement: Announcement = {
        importance: formValue.importance as 'medium' | 'high' | 'low',
        subject: formValue.subject as string,
        team: formValue.team as string,
        place: formValue.place as string,
        note: formValue.note as string,
        agree: 0,
        dissagree: 0,
        id: this.user.id as string,
        date: timestamp as Timestamp,
      };
      this.announcements.addAnnouncements(announcement).subscribe({
        next: (docId) => {
          console.log('Announcement added:', docId);
          this.addAnnouncementForm.reset();
        },
        error: (error) => {
          console.error('Error adding Announcement:', error);
        },
      });
    } else {
      console.log('and i oops!');
    }
  }
  deleteAnnouncement(id: string) {
    this.announcements.deleteAnnouncements(id).subscribe({
      next: () => {
        console.log('announcement deleted');
        this.ann = this.ann.filter((an) => an.id !== id);
      },
      error: (error) => {
        console.log('Cannot delete that', error.message);
      },
    });
  }


  deleteUser() {
    this.auth.deleteUser().subscribe({
      next: () => {
        console.log('User deleted');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log('Cannot delete user', error);
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
  loadAnnouncements() {
    this.announcements.getAnnouncementsByTeam().subscribe({
      next: (data) => {
        this.ann = data;
      },
      error: (error) => {
        console.error('Error loading announcements:', error);
      },
    });
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
}
