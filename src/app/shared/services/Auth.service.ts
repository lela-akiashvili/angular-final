import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
  signOut,
  deleteUser,
} from '@angular/fire/auth';
import { UsersFirebaseService } from './UsersFirebase.service';
import { NewsFirebaseService } from './NewsFirebase.service';
import { News } from '../../types/news';
import { User } from '../../types/users';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private usersFirebaseService = inject(UsersFirebaseService);
  private newsFirebaseService = inject(NewsFirebaseService);
  private signedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserIdSubject = new BehaviorSubject<string | null>(null);

  get signedIn$() {
    return this.signedInSubject.asObservable();
  }

  get currentUserId$() {
    return this.currentUserIdSubject.asObservable();
  }

  constructor() {
    this.auth.onAuthStateChanged((user) => {
      this.signedInSubject.next(!!user);
      this.currentUserIdSubject.next(user ? user.uid : null);
    });
  }

  registerUser(
    email: string,
    password: string,
    teamMemberData: User,
  ): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password),
    ).pipe(
      switchMap((userCredential: UserCredential) => {
        const uid = userCredential.user.uid;
        const userData: User = { ...teamMemberData, id: uid, favorites: [] };
        const { password: _, ...userDataWithoutPassword } = userData;
        return from(
          this.usersFirebaseService.addUser(userDataWithoutPassword),
        ).pipe(
          switchMap(() => from(sendEmailVerification(userCredential.user))),
          switchMap(() => from([userCredential])),
          tap(() => {
            this.currentUserIdSubject.next(uid);
            // gtfo bish, it's not ur time yet
            this.signOutUser().subscribe();
          }),
        );
      }),
    );
  }

  signInUser(email: string, password: string): Observable<UserCredential> {
    if (this.signedInSubject.value) {
      alert('User already signed in');
      return throwError(() => new Error('User already signed in'));
    }

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential: UserCredential) => {
        if (!userCredential.user.emailVerified) {
          console.log(userCredential.user.emailVerified);
          return from(signOut(this.auth)).pipe(
            switchMap(() => throwError(() => new Error('Email not verified'))),
          );
        }

        this.signedInSubject.next(true);
        this.currentUserIdSubject.next(userCredential.user.uid);
        return from([userCredential]);
      }),
    );
  }

  signOutUser(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.signedInSubject.next(false);
        this.currentUserIdSubject.next(null);
      }),
    );
  }

  isSignedIn(): boolean {
    return this.signedInSubject.value;
  }

  getCurrentUserId(): string | null {
    return this.currentUserIdSubject.value;
  }
  deleteUser(): Observable<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return throwError(() => new Error('no nobodu init,mate'));
    }
    const userId = currentUser.uid;
    return this.usersFirebaseService.deleteUser(userId).pipe(
      switchMap(() => from(deleteUser(currentUser))),
      tap(() => {
        this.signedInSubject.next(false);
        this.currentUserIdSubject.next(null);
      }),
      catchError((error) => {
        console.log("something's not right", error);
        return throwError(() => new Error('Failed to delete user.'));
      }),
    );
  }
}
