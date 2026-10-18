import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  private apiUrl = 'https://fooapi.com/api/todos';

  getTasks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}