// sign-up.component.ts
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/Auth.service';
import { User } from '../../../types/users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  signUpForm = this.fb.group({
    userType: ['', [Validators.required]],
    role: [''],
    team: [''],
    position: [''],
    experience: [''],
    firstName: ['', [Validators.required, Validators.maxLength(15)]],
    lastName: ['', [Validators.required]],
    age: ['', [Validators.required, Validators.maxLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    avatar: [''],
  });

  get controls() {
    return this.signUpForm.controls;
  }

  ngOnInit(): void {
    this.signUpForm.addValidators(this.passwordMatch());
  }
  onchange(): void {
    this.signUpForm.get('userType')!.valueChanges.subscribe((userType) => {
      if (userType === 'TeamMember') {
        this.controls.role.setValidators([Validators.required]);
        this.controls.team.setValidators([Validators.required]);
        this.controls.position.setValidators([]);
        this.controls.experience.setValidators([Validators.required]);
      } else if (userType === 'regularUser') {
        this.controls.role.setValidators([]);
        this.controls.team.setValidators([]);
        this.controls.position.setValidators([]);
        this.controls.experience.setValidators([]);
      }

      this.controls.role.updateValueAndValidity();
      this.controls.team.updateValueAndValidity();
      this.controls.position.updateValueAndValidity();
      this.controls.experience.updateValueAndValidity();
    });
    this.signUpForm.get('role')!.valueChanges.subscribe(role => {
      if (role === 'manager' || role === 'coach') {
        this.controls.team.setValidators([Validators.required]);
        this.controls.experience.setValidators([Validators.required]);
      } else {
        this.controls.team.setValidators([]);
        this.controls.experience.setValidators([]);
      }

      this.controls.team.updateValueAndValidity();
      this.controls.experience.updateValueAndValidity();
    });
  }
  onSubmit() {
    if (this.signUpForm.valid) {
      const teamMemberData: User = this.signUpForm.value as User;
      this.authService
        .registerUser(
          this.controls.email.value!,
          this.controls.password.value!,
          teamMemberData,
        )
        .subscribe({
          next: (userCredential) => {
            console.log('User registered successfully:', userCredential);
            alert('Please verify your email before signing in.');
            this.router.navigate(['/auth/sign-in']);
          },
          error: (error) => {
            console.error('Error registering user:', error.message);
          },
        });
    }
  }

  passwordMatch() {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.password === control.value.confirmPassword
        ? null
        : {
            passwordsMatching: 'Passwords do not match!',
          };
    };
  }
}
