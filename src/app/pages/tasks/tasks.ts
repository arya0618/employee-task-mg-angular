import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/tasks.service';
import {TitleCasePipe }  from "@angular/common"
import { RouterLink } from '@angular/router';
import { Task } from '../../models/task';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, TitleCasePipe,RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
 private cdr = inject(ChangeDetectorRef);
  tasks: Task[] = [];
  searchText = '';
  selectedStatus = '';
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.errorMessage = '';

    this.taskService.getTasks().subscribe({
      next: (response) => {
        
         if (Array.isArray(response?.data)) {
          this.tasks = response.data;
        } else {
          this.tasks = [];
        }

        this.loading = false;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Task API error:', error);
        this.errorMessage = 'Unable to load tasks. Please try again.';
        this.loading = false;
         this.cdr.detectChanges();
      }
    });
  }

  get filteredTasks(): any[] {
    return this.tasks.filter((task) => {
      const title = String( task.todo ?? '');
      const matchesSearch = title
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      const status = this.getStatus(task);
      const matchesStatus =
        !this.selectedStatus || status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  getStatus(task: any): string {
    if (task.state) {
      return String(task.state).toLowerCase();
    }
console.log("task :: ",task)
    if (task.completed === true) {
      return 'completed';
    }

    if (task.completed === false) {
      return 'pending';
    }

    return 'unknown';
  }

  getTaskTitle(task: any): string {
    return  task.todo ?? 'Untitled task';
  }

  getTaskDescription(task: any): string {
    return task.description ?? task.body ?? 'No description available';
  }

  getTaskId(task: any): string | number {
    return task.id ?? '—';
  }
}