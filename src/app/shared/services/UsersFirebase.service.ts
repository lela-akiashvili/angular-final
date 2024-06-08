import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { TeamMember } from '../../types/users';
import { getDoc } from 'firebase/firestore';
@Injectable({ providedIn: 'root' })
export class UsersFirebaseService {
  
  private firestore = inject(Firestore);
  private usersCollection = collection(this.firestore, 'users');

  getUsers(): Observable<TeamMember[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<TeamMember[]>;
  }
  addUser(data: TeamMember) {
    const userCreate: TeamMember = { ...data };
    const promise = addDoc(this.usersCollection, userCreate).then(
      (response) => response.id,
    );
    return from(promise);
  }
  getUserById(userId: number): Observable<TeamMember> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userDocRef).then((docSnap) => docSnap.data() as TeamMember));
  }
}
