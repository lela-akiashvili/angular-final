import { Component, OnInit, inject, signal } from '@angular/core';
import { UsersFirebaseService } from '../../shared/services/UsersFirebase.service';
import { TeamMember } from '../../types/users';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private usersFirebaseService = inject(UsersFirebaseService);
  userSig = signal<TeamMember[]>([]);
  ngOnInit(): void {
    this.usersFirebaseService.getUsers().subscribe((users) => {
      this.userSig.set(users);
      console.log(this.userSig());
    });
  }
}
