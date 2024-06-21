import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap } from 'rxjs';
import { Announcement } from '../../types/announcement';
import { AuthService } from './Auth.service';
import { collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsFirebase {
  private firestore = inject(Firestore);
  private announcementCollection = collection(this.firestore, 'announcements');
  private authService = inject(AuthService);

  getAnnouncementsByTeam(): Observable<Announcement[]> {
    return this.authService.getUserTeam().pipe(
      switchMap((team) => {
        const q = query(
          this.announcementCollection,
          where('team', '==', team?.toLowerCase()),
        );
        return collectionData(q, { idField: 'id' }) as Observable<
          Announcement[]
        >;
      }),
    );
  }
  addAnnouncements(news: Omit<Announcement, 'id'>): Observable<string> {
    return from(addDoc(this.announcementCollection, news)).pipe(
      map((docRef) => docRef.id),
    );
  }
  deleteAnnouncements(id: string): Observable<void> {
    const docRef = doc(this.firestore, `announcements/${id}`);
    return from(deleteDoc(docRef));
  }
}
