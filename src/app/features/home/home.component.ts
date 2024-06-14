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
    min-height:100vh;
    padding:20px 5px 0 5px;
  }
  @media (min-width:550px){
    section{
      padding: 1rem 1.5rem;
    }
  }
  @media(min-width:700px){
    section{
      padding: 1rem 2.5rem;
    }
  }
  @media(min-width:800px){
    section{
      padding: 1rem 4.5rem;
    }
  }
  @media(min-width:900px){
    section{
      max-width:85vw;
      margin:auto;
    }
  }
  @media(min-width:1200px){
    section{
      max-width:85vw;
      margin:auto;
    }
  }
  @media(min-width:1400px){
    section{
      max-width:85vw;
      margin:auto;
    }
  }
  `,

})
 
export class HomeComponent {

}
