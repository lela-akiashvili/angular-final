import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: ` <footer>
    <nav>
      <ul>
        <li>About Us</li>
        <li>Contact</li>
        <li>Partners</li>
      </ul>
      <ul>
        <li>Statistics</li>
        <li>Live Stream</li>
        <li><a routerLink="/auth/sign-up"> Join Us!</a></li>
      </ul>
      <ul>
        <li> <a routerLink="/home">News</a> </li>
        <li>Teams</li>
      </ul>
    </nav>
  </footer>`,
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
