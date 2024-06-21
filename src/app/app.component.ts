import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './shared/services/Auth.service';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RouterLink, RouterLinkActive, AsyncPipe],
  template: `
    <app-header>
      @if (isUserIn$|async) {
        <li><a routerLink="/profile/{{currentUserId$|async}}">Profile <i class="bi bi-person-circle"></i
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
    
      // main {
      //   margin-top: 4.5px;
      // }
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
  isUserIn$ = this.authService.signedIn$;
  currentUserId$ = this.authService.currentUserId$;

  onSignOut() {
    this.authService.signOutUser().subscribe(() => {
      console.log('User signed out');
    });
  }
}
