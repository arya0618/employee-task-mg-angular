import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink,ActivatedRoute  } from '@angular/router';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './employees.html',
  styleUrl: './employees.scss'
})
export class Employees implements OnInit {
  private http = inject(HttpClient);
  private router =inject(Router)
private route = inject(ActivatedRoute);
  employees: any[] = [];
  searchText = '';
  selectedDepartment = '';
  departments: string[] = [];
  employeeDetails: any ={}
isDetailsPage = false;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
  //   const id = this.route.snapshot.paramMap.get('id');

  // if (id) {
  //   this.loadEmployeeDetails(id);
  // } else {
  //   this.loadEmployees();
  // }

  this.route.paramMap.subscribe(params => {
    const id = params.get('id');

    this.isDetailsPage = !!id;
    this.employeeDetails = null;
    this.errorMessage = '';

    if (id) {
      this.loadEmployeeDetails(id);
    } else {
      this.loadEmployees();
    }
  });
  }

  // Load the initial 30 employees
  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>('https://dummyjson.com/users?limit=30&skip=0')
      .subscribe({
        next: (response) => {
          this.employees = response.users;
          this.setDepartments();
          this.loading = false;
        },
        error: (error) => {
          console.error('Employee API error:', error);
          this.errorMessage = 'Unable to load employees. Please try again.';
          this.loading = false;
        }
      });
  }
  viewDetails(employee: any): void {
    this.router.navigate(['/employee', employee.id]);
  }

  // Search employees using the API
  searchEmployees(value: string): void {
    this.searchText = value;

    if (!value.trim()) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(
      `https://dummyjson.com/users/search?q=${encodeURIComponent(value)}`
    ).subscribe({
      next: (response) => {
        this.employees = response.users;
        this.setDepartments();
        this.loading = false;
      },
      error: (error) => {
        console.error('Employee search error:', error);
        this.errorMessage = 'Unable to search employees. Please try again.';
        this.loading = false;
      }
    });
  }

  // Get department names for the filter
  setDepartments(): void {
    this.departments = [
      ...new Set(
        this.employees.map(
          (employee: any) => employee.company.department
        )
      )
    ];
  }

  // Filter the loaded or searched employees by department
  get filteredEmployees(): any[] {
    if (!this.selectedDepartment) {
      return this.employees;
    }

    return this.employees.filter(
      (employee: any) =>
        employee.company.department === this.selectedDepartment
    );
  }
  loadEmployeeDetails(id: string): void {
  this.loading = true;
  this.errorMessage = '';

  this.http.get<any>(`https://dummyjson.com/users/${id}`)
    .subscribe({
      next: (response) => {
        this.employeeDetails = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Employee details error:', error);
        this.errorMessage = 'Unable to load employee details.';
        this.loading = false;
      }
    });
}
}