
import { Component, signal, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService} from '../../services/tasks.service';
import { CreateTaskRequest } from '../../models/task';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,JsonPipe],
  templateUrl: './task-add.html',
  styleUrl: './task-add.scss'
})
export class TaskAdd {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private taskService = inject(TaskService);

  saving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  apiResponse = signal<any | null>(null);

  taskForm = this.fb.group({
    task: ['', Validators.required],
    description: ['', Validators.required],
    status: ['pending', Validators.required]
  });

  saveTask(): void {
    if (this.taskForm.invalid || this.saving()) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.getRawValue();

    const taskData: CreateTaskRequest = {
      todo: formValue.task!.trim(),
      state: formValue.status!,
      closed: formValue.status === 'completed',
      userId: '1'
    };

    this.saving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.apiResponse.set(null);

    this.taskService.addTask(taskData).subscribe({
      next: (response) => {
        this.apiResponse.set(response);
        this.successMessage.set('Task submitted successfully!');
        this.saving.set(false);

        console.log('API response:', response);
      },
      error: (error) => {
        console.error('Create task API error:', error);
        this.errorMessage.set(
          'Unable to submit the task. Please try again.'
        );
        this.saving.set(false);
      }
    });
  }

  goToTasks(): void {
    this.router.navigate(['/tasks']);
  }
}
