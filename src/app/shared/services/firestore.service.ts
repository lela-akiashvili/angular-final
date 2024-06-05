// firestore.service.ts
import { Injectable, inject } from "@angular/core";
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import { Observable, BehaviorSubject } from "rxjs";
import { User } from "../../types/users";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor() {
    this.loadData();
  }

  private loadData() {
    const dataCollection = collection(this.firestore, 'users');
    collectionData(dataCollection, { idField: 'id' }).subscribe(users => {
      this.usersSubject.next(users as User[]);
    });
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }
}
