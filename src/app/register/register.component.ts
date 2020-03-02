import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import * as zxcvbn from 'zxcvbn';
import { Observable } from 'rxjs';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  passwordMessage = '';
  hide = true;
  registerForm = new FormGroup({
    name: new FormControl('', 
    [Validators.required, Validators.minLength(3)],
    this.serverConflictValidator("name")),
    email: new FormControl('', [
      Validators.required, 
      Validators.email, 
      Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+.[a-z]{2,}$")
    ],
    this.serverConflictValidator("email")),
    password: new FormControl('', this.passwordValidator()),
    password2: new FormControl('')
  }, this.passwordsMatchValidator);
  
  constructor(private usersServerService: UsersServerService) { }

  ngOnInit(): void {
  }

  get name() {
    return this.registerForm.get('name') as FormControl;
  }
  get email() {
    return this.registerForm.get('email') as FormControl;
  }
  get password() {
    return this.registerForm.get('password') as FormControl;
  }
  get password2() {
    return this.registerForm.get('password2') as FormControl;
  }

  stringify(text: string) {
    return JSON.stringify(text);
  }

  passwordValidator(): ValidatorFn {
    return (control: FormControl) : ValidationErrors => {
      const result = zxcvbn(control.value);
      const message = "Sila hesla: " + result.score + " / 4 - musí byť aspoň 3 " + 
         result.feedback.warning + " prelomiteľné za " + 
         result.crack_times_display.offline_slow_hashing_1e4_per_second;
      this.passwordMessage = message;
      return result.score < 3 ? { weakPassword: message } : null;
    }
  } 
  
  passwordsMatchValidator(control: FormGroup): ValidationErrors {
    const password = control.get('password');
    const password2 = control.get('password2');
    if (password.value === password2.value) {
      password2.setErrors(null);
      return null;
    } else {
      password2.setErrors({ differentPasswords: 'Passwords do not match' });
      return { differentPasswords: 'Passwords do not match' };
    }
  }

  serverConflictValidator(confictFieldName:string):AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors> => {
      const username = confictFieldName === 'name' ? control.value : '';
      const email = confictFieldName === 'email' ? control.value : '';
      const user = new User(username, email);
      return this.usersServerService.userConflicts(user).pipe(
        map(conflictsArray => {
          return conflictsArray.includes(confictFieldName) 
          ? {
            conflictField: "táto hodnota už na serveri je"
          } : null
        })
      )
    }
  }

  formSubmit() {

  }
}
