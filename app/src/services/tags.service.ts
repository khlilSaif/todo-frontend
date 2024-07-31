import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ProjectInput } from '../interfaces';
import { Constants } from '../app/constants';


const apiUrl = 'http://localhost:8000'; // Replace with your actual endpoint

@Injectable({
  providedIn: 'root'
})

export class TagsService {
  constructor(private http: HttpClient) { }

  public getAvailableTags(token: string|undefined): Observable<any> {
    return this.http.post<any>(`${Constants.API_URL}/tag`, {
      token: token
    }).pipe(
      map(response => response),  // Optional: Transform the response if needed
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);  // Log the error
        return throwError(error);  // Rethrow the error to be handled by the consumer
      })
    );
  }

  public addTag(name: string, token: string|undefined): Observable<any> {
    return this.http.post<any>(`${Constants.API_URL}/tag/add`, {
      name: name,
      token: token
    }).pipe(
      map(response => response),  // Optional: Transform the response if needed
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);  // Log the error
        return throwError(error);  // Rethrow the error to be handled by the consumer
      })
    );
  }

  public  removeTag(task_id?: number, token?: string | null): Observable<any>{
    return this.http.post<any>(`${Constants.API_URL}/tag/delete`,{
      task_id: task_id, 
      token : token
    })
  }
}

