import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employees } from './pages/employees/employees';
import { Tasks } from './pages/tasks/tasks';

export const routes: Routes = [
    {path:'',component:Dashboard},
    { path: 'dashboard', component: Dashboard },
  { path: 'employees', component: Employees },
  { path: 'tasks', component: Tasks },
  { path: '**', redirectTo: 'dashboard' }
];
