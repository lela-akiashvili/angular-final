import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section>
      <!--going back doesn't do work yet -->
      <h3>go <a routerLink="">Back</a> or go<a routerLink="/home"> Home</a></h3>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv1JOLwDO3FR3Ccom5wWY_7UVkZskLb4uVlg&s"
        alt=""
      />
    </section>
  `,
  styles: `section{
    display:grid;
    justify-items: center;
    img{
      border-radius:3px;
    }
  }`,
})
export class NotFoundComponent {}
