import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc,setDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { User } from '../../types/users';

@Injectable({ providedIn: 'root' })
export class UsersFirebaseService {
  private firestore = inject(Firestore);
  private usersCollection = collection(this.firestore, 'users');

  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, { idField: 'id' }) as Observable<User[]>;
  }

  addUser(user: Omit<User, 'password'>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return setDoc(userDocRef, user);
  }

  getUserById(userId: string): Observable<User> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userDocRef).then((docSnap) => docSnap.data() as User));
  }
}
