import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateTaskRequest {
  todo: string;
  state: string;
  closed: boolean;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  private apiUrl = 'https://fooapi.com/api/todos';

  getTasks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addTask(task: CreateTaskRequest): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      task
    );
  }
}