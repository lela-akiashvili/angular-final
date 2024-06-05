import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `<header>
    <h1>SPORTS TODAY</h1>
    <nav>
      <ul>
        <li><a routerLink="/home">news</a></li>
        <li class="sports-menu">
          sports
          <ul class="drop-down">
            <li>football</li>
            <li>basketball</li>
            <li>volleyball</li>
            <li>ice skating</li>
          </ul>
        </li>
        <li><a routerLink="/tickets">tickets</a></li>
      </ul> 
      <ul>
        <li><a href="">sign in</a></li>/ <li><a href="">sign up</a></li></ul>
    </nav>
  </header>`,
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
