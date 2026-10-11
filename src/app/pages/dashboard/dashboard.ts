
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); // added beacuse count not showing on dashboard web page
// spotlightEmployees: any[] = Employee[];
  totalEmployees = 0;
  activeEmployees = 0;
  totalTasks = 0;
  pendingTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;

  employeesLoaded = false;
  tasksLoaded = false;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadEmployees();
    this.loadTasks();
  }

  loadEmployees(): void {
    this.http.get<any>('https://dummyjson.com/users?limit=0')
      .subscribe({
        next: (response) => {
          this.totalEmployees = response.total;
          this.activeEmployees = response.users.length;

          console.log('Employee count:', this.totalEmployees);
          this.loading=false
            this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Employee API error:', error);
          this.errorMessage = 'Unable to load employee data.';
          this.employeesLoaded = true;
          this.checkLoading();
        },
        // complete: () => {
        //   this.employeesLoaded = true;
        //   this.checkLoading();
        // }
      });
  }

  loadTasks(): void {
    this.http.get<any>('https://dummyjson.com/todos?limit=0')
      .subscribe({
        next: (response) => {
          const tasks = response.todos;

          this.totalTasks = response.total;
          this.completedTasks =
            tasks.filter((task: any) => task.completed).length;
          this.pendingTasks =
            tasks.filter((task: any) => !task.completed).length;

          this.inProgressTasks = 4;
         this.loading=false
          console.log('Task count:', this.totalTasks);

  this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Task API error:', error);
          this.errorMessage = 'Unable to load task data.';
          this.tasksLoaded = true;
          this.checkLoading();
        },
     
      });
  }

  checkLoading(): void {
    console.log("--> ",this.employeesLoaded)
    this.loading = !(this.employeesLoaded && this.tasksLoaded);
        console.log("--===== ",this.loading)
        
  this.cdr.detectChanges();
  }
}
