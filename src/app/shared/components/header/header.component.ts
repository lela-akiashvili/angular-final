import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <div>
        <h1>SPORTS TODAY</h1>
        <i (click)="onShowMenu()" class="bi bi-list"></i>
      </div>
      <nav [class.show]="showMenu" class="showNav">
        <ul>
          <li><a routerLink="/home">News</a></li>
          <li class="sportsmenu" (click)="onShowDropDown()">
            Sports <i class="bi bi-chevron-down"></i>
            <ul class="dropdown" [class.show]="showDropDown">
              <li (click)="filterNews('football')">Football</li>
              <li (click)="filterNews('basketball')">Basketball</li>
               <li (click)="filterNews('volleyball')">Volleyball</li>
              <li (click)="filterNews('ice skating')">Ice skating</li>
            </ul>
          </li>
          <li><a routerLink="/tickets">Tickets</a></li>
        </ul>
        <ul>
          <ng-content></ng-content>
        </ul>
      </nav>
    </header>
  `,
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private router = inject(Router);

  showMenu: boolean = false;
  showDropDown: boolean = false;

  onShowMenu() {
    this.showMenu = !this.showMenu;
  }

  onShowDropDown() {
    this.showDropDown = !this.showDropDown;
  }
  filterNews(sport: string) {
    this.showDropDown = false;
    this.router.navigate(['/home'], { queryParams: { sport } });
  }
}
