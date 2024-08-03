import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';

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

  constructor(private userService: UserService, private router: Router, private _localStorage: LocalStorageService) {
    if( this._localStorage.getItem('token') && this._localStorage.getItem('guest') === "false") {
      this.router.navigate(['/project']);
    }
    // if( !this._localStorage.getItem('reload') ){
    //   this._localStorage.setItem('reload', 'true');
    //   location.reload();
    // }
  }

  onLoginSubmit() {
    this.userService.handleLogin(this.username, this.password)
      .subscribe(
        (response) => {
          this._localStorage?.setItem('token', response.access_token);
          this._localStorage?.setItem('guest', "false");
          this._localStorage.removeItem('project');
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
