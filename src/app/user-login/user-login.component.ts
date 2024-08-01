import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onLoginSubmit() {
    this.userService.handleLogin(this.username, this.password)
      .subscribe(
        (response) => {
          localStorage.setItem('token', response.access_token);
          this.userService.username = this.username;
          this.router.navigate(['/project']);
        },
        (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'An error occurred during login';
        }
      );
  }
}
