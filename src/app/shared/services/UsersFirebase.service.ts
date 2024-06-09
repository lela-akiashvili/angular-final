import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { TeamMember, User } from '../../types/users';
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
  // addUser(user: TeamMember) {
  //   return addDoc(this.usersCollection, user)
  //     .then(() => {
  //       console.log('added');
  //     })
  //     .catch((error) => {
  //       console.log('user not added', error);
  //     });
  // }
  getUserById(userId: string): Observable<TeamMember> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(
      getDoc(userDocRef).then((docSnap) => docSnap.data() as TeamMember),
    );
  }
}
