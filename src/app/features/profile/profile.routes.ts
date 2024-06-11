import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'profile/:uid/reg-User-page',
    loadComponent: () =>
      import(
        '../../shared/components/reg-user-page/reg-user-page.component'
      ).then((m) => m.RegUserPageComponent),
  },
  {
    path: 'profile/:uid/coach-page',
    loadComponent: () =>
      import('../../shared/components/coach-page/coach-page.component').then(
        (m) => m.CoachPageComponent,
      ),
  },
  {
    path: 'profile/:uid/manager-page',
    loadComponent: () =>
      import(
        '../../shared/components/manager-page/manager-page.component'
      ).then((m) => m.ManagerPageComponent),
  },
  {
    path: 'profile/:uid/player-page',
    loadComponent: () =>
      import('../../shared/components/player-page/player-page.component').then(
        (m) => m.PlayerPageComponent,
      ),
  },
];
