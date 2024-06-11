import { Component, OnInit, inject, signal } from '@angular/core';
import { UsersFirebaseService } from '../../shared/services/UsersFirebase.service';
import { User } from '../../types/users';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/services/Auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink,RouterOutlet],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private usersFirebaseService = inject(UsersFirebaseService);
  private activatedRoutes = inject(ActivatedRoute);
  private auth = inject(AuthService);
  user: User | null = null;
  show:'News'|'Favourites'|'Bio'='Bio'
  ngOnInit(): void {
    this.activatedRoutes.paramMap.subscribe((paramMap) => {
      const userId = paramMap.get('uid');
      if (userId) {
        console.log(userId);
        this.usersFirebaseService.getUserById(userId).subscribe((data) => {
          this.user = data;
        });
      }
    });
  }
}
