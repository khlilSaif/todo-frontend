import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, takeLast, throwError } from 'rxjs';
import { Constants } from '../app/constants';
import { response } from 'express';
import { Subtask, Task } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) { }

  getAllTasks(project_id: number, token: string | null): Observable<any>{
     return this.http.post<any>(`${Constants.API_URL}/task`,{
      project_id: project_id,
      token: token,
      description: null,
     }).pipe(
      map(response => 
        response.map((task: { id: any; description: any; project_id: any; blocked_task: any; tag_id: any; completed: any; }) => ({
          id: task.id,
          description: task.description,
          project_id: task.project_id,
          blocked_task: task.blocked_task,
          tags: task.tag_id ? { id: task.tag_id } : undefined,
          completed: task.completed
        }))
      ),
      catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);  // Log the error
      return throwError(error);  // Rethrow the error to be handled by the consumer
    }));
  }

  addTask(project_id?: number, description?: string, blocked_task?:number, token?: string | null): Observable<any>{
    return this.http.post<any>(`${Constants.API_URL}/task/add`,{
      task:{
        project_id: project_id,
        description: description
      },
      blocked_task: blocked_task,
      token: token
    }).pipe(map(response => response),
      catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);  // Log the error
      return throwError(error);  // Rethrow the error to be handled by the consumer
    }));
  }

  getSubtasks(task_id: number | undefined, token: string | null): Observable<any>{
     return this.http.post<any>(`${Constants.API_URL}/subtask`,{
      task_id: task_id,
      token: token,
     })
  }

  addSubtask(task_id?: number, description?: string, token?: string | null): Observable<any>{
    return this.http.post<any>(`${Constants.API_URL}/subtask/add`,{
        task_id: task_id,
        description: description,
        token: token,
        completed: false
    }).pipe(map(response => response),
      catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error);  // Log the error
      return throwError(error);  // Rethrow the error to be handled by the consumer
    }));
  }

  assignTagToTask(task_id?: number, tag_id?: number, token?: string | null): Observable<any>{
    return this.http.post<any>(`${Constants.API_URL}/task/assignTagToTask/${task_id}/${tag_id}`,{
      token
    }).pipe(map(response => response),
    catchError((error: HttpErrorResponse) => {
    console.error('An error occurred:', error);  // Log the error
    return throwError(error);  // Rethrow the error to be handled by the consumer
    }));
  }

  removeTask(task_id?: number, token?: string | null): Observable<any>{
    return this.http.post<any>(`${Constants.API_URL}/task/delete`,{
      token : token,
      task_id: task_id      
    })
  }

  removeSubtask(task_id?: number, token?: string | null): Observable<any>{
    return this.http.post<any>(`${Constants.API_URL}/subtask/delete`,{
      token : token,
      task_id: task_id      
    })
  }

  updateSubtask(subTask: Subtask, token?: string | null): Observable<any>{
    return this.http.put<any>(`${Constants.API_URL}/subtask/update`,{
      subtask: subTask,
      token: token
    })
  }
 
  updateTask(task: Task | null, token?: string | null): Observable<any>{
    return this.http.put<any>(`${Constants.API_URL}/task/update`,{
      task:{
        id: task?.id,
        description: task?.description,
        completed: task?.completed,
        tag_id: task?.tags?.id,
        blocked_task: task?.blocked_task,
        project_id: task?.project_id
      },
      token: token
    })
  }
}
