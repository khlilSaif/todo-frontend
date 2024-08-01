import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ProjectInput } from '../interfaces';
import { Constants } from '../app/constants';


const apiUrl = 'https://todo-backend-11vi.onrender.com/project'; // Replace with your actual endpoint

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  constructor(private http: HttpClient) { }

  public getAll(token: string|null): Observable<any> {
    return this.http.post<any>(`${Constants.API_URL}/project/all`, {
      token: token
    }).pipe(
      map(response => response),  // Optional: Transform the response if needed
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);  // Log the error
        return throwError(error);  // Rethrow the error to be handled by the consumer
      })
    );
  }

  public addProject(Project: ProjectInput): Observable<any> {
      return this.http.post<any>(`${apiUrl}/add`, Project);
  }

  public removeProject(project_id: number|null, token: string|null): Observable<any>{
     return this.http.post<any>(`${Constants.API_URL}/project/delete`,{
        task_id: project_id,
        token: token
     })
  }
}
