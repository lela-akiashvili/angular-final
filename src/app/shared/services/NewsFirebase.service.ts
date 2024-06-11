import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  docSnapshots,
  getDoc,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
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
  getItemById(id: string): Promise<News | null> {
    const docRef = doc(this.firestore, `news/${id}`);
    return getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            console.log(docSnap.data());
            return docSnap.data() as News;
        } else {
            return null;
        }
    }).catch(error => {
        console.error("Error fetching document:", error);
        return null;
    });
}

}
