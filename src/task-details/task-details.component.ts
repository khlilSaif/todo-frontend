import { CommonModule } from '@angular/common';
import { Subtask, Tag, Task } from '../interfaces';
import { Component, Input, OnInit, Output, EventEmitter, input, output } from '@angular/core';
import { TaskService } from '../services/task.service';
import { FormsModule } from '@angular/forms';
import { TagsService } from '../services/tags.service';
import { response } from 'express';
import { Router } from '@angular/router';
import { LocalStorageService } from '../app/local-storage.service';
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
  editableDescription = this.task?.description || '';
  isValidDescription = true;
  editing: boolean = false;


  constructor(private taskService: TaskService, private tagsService: TagsService, private router: Router, private _localStorage: LocalStorageService) {
      this.blocked = this.task?.blocked_task;
      this.editableDescription = this.task?.description || '';
      if(!this._localStorage?.getItem('token')){
        this.router.navigate(['/login']);
      }
  }

  ngOnInit() {
    if (this.task?.id) {
      this.blocked = this.task?.blocked_task;
      this.editableDescription = this.task?.description || '';
      this.loadSubtasks(this.task);
      console.log(this.task.tags);
    }
  }

  loadTasksList() {
    this.loadTasks.emit();
  }

  ngOnChanges() {
    if (this.task?.id) {
      this.loadSubtasks(this.task);
      this.blocked = this.task?.blocked_task;
      this.editableDescription = this.task?.description || '';
    } else {
      this.subtasks = [];
    }
  }

  loadSubtasks(task: Task | undefined) {
    if (task) {
      if(!this._localStorage?.getItem('token')){
        return;
      }
      this.taskService.getSubtasks(task.id, this._localStorage?.getItem('token')).subscribe(
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
      if( !this._localStorage?.getItem('token') ){
        return;
      }
      this.taskService.addSubtask(this.task.id, this.newSubtaskDescription,this._localStorage?.getItem('token')).subscribe(
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
      if( !this._localStorage?.getItem('token')) {
        return;
      }
        this.taskService.assignTagToTask(this.task.id, tag.id,this._localStorage?.getItem('token')).subscribe(
          (response) => {
            this.tagAssignedToTask = tag;
            if( this.task ){
              this.task.tags = tag;
            }
            this.showTagDropdown = false;
            this.showTagInput = false;
            this.loadTasksList();
          },
          (error) => {
            console.error('Error adding tag:', error);
          }
        )
    }  
  }

  addTag(){
    if( !this._localStorage?.getItem('token')){
      return;
    }
    if( this.newTagName.trim() === '') {
      return;
    }
      this.tagsService.addTag(this.newTagName, this._localStorage?.getItem('token') || undefined).subscribe(
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
    if( !this._localStorage?.getItem('token')){
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
      if( tag.id === this.tagAssignedToTask.id) {
        this.tagAssignedToTask = null;
      }
      this.removeTag.emit(tag);
  }

  unselectTag(tag: Tag){
    console.log("tag", this.task?.tags );
    if( this.task ){
        this.task.tags = undefined;
        this.tagAssignedToTask = null;
        this.saveTask();
    }
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
    if( !this._localStorage?.getItem('token')){
      return;
    }
       this.taskService.updateTask(this.task,this._localStorage?.getItem('token')).subscribe(
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
    if( !this._localStorage?.getItem('token')){
      return;
    }
    this.taskService.updateSubtask(subtask,this._localStorage?.getItem('token')).subscribe(
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