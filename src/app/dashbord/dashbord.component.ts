import { Component } from '@angular/core';
import { ProjectComponent } from '../../project/project.component';
import { TaskListComponent } from '../../task/task.component';
import { TaskDetailsComponent } from '../../task-details/task-details.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from '../user-login/user-login.component';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-dashbort',
  standalone: true,
  imports: [
    ProjectComponent,
    TaskListComponent,
    TaskDetailsComponent,
    CommonModule,
    HttpClientModule,
    RouterModule,
    LoginComponent
  ],
  providers: [ProjectService],
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent {
  selectedProjectId: number = 0;
  selectedTask: any;
  constructor(private router: Router) {
      // Check if the user is logged in first before routing them to the login page
      if (!localStorage?.getItem('token')) {
          this.router.navigate(['/login']);
      }
  }
  
  onProjectSelected(projectId: number) {
    this.selectedProjectId = projectId;
    this.selectedTask = null; // Reset task selection when a new project is selected
  }

  onTaskSelected(task: any) {
    this.selectedTask = task;
  }
}
