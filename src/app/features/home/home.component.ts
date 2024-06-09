import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { NewsCardComponent } from '../../shared/components/news-card/news-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProfileComponent, NewsCardComponent],
  template:`
  <section>
<app-news-card></app-news-card></section>
 `,
  styles: `section{
    background-color:black; 
    min-height:100vh;

    padding:20px 5px 0 5px;
  }`,
})
export class HomeComponent {

}
