import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURLs } from '../config/config-url';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);

  getEmployees(): Observable<any> {
    return this.http.get<any>(apiURLs.EMP_FETCH);
  }

  searchEmployees(value: string): Observable<any> {
    return this.http.get<any>(
      `${apiURLs.EMP_SEARCH}${encodeURIComponent(value)}`
    );
  }

  getEmployeeDetails(id: string): Observable<any> {
    return this.http.get<any>(
      `${apiURLs.EMP_DETAILS}${id}`
    );
  }
   getDepartments(employees: any[]): string[] {
    return [
      ...new Set(
        employees.map(
          (employee: any) => employee.company.department
        )
      )
    ];
  }
}