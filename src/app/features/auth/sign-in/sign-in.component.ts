import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/Auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: ` <form [formGroup]="signInForm" (ngSubmit)="onSubmit()">
    <h1>SIGN IN</h1>
    <div>
      <input type="email" placeholder="your email" formControlName="email" />
      <input
        type="password"
        placeholder="your password"
        formControlName="password"
      />
      <button type="submit">sign in</button>
    </div>
  </form>`,
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  
  onSubmit() {
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;
      this.authService.signInUser(email!, password!).subscribe({
        next: (userCredential) => {
          console.log('im in',userCredential) ;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.log('not in ', error);
          alert(error.message);
        },
      });
    }
  }
}
