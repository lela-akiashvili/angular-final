import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { News } from '../../types/news';

@Injectable({ providedIn: 'root' })
export class NewsFirebaseService {
  private firestore = inject(Firestore);
  private newsCollection = collection(this.firestore, 'news');
  getNews(): Observable<News[]> {
    return collectionData(this.newsCollection, { idField: 'id' }) as Observable<
      News[]
    >;
  }
  getNewsById(id: string): Observable<News> {
    const newsDocRef = doc(this.firestore, `news-page/:${id}`);
    return docData(newsDocRef, { idField: 'id' }) as Observable<News>;
  }
}
