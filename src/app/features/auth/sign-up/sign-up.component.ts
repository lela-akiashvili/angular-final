import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UsersFirebaseService } from '../../../shared/services/UsersFirebase.service';
import { TeamMember, User } from '../../../types/users';

@Component({
  selector: 'app-sign-out',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignOutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private usersFirebaseService= inject(UsersFirebaseService);
  signUpForm = this.fb.group({
    userType: ['', [Validators.required]],
    role: ['coach', [Validators.required]],
    team: ['', [Validators.required]],
    experience: ['', Validators.required],
    firstName: ['', [Validators.required, Validators.maxLength(15)]],
    lastName: ['', [Validators.required]],
    age: ['', [Validators.required, Validators.maxLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    avatar: [''],
  });
  get contorls() {
    return this.signUpForm.controls;
  }
  ngOnInit(): void {
    this.signUpForm.addValidators(this.passwordMatch());
  }
  onSubmit() {
    // if(this.signUpForm.valid){
    //   const newUser:TeamMember|User = this.signUpForm.value;
    //   this.usersFirebaseService.addUser(newUser).then(()=>{
    //     console.log('added');
    //   }).catch(error=>{
    //     console.log('cant', error);
    //   });
    // }
    // else{
    //   console.log('form invalid');
    // }
    console.log(this.signUpForm.value);
    //  const signUpData = this.signupForm.getRawValue();
    // this.authService.signUp(signUpData);
  }
  passwordMatch() {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.password === control.value.confirmPassword
        ? null
        : {
            passwordsMatching: 'passwords do not match!',
          };
    };
  }
}
