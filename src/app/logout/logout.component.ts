import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
    constructor(private router: Router, private localStorage: LocalStorageService) {
       this.localStorage.removeItem('token');
       this.localStorage.setItem('guest', 'true');
       this.localStorage.removeItem('reload');
       this.router.navigate(['/login']);
    }
}
