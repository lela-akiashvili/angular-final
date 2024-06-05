import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { TicketsComponent } from './features/tickets/tickets.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path:'tickets', loadComponent:()=>import('./features/tickets/tickets.component').then((m)=>m.TicketsComponent)
  },
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'**', component:NotFoundComponent}
];
