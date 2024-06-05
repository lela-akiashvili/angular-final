// profile.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore.service';
import { Observable } from 'rxjs';
import { User } from '../../types/users';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AsyncPipe],
  template: `<section>
    <!-- @for (user of data$|async; track $index) {}
    <div >
      <img [src]="user.profileImageUrl" alt="User Image" />
      <p>{{ user.name }}</p>
    </div> -->
  </section>`,
  styleUrl: './profile.component.css',
  providers: [FirestoreService],
})
export class ProfileComponent implements OnInit {
  data$: Observable<User[]>;
  private firestoreService = inject(FirestoreService);

  constructor() {
    this.data$ = this.firestoreService.getUsers();
  }

  ngOnInit(): void {
    console.log('hi');
  console.log(this.data$)
  }
}
