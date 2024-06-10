// app.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './shared/services/Auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RouterLink],
  template: `
    <app-header>
      @if (isUserIn) {
        <li><a routerLink="/home" (click)="onSignOut()"></a> sign out</li>
      } @else {
        <li>
          <a routerLink="/auth/sign-in" (click)="onShowMenu()">
            Sign in <i class="bi bi-box-arrow-in-right"></i
          ></a>
        </li>
        <li>
          <a routerLink="/auth/sign-up" (click)="onShowMenu()"
            >Sign up <i class="bi bi-person-circle"></i
          ></a>
        </li>
      }
    </app-header>
    <main><router-outlet></router-outlet></main>
  `,

  styles: `
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
})
export class AppComponent {
  private authService = inject(AuthService);
  isUserIn = this.authService.isSignedIn();
  showDropDown: boolean = false;
  showMenu: boolean = false;
  onShowMenu() {
    this.showMenu = !this.showMenu;
  }
onSignOut(){
  console.log(this.authService.signOut())
return this.authService.signOut();
}
}
