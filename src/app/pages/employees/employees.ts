import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss'
})
export class Employees implements OnInit {
  private http = inject(HttpClient);

  employees: any[] = [];
 // employees:Employee[]=[]
  searchText = '';
  selectedDepartment = '';
  departments: string[] = [];

  loading = true;
  errorMessage = '';
  selectedEmployee: any = null;

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.http.get<any>('https://dummyjson.com/users?limit=0')
      .subscribe({
        next: (response) => {
          this.employees = response.users;

          this.departments = [
            ...new Set(
              this.employees.map(
                (employee: any) => employee.company.department
              )
            )
          ];
console.log(this.employees)
          this.loading = false;
        },
        error: (error) => {
          console.error('Employee API error:', error);
          this.errorMessage = 'Unable to load employees. Please try again.';
          this.loading = false;
        }
      });
  }

  get filteredEmployees(): any[] {
    return this.employees.filter((employee: any) => {
      const name =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();

      const matchesSearch =
        name.includes(this.searchText.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesDepartment =
        !this.selectedDepartment ||
        employee.company.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }

  viewDetails(employee: any): void {
    this.selectedEmployee = employee;
  }

  closeDetails(): void {
    this.selectedEmployee = null;
  }
}