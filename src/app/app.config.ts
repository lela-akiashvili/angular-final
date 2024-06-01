import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: 'AIzaSyDjzjRNb-y622YQHyT8xEWPZmcfDYXqDEw',
  authDomain: 'final-48.firebaseapp.com',
  projectId: 'final-48',
  storageBucket: 'final-48.appspot.com',
  messagingSenderId: '617125759385',
  appId: '1:617125759385:web:e7fe8fcb306853b8cc6b08',
  databaseURL:
    'https://final-48-default-rtdb.europe-west1.firebasedatabase.app',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase()),
  ],
};
