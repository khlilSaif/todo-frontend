import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const apiUrl = 'https://todo-backend-11vi.onrender.com/user/';
@Injectable({
  providedIn: 'root'
})

export class UserService {
  username: string = '';

  
  constructor(private http: HttpClient) { }

  handleLogin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${apiUrl}login`, {
      username: username,
      password: password
    }).pipe(
      catchError((error: any) => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }

  handleSignup(username: string, password: string): Observable<any> {
    const signupData = { username: username, password: password };
    return this.http.post<any>(`${apiUrl}signup`, signupData)
      .pipe(
        catchError((error: any) => {
          console.error('Signup error:', error);
          return throwError(error);
        })
      );
  }

  addGuestUser(): Observable<any> {
    return this.http.post<any>(`${apiUrl}guest`, {})
      .pipe(
        catchError((error: any) => {
          console.error('Guest user error:', error);
          return throwError(error);
        })
      );
  }
}