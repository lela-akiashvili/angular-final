import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-sign-out',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignOutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  signUpForm = this.fb.group({
    userType:['',[Validators.required]],
    role:['coach',[Validators.required]],
    firstName: ['', [Validators.required, Validators.maxLength(15)]],
    lastName: ['', [Validators.required]],
    age: ['', [Validators.required, Validators.maxLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });
  get contorls() {
    return this.signUpForm.controls;
  }
  ngOnInit(): void {
    // this.signUpForm.addValidators()
    // console.log(this.signUpForm.valueChanges);
  }
  onClick() {
    console.log(this.signUpForm.value);
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
