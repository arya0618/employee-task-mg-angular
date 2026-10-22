import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTaskRequest } from '../models/task';
import { apiURLs } from '../config/config-url';



@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  getTasks(): Observable<any> {
    return this.http.get<any>(apiURLs.TASK_FETCH_ALL);
  }

  addTask(task: CreateTaskRequest): Observable<any> {
    return this.http.post<any>(
      apiURLs.TASK_FETCH_ALL,
      JSON.stringify(task)
    );
  }
}