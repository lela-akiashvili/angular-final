import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,

} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Game } from '../../types/game';
@Injectable({
  providedIn: 'root',
})
export class GamesFirebaseService {
  private firestore = inject(Firestore);
  private gamesCollection = collection(this.firestore, 'games');
  // Generics, nice!
  addGames(game: Omit<Game, 'id'>): Observable<string> {
    return from(addDoc(this.gamesCollection, game)).pipe(
      map((docRef) => docRef.id),
    );
  }
  getGames(): Observable<Game[]> {
    return collectionData(this.gamesCollection, {
      idField: 'id',
    }) as Observable<Game[]>;
  }
}
