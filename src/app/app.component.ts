// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <main><router-outlet></router-outlet></main>
  `,
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  styles: `
    main {
      margin-top: 1rem;
    }
  `,
})
export class AppComponent {}
