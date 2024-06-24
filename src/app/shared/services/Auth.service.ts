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
import { User } from '../../types/users';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, tap, filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private usersFirebaseService = inject(UsersFirebaseService);
  private newsFirebaseService = inject(NewsFirebaseService);
  signedIn$ = new BehaviorSubject<boolean>(false);
  currentUserId$ = new BehaviorSubject<string | null>(null);
  currentUserTeam$ = new BehaviorSubject<string | null>(
    localStorage.getItem('currentUserTeam'),
  );
  constructor() {
    this.auth.onAuthStateChanged((user) => {
      this.signedIn$.next(!!user);
      this.currentUserId$.next(user ? user.uid : null);
      if (user) {
        this.fetchUserTeam(user.uid);
      }
    });
  }
  private fetchUserTeam(userId: string) {
    this.usersFirebaseService.getUserById(userId).subscribe((user) => {
      const team = user.team.toLowerCase();
      this.currentUserTeam$.next(team);
      localStorage.setItem('currentUserTeam', team);
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
          // ეს ბოლო switchMap ნაწილი რაღად გინდა?
          // უბრალოდ მონაცემებს აბრუნებ და map ოპერატორიც საკმარისია. მაგრამ ამ მონაცემს მაინც არ იყენებ.
          switchMap(() => from([userCredential])),
          tap(() => {
            this.currentUserId$.next(uid);
            // gtfo bish, it's not ur time yet
            this.signOutUser().subscribe();
          }),
        );
      }),
    );
  }
  getUserTeam(): Observable<string | null> {
    return this.currentUserTeam$
      .asObservable()
      .pipe(filter((team) => team !== null));
  }
  signInUser(email: string, password: string): Observable<UserCredential> {
    if (this.signedIn$.value) {
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

        this.signedIn$.next(true);
        this.currentUserId$.next(userCredential.user.uid);
        this.fetchUserTeam(userCredential.user.uid);
        return from([userCredential]);
      }),
    );
  }

  signOutUser(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        console.log('sign out detected from sign out handler');
        this.signedIn$.next(false);
        this.currentUserId$.next(null);
        this.currentUserTeam$.next(null);
        localStorage.removeItem('currentUserTeam');
      }),
    );
  }

  isSignedIn(): boolean {
    return this.signedIn$.value;
  }

  getCurrentUserId(): string | null {
    return this.currentUserId$.value;
  }

  deleteUser(): Observable<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return throwError(() => new Error('no nobody init,mate'));
    }
    const userId = currentUser.uid;
    return this.usersFirebaseService.deleteUser(userId).pipe(
      switchMap(() => from(deleteUser(currentUser))),
      tap(() => {
        this.signedIn$.next(false);
        this.currentUserId$.next(null);
      }),
      catchError((error) => {
        // ერორები ცალ-ცალკე რომ არ დაჰენდლო, შეგიძლია HttpInterceptor შექმნა რომელიც ერორებს იჭერს და მესიჯებს გამოსახავს.
        console.log("something's not right", error);
        return throwError(() => new Error('Failed to delete user.'));
      }),
    );
  }
}
