import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { NewsPageComponent } from './features/news-page/news-page.component';
import { ProfileComponent } from './features/profile/profile.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'news-page/:id',
    component: NewsPageComponent,
      
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {path:'profile/:uid', component:ProfileComponent},
  {
    path: 'tickets',
    loadComponent: () =>
      import('./features/tickets/tickets.component').then(
        (m) => m.TicketsComponent,
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
