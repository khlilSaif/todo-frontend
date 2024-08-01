import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Tag, Task, TaskResponse } from '../interfaces';
import { TaskService } from '../services/task.service';
import { FormsModule } from '@angular/forms';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { TagsService } from '../services/tags.service';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskDetailsComponent],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

export class TaskListComponent implements OnInit, OnChanges {
  tasks: Task[] = [];
  tasksResponse: TaskResponse[] = [];
  availableTags: Tag[] = [];
  blockedTaskMap: { [key: number]: Task[] } = {};
  selectedTask: Task | null = null;

  @Input() selectedProjectId: number = 0;
  @Output() taskSelected = new EventEmitter<any>();

  newTask: Partial<Task> = { description: '', blocked_task: undefined };
  showTaskModal: boolean = false;
  showTaskDetailModal: boolean = false;

  constructor(private taskService: TaskService, private tagsService: TagsService, private router : Router) {
    if( !localStorage?.getItem('token')){
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loadAvailableTags();
    this.loadMainData();
    this.loadAvailableTags();
  }

  loadMainData() {
    if( !localStorage?.getItem('token')){
      return;
    }
    this.taskService.getAllTasks(this.selectedProjectId, localStorage?.getItem('token')).subscribe(
      (response) => {
        this.tasks = response;
        this.mapTagsAndTasks();
        this.populateBlockedTaskMap();
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );
  }

  populateBlockedTaskMap() {
    this.tasks.forEach(task => {
      if (task.blocked_task) {
        if (!this.blockedTaskMap[task.blocked_task]) {
          this.blockedTaskMap[task.blocked_task] = [];
        }
        this.blockedTaskMap[task.blocked_task].push(task);
      }
    });
  }
  
  openTaskDetailModal(task: Task) {
    this.selectedTask = task;
    this.showTaskDetailModal = true;
  }

  removeTask(task: Task){
    if( !localStorage?.getItem('token')){
      return;
    }
    this.taskService.removeTask(task.id, localStorage?.getItem('token')).subscribe(
      (response => {
        this.loadAvailableTags();
        this.loadMainData();
      }),
      (error => error))
  }
    
  closeTaskDetailModal() {
    this.showTaskDetailModal = false;
    this.selectedTask = null;
  }

  openTaskModal() {
    this.showTaskModal = true;
  }

  closeTaskModal() {
    this.showTaskModal = false;
  }

  addTask() {
    if (!this.newTask.description) {
      return;
    }
    if(!localStorage?.getItem('token')){
       return;
    }
    this.taskService.addTask(this.selectedProjectId, this.newTask.description, this.newTask.blocked_task || undefined, localStorage?.getItem('token')).subscribe(
      (response) => {
        this.tasks.push(response);
        this.closeTaskModal();
        this.populateBlockedTaskMap();
        this.mapTagsAndTasks();
      },
      (error) => {
        console.error('Error adding task:', error);
      }
    );
    this.newTask.description = '';
    this.newTask.blocked_task = undefined;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedProjectId'] && changes['selectedProjectId'].currentValue !== changes['selectedProjectId'].previousValue) {
      this.loadMainData();
    }
    this.loadAvailableTags();
  }

  mapTagsAndTasks() {
    this.tasks.forEach(task => {
      task.tags = this.availableTags.find(tag => tag.id === task.tags?.id);
    });
  }

  loadAvailableTags() {
    if(!localStorage?.getItem('token')){
      return;
   }
    this.tagsService.getAvailableTags(localStorage?.getItem('token') || undefined).subscribe(
      (response: Tag[]) => {
        this.availableTags = response;
        this.mapTagsAndTasks();
      },
      (error) => {
        
      }
    );
  }
  
  closeDetails() {
    this.selectedTask = null;
    this.showTaskDetailModal = false;
  }

  removeTag(tag: Tag) { 
    if( !localStorage?.getItem('token')){
      return;
    }
    this.tagsService.removeTag(tag.id,localStorage?.getItem('token')).subscribe
    (
      (response =>{
        this.loadAvailableTags();
        this.loadMainData();
        this.mapTagsAndTasks();
      }),
      (error => {

      })
    )
  }

  toggleCompletion(task: any) {
    task.completed = !task.completed;
    if( !localStorage?.getItem('token')){
      return;
    }
    this.taskService.updateTask(task,localStorage?.getItem('token') ).subscribe(
      (response => {
      }),
      (error => {
        this.loadMainData();
      })
    )
  }
}