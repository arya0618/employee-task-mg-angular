import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './employees.html',
  styleUrl: './employees.scss'
})
export class Employees implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private employeeService = inject(EmployeeService);

  employees: any[] = [];
  searchText = '';
  selectedDepartment = '';
  departments: string[] = [];
  employeeDetails: any = {};
  isDetailsPage = false;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
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

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.employees = response.users;
     this.departments = this.employeeService.getDepartments(this.employees);
        this.loading = false;
        this.cdr.detectChanges();
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

  searchEmployees(value: string): void {
    this.searchText = value;

    if (!value.trim()) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.employeeService.searchEmployees(value).subscribe({
      next: (response) => {
        this.employees = response.users;
        this.departments = this.employeeService.getDepartments(this.employees);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Employee search error:', error);
        this.errorMessage = 'Unable to search employees. Please try again.';
        this.loading = false;
      }
    });
  }



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

    this.employeeService.getEmployeeDetails(id).subscribe({
      next: (response) => {
        this.employeeDetails = response;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Employee details error:', error);
        this.errorMessage = 'Unable to load employee details.';
        this.loading = false;
      }
    });
  }

  retryEmployeeDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadEmployeeDetails(id);
    }
  }
}