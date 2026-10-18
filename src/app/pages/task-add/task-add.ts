
import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-add.html',
  styleUrl: './task-add.scss'
})
export class TaskAdd {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  successMessage = signal('');

  taskForm = this.fb.group({
    task: ['', Validators.required],
    description: ['', Validators.required],
    status: ['pending', Validators.required]
  });

  saveTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    // Frontend submission only; API integration can be added later.
    this.successMessage.set('Task form submitted successfully!');
  }

  goToTasks(): void {
    this.router.navigate(['/task']);
  }
}
