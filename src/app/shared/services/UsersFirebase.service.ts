import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  arrayUnion,
  collection,
  collectionData,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, from, catchError, throwError, map, switchMap, of } from 'rxjs';
import { User } from '../../types/users';
import { deleteDoc, query, where } from 'firebase/firestore';
import { AuthService } from './Auth.service';

@Injectable({ providedIn: 'root' })
export class UsersFirebaseService {
  private firestore = inject(Firestore);
  private usersCollection = collection(this.firestore, 'users');
  // private authService = inject(AuthService)
  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<User[]>;
  }

  getUserById(userId: string): Observable<User> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          return docSnap.data() as User;
        } else {
          throw new Error('User not found');
        }
      }),
    ).pipe(
      catchError((error) => {
        console.error('Error getting user by ID:', error);
        return throwError(() => new Error('Failed to get user by ID.'));
      }),
    );
  }
  getUsersByTeam(): Observable<User[]> {
    const currentUserTeam = localStorage.getItem('currentUserTeam');
  
    console.log('Current user team:', currentUserTeam);
  
    const q = query(
      this.usersCollection,
      where('team', '==', currentUserTeam)
    );
  
    return collectionData(q, { idField: 'id' }) as Observable<User[]>;
  }
  
  
  addUser(user: Omit<User, 'password'>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return setDoc(userDocRef, user).catch((error) => {
      console.error('Error adding user:', error);
      throw new Error('Failed to add user.');
    });
  }

  deleteUser(id: string): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return from(deleteDoc(userDocRef)).pipe(
      catchError((error) => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error('Failed to delete user.'));
      }),
    );
  }
  addToFavorites(userId: string, newsId: string): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userDocRef, { favorites: arrayUnion(newsId) })).pipe(
      catchError((error) => {
        console.log('cant add to faves baby', error);
        return throwError(() => new Error('useless stick'));
      }),
    );
  }
  getFavorites(userId: string): Observable<string[]> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userDocRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const user = docSnap.data() as User;
          return user.favorites || [];
        } else {
          throw new Error('user not on earth');
        }
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('cant get your faves sorry babe'));
      }),
    );
  }
}
