import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ProjectComponent } from '../project/project.component';
import { TaskListComponent } from '../task/task.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../services/project.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { LoginComponent } from './user-login/user-login.component';
import { UserService } from '../services/user.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskService } from '../services/task.service';
import { TagsService } from '../services/tags.service';
import { on } from 'events';
import { LocalStorageService } from './local-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ProjectComponent,
    TaskListComponent,
    TaskDetailsComponent,
    CommonModule,
    HttpClientModule,
    RouterModule,
    LoginComponent,
  ],
  providers: [ProjectService, UserService, DragDropModule, TaskService, TagsService, LocalStorageService],
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnChanges, OnInit{
    user: number = 0;
    guest: boolean = false;
    private storageSubscription: Subscription = undefined!;
    constructor(private userService: UserService, private _localStorage: LocalStorageService, private router: Router) {
    }

    ngOnInit() {
      // Initialize guest value
      this.guest = this._localStorage.getItem('guest') === 'true';
  
      // Subscribe to local storage changes
      this.storageSubscription = this._localStorage.storageChanges$.subscribe(value => {
        console.log(value, "guest");
        if (value !== null) {
          this.guest = value !== 'false';
        }
      });
    }

    checkGuest() {
      if( this._localStorage?.getItem('guest') === "false") {
          this.guest = false;
      }else {
          this.guest = true;
      }
      if( !this._localStorage.getItem('token')){
        this.add_guest_user();
      }
    }
    

    ngOnChanges(changes: SimpleChanges)  {
      if( this._localStorage?.getItem('guest') === "false") {
        this.guest = true;
      }else {
          this.guest = false;
      }
      if( !this._localStorage.getItem('token')){
        this.add_guest_user();
      }
    }
    
    add_guest_user() {
        this._localStorage?.setItem('guest', 'true');
        this.userService.addGuestUser().subscribe(
            (response) => {this._localStorage?.setItem('guest', 'true'); this._localStorage.setItem('token',response.access_token);this.router.navigate(['/project']);},
            (error) => {}
        );
    }
}
