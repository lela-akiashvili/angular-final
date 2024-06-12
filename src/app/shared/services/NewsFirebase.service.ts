import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  docSnapshots,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
  QuerySnapshot,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { News } from '../../types/news';
import { deleteDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class NewsFirebaseService {
  private firestore = inject(Firestore);
  private newsCollection = collection(this.firestore, 'news');
  getNews(): Observable<News[]> {
    return collectionData(this.newsCollection, { idField: 'id' }) as Observable<
      News[]
    >;
  }
  getNewsById(id: string): Promise<News | null> {
    const docRef = doc(this.firestore, `news/${id}`);
    return getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          console.log(docSnap.data());
          return docSnap.data() as News;
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error('Error fetching document:', error);
        return null;
      });
  }
  addNews(news: Omit<News, 'id'>): Observable<string> {
    return from(addDoc(this.newsCollection, news)).pipe(
      map((docRef) => docRef.id)
    );
  }
  getNewsByUserId(id: string): Observable<News[]> {
    const q = query(this.newsCollection, where('userId', '==', id));
    return from(getDocs(q)).pipe(
      map((querySnapShot) => {
        const news: News[] = [];
        querySnapShot.forEach((doc) => {
          news.push({ id: doc.id, ...doc.data() } as News);
        });
        return news;
      }),
    );
  }
  deleteNews(id: string): Observable<void> {
    const docRef = doc(this.firestore, `news/${id}`);
    console.log(id)
    return from(deleteDoc(docRef));
  }
}
