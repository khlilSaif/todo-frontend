import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import e from 'express';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  username: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSignupSubmit() {
    console.log(this.username, this.password);
    this.userService.handleSignup(this.username, this.password)
      .subscribe(
        (response) => {
          this.successMessage = 'Sign up successful!';
          this.errorMessage = ''; // Clear error message
          this.username = '';
          this.password = '';
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.status === 409) {
            this.errorMessage = 'Username already exists';
          } else {
            console.error('Signup error:', error);
            this.errorMessage = 'An error occurred during signup';
          }
          this.successMessage = ''; // Clear success message
        }
      );
  }
}
