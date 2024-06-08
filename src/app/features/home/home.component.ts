import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProfileComponent, NewsCardComponent],
  template:`<app-profile></app-profile>
<app-news-card></app-news-card>`,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
