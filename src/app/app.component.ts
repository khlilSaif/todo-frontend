import { Component } from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ProjectComponent,
    TaskListComponent,
    TaskDetailsComponent,
    HttpClientModule,
    RouterModule,
    LoginComponent,
  ],
  providers: [ProjectService, UserService, DragDropModule, TaskService, TagsService],
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
}
