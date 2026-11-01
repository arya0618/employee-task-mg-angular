
import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeInterFace } from '../../models/employee';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); // added beacuse count not showing on dashboard web page
  spotlightEmployees: EmployeeInterFace[]=[];
  
 totalEmployees = 0;
  activeEmployees = 0;
  totalTasks = 0;
  pendingTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;

  employeesLoaded = signal(false);
  tasksLoaded = signal(false);
  loading = signal(true);
  errorMessage = '';

  ngOnInit(): void {
    this.loadEmployees();
    this.loadTasks();
  }

  loadEmployees(): void {
    this.http.get<any>('https://dummyjson.com/users?limit=3&skip=3')
      .subscribe({
        next: (response) => {
          this.totalEmployees = response.total;
          this.activeEmployees = response.users.length;

          console.log('Employee count:', this.totalEmployees);
          this.loading.set(false);
           this.spotlightEmployees = response.users.slice(0, 3);

           this.employeesLoaded.set(true);
            this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Employee API error:', error);
          this.errorMessage = 'Unable to load employee data.';
          this.employeesLoaded.set(true);
          this.checkLoading();
        },
      });
  }

loadTasks(): void {
  this.http.get<any>('https://fooapi.com/api/todos')
    .subscribe({
      next: (response) => {
        const tasks = response.data;

        this.totalTasks = response.data.length;

        this.completedTasks =
          tasks.filter((task: any) => task.state === 'Completed').length;

        this.pendingTasks =
          tasks.filter((task: any) => task.state === 'Pending').length;

        this.inProgressTasks =
          tasks.filter((task: any) => task.state === 'Working').length;
        console.log("pending",this.pendingTasks)
        this.loading.set(false);
        console.log('Task count:', this.totalTasks);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Task API error:', error);
        this.errorMessage = 'Unable to load task data.';
        this.tasksLoaded.set(true);
        this.checkLoading();
      },
    });
}

  checkLoading(): void {
    console.log("--> ",this.employeesLoaded)
    this.loading.set(!(this.employeesLoaded() && this.tasksLoaded()));
        console.log("--===== ",this.loading)
        
  this.cdr.detectChanges();
  }

  get taskChartStyle(): string {
  const total =
    this.pendingTasks +
    this.inProgressTasks +
    this.completedTasks;

  if (total === 0) {
    return 'conic-gradient(#e5e7eb 0% 100%)';
  }

  const pending = (this.pendingTasks / total) * 100;
  const inProgress =
    (this.inProgressTasks / total) * 100;

  return `conic-gradient(
    #f59e0b 0% ${pending}%,
    #3b82f6 ${pending}% ${pending + inProgress}%,
    #10b981 ${pending + inProgress}% 100%
  )`;
}
}
