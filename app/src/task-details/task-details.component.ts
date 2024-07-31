import { CommonModule } from '@angular/common';
import { Subtask, Tag, Task } from '../interfaces';
import { Component, Input, OnInit, Output, EventEmitter, input, output } from '@angular/core';
import { TaskService } from '../services/task.service';
import { FormsModule } from '@angular/forms';
import { TagsService } from '../services/tags.service';
import { response } from 'express';
import { Router } from '@angular/router';
@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})

export class TaskDetailsComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() closeDetails = new EventEmitter<void>();
  @Output() removeTag = new EventEmitter<Tag>();
  @Input() availableTags: Tag[] = [];
  @Input() tagAssignedToTask: any;
  @Input() tasks: Task[] = []
  @Output() loadTasks = new EventEmitter<void>();
  blocked : number | undefined | null = this.task?.blocked_task;
  subtasks: Subtask[] = [];
  newSubtaskDescription: string = '';
  showTagDropdown: boolean = false;
  newTagName: string = '';
  showTagInput: boolean = false;
  isEditingDescription = false;
  editableDescription = '';
  isValidDescription = true;
  editing: boolean = false;


  constructor(private taskService: TaskService, private tagsService: TagsService, private router: Router) {
      this.blocked = this.task?.blocked_task;
      if(!localStorage?.getItem('token')){
        this.router.navigate(['/login']);
      }
  }

  ngOnInit() {
    if (this.task?.id) {
      this.blocked = this.task?.blocked_task;
      this.loadSubtasks(this.task);
    }
  }

  loadTasksList() {
    this.loadTasks.emit();
  }

  ngOnChanges() {
    if (this.task?.id) {
      this.loadSubtasks(this.task);
      this.blocked = this.task?.blocked_task;
    } else {
      this.subtasks = [];
    }
  }

  loadSubtasks(task: Task | undefined) {
    if (task) {
      if(!localStorage?.getItem('token')){
        return;
      }
      this.taskService.getSubtasks(task.id, localStorage?.getItem('token')).subscribe(
        (response: Subtask[]) => {
          this.subtasks = response;
        }, 
        (error) => {
          console.error('Error loading subtasks:', error);
        }
      );
    }
  }

  addSubtask() {
    if (!this.newSubtaskDescription.trim()) {
      return;
    }

    if (this.task) {
      if( !localStorage?.getItem('token') ){
        return;
      }
      this.taskService.addSubtask(this.task.id, this.newSubtaskDescription,localStorage?.getItem('token')).subscribe(
        (response: Subtask) => {
          this.subtasks.push(response);
          this.newSubtaskDescription = '';
        },
        (error) => {
          console.error('Error adding subtask:', error);
        }
      );
    }
  }

  toggleTagDropdown() {
    this.showTagDropdown = !this.showTagDropdown;
  }

  setTag(tag: Tag) {
    if (this.task?.id) {
      if( !localStorage?.getItem('token')) {
        return;
      }
        this.taskService.assignTagToTask(this.task.id, tag.id,localStorage?.getItem('token')).subscribe(
          (response) => {
            this.tagAssignedToTask = tag;
            if( this.task ){
              this.task.tags = tag;
            }
            this.showTagDropdown = false;
            this.showTagInput = false;
          },
          (error) => {
            console.error('Error adding tag:', error);
          }
        )
    }  
  }

  addTag(){
    if( !localStorage?.getItem('token')){
      return;
    }
      this.tagsService.addTag(this.newTagName, localStorage?.getItem('token') || undefined).subscribe(
        (response: Tag) => {
          this.newTagName = '';
          this.availableTags.push(response); 
          this.setTag(response);
        },
        (error) => {
          console.error('Error adding tag:', error);
        }
      )
  }

  getTagInputText() {
      if(this.task?.tags){
        return "+ Update Tag";
      }
      return "+ Add Tag";
  }

  removeSubtask(subtask: Subtask){
    if( !localStorage?.getItem('token')){
      return;
    }
     this.taskService.removeSubtask(subtask.id,
      localStorage?.getItem('token'))
      .subscribe((response) => {
        this.loadSubtasks(this.task || undefined);
      },
      (error) => {
        console.error('Error adding tag:', error);
      }
    )
  }

  rmTag(tag: Tag){
      this.removeTag.emit(tag);
  }

  close() {
    this.closeDetails.emit();
  }


  enableEdit() {
    this.isEditingDescription = true;
    this.editableDescription = this.task?.description || '';
    this.isValidDescription = true;
  }

  saveTask(){
    if( !localStorage?.getItem('token')){
      return;
    }
       this.taskService.updateTask(this.task,localStorage?.getItem('token')).subscribe(
        (response => {
            this.loadTasksList();
        }),
        (error =>{

        })
       )
  }
  
  updateDescription() {
    console.log(this.task);
    console.log(this.blocked);
    if (this.editableDescription.trim()) {
      if( this.task ){
         this.task.description = this.editableDescription;
         this.saveTask();
      }
        this.isEditingDescription = false;
    } else {
      this.isValidDescription = false;
    }
  }

  toggleSubtaskCompletion(subtask: Subtask) {
    subtask.completed = !subtask.completed;
    this.saveSubtask(subtask);
  }

  editSubtask() {
    this.editing = true;
  }

  saveSubtask(subtask:Subtask) {
    this.editing = false;
    if( !localStorage?.getItem('token')){
      return;
    }
    this.taskService.updateSubtask(subtask,localStorage?.getItem('token')).subscribe(
      (response => {
        this.loadSubtasks(this.task || undefined);
      }),
      (error => {

      })
    )
  }
  
  updateBlockedTask(){
      if(this.task){
        this.task.blocked_task = this.blocked || null;
        this.saveTask();
      }
  }
}