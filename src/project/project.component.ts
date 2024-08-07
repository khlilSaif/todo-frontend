
import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project, ProjectInput, Task } from '../interfaces';
import { FormsModule } from '@angular/forms';
import { response } from 'express';
import { error } from 'console';
import { UserService } from '../services/user.service';
import { switchMap } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskListComponent } from '../task/task.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../app/local-storage.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, TaskListComponent, TaskDetailsComponent],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  newProject: ProjectInput = { name: '', description: '', token: '' };
  showModal: boolean = false;
  filterText: string = '';
  filteredProjects: Project[] = [];
  selectedProjectId: number = 0;

  selectedTask: Task | null = null;
  showTaskDetails: boolean = false;

  constructor(private _projectService: ProjectService, private router: Router, private localStorage: LocalStorageService) {
    if( !this.localStorage?.getItem('token')){
      this.router.navigate(['/login']);
    }
    // if( !this.localStorage?.getItem('project')){
    //   this.localStorage?.setItem('project', 'true');
    //     location.reload();
    // }
  }

  getSelectedProjectName(): string {
    const selectedProject = this.projects.find(p => p.id === this.selectedProjectId);
    return selectedProject ? selectedProject.name : '';
  }

  selectProject(project: Project) {
    this.selectedProjectId = project.id;
  }

  ngOnInit(): void {
    this.loadMainData();
  }

  filterProjects() {
    this.filteredProjects = this.projects.filter(project => 
      project.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  addProject() {
    this.newProject.token = this.localStorage?.getItem('token') || '';
    this._projectService.addProject(this.newProject).subscribe(
      (response) => {
        this.closeModal();
        this.loadMainData();
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    )
    this.newProject = { name: '', description: '', token: '' };
  }

  private loadMainData(): void { 
    if( !this.localStorage?.getItem('token')){
      return;
    }
    this._projectService.getAll(this.localStorage?.getItem('token')).subscribe(
      (response) => {
        console.log(response, "test");
        this.projects = response;
        this.filteredProjects = [...this.projects];
        this.filterProjects(); 
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    )
  }

  removeProject(project: Project) 
  {
    if( !this.localStorage?.getItem('token')){
      return;
    }
      this._projectService.removeProject(project.id,this.localStorage?.getItem('token')).subscribe(
        (response =>{
           this.loadMainData();
           this.selectedProjectId = 0;
        }),
        (error =>{
          console.log(error);
        })
      );
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  openTaskDetailsModal(task: Task) {
    this.selectedTask = task;
    this.showTaskDetails = true;
  }

  closeTaskDetailsModal() {
    this.showTaskDetails = false;
    this.selectedTask = null;
  }
  
  drop(event: CdkDragDrop<Project[]>): void {
    moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
  }
  
}