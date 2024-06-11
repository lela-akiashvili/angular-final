// // app.component.ts
// import { Component, OnInit, inject } from '@angular/core';
// import {
//   Router,
//   RouterLink,
//   RouterLinkActive,
//   RouterOutlet,
// } from '@angular/router';
// import { HeaderComponent } from './shared/components/header/header.component';
// import { AuthService } from './shared/services/Auth.service';
// import { routes } from './app.routes';
// import { AsyncPipe } from '@angular/common';
// import { Observable } from 'rxjs';
// import { User } from 'firebase/auth';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     HeaderComponent,
//     RouterLink,
//     RouterLinkActive,
//     AsyncPipe,
//   ],
//   template: `
//     <app-header>
//       @if (isUserIn$ | async) {
//         <li>
//           <a routerLink="/profile/{}"
//             >Profile <i class="bi bi-person-circle"></i
//           ></a>
//         </li>
//         <li (click)="onSignOut()"><a routerLink="/home"></a> sign out</li>
//       } @else {
//         <li>
//           <a routerLink="/auth/sign-in">
//             Sign in <i class="bi bi-box-arrow-in-right"></i
//           ></a>
//         </li>
//         <li>
//           <a routerLink="/auth/sign-up"
//             >Sign up <i class="bi bi-person-circle"></i
//           ></a>
//         </li>
//       }
//     </app-header>
//     <main><router-outlet></router-outlet></main>
//   `,

//   styles: `
//     main {
//       margin-top: 4.5px;
//     }
//     li {
//       padding: 1rem;
//       border-bottom: 1px solid red;
//       color: black;
//     }
//     li:hover {
//       background-color: red;
//       color: white;
//     }
//     li a {
//       color: black;
//       text-decoration: none;
//     }
//     li a:hover {
//       background-color: rgb(255, 0, 0);
//       color: white;
//     }
//     .bi-box-arrow-in-right,
//     .bi-person-circle,
//     .bi-chevron-down {
//       font-size: initial;
//       margin-left: 2px;
//     }
//   `,
// })
// export class AppComponent implements OnInit {
//   private authService = inject(AuthService);
//   private router = inject(Router);
//   isUserIn$: Observable<boolean> = this.authService.signedIn$;
//   ngOnInit(): void {
//   }
//   onSignOut() {
//     console.log(this.authService.signOutUser());
//     this.authService.signOutUser().subscribe(() => {
//       this.router.navigate(['/home']);
//       console.log('out');
//     });
//   }
// }
// app.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './shared/services/Auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RouterLink, RouterLinkActive],
  template: `
    <app-header>
      @if (isUserIn) {
        <li><a routerLink="/profile/{{currentUserId}}">Profile <i class="bi bi-person-circle"></i
        ></a></li>
        <li><a routerLink="/home" (click)="onSignOut()">Sign out</a></li>
      } @else {
        <li>
          <a routerLink="/auth/sign-in"
            >Sign in <i class="bi bi-box-arrow-in-right"></i
          ></a>
        </li>
        <li>
          <a routerLink="/auth/sign-up"
            >Sign up <i class="bi bi-person-circle"></i
          ></a>
        </li>
      }
    </app-header>
    <main><router-outlet></router-outlet></main>
  `,
  styles: [
    `
      main {
        margin-top: 4.5px;
      }
      li {
        padding: 1rem;
        border-bottom: 1px solid red;
        color: black;
      }
      li:hover {
        background-color: red;
        color: white;
      }
      li a {
        color: black;
        text-decoration: none;
      }
      li a:hover {
        background-color: rgb(255, 0, 0);
        color: white;
      }
      .bi-box-arrow-in-right,
      .bi-person-circle,
      .bi-chevron-down {
        font-size: initial;
        margin-left: 2px;
      }
    `,
  ],
})
export class AppComponent{
  private authService = inject(AuthService);
  isUserIn: boolean = false;
  currentUserId: string | null = null;
  constructor() {
    this.authService.signedIn$.subscribe((isSignedIn: boolean) => {
      this.isUserIn = isSignedIn;
    });

    this.authService.currentUserId$.subscribe((userId: string | null) => {
      this.currentUserId = userId;
      console.log(this.currentUserId);

    });
  }

  onSignOut() {
    this.authService.signOutUser().subscribe(() => {
      console.log('User signed out');
    });
  }
}
