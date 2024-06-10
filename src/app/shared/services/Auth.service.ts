import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
  signOut,
} from '@angular/fire/auth';
import { UsersFirebaseService } from './UsersFirebase.service';
import { User } from '../../types/users';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private usersFirebaseService = inject(UsersFirebaseService);
  private signedInSub = new BehaviorSubject<boolean>(false);
  signedIn$ = this.signedInSub.asObservable();

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
        const userData: User = { ...teamMemberData, id: uid };
        const { password: _, ...userDataWithoutPassword } = userData;
        return from(
          this.usersFirebaseService.addUser(userDataWithoutPassword),
        ).pipe(
          switchMap(() => from(sendEmailVerification(userCredential.user))),
          switchMap(() => from([userCredential])),
        );
      }),
    );
  }
  signInUser(email: string, password: string): Observable<UserCredential> {
    if (this.signedInSub.value) {
      throw console.error('user already signed in');
    }
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential: UserCredential) => {
        if (!userCredential.user.emailVerified) {
          throw new Error('email not vertified');
        }
        this.signedInSub.next(true);
        return from([userCredential]);
      }),
    );
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      switchMap(() => {
        this.signedInSub.next(false);
        return from([void 0]);
      }),
    );
  }
  isSignedIn(): boolean {
    return this.signedInSub.value;
  }
}
