
import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employees } from './pages/employees/employees';
import { Tasks } from './pages/tasks/tasks';

import { AuthService } from './services/auth.service';

const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard]    
  },
    {
    path: 'employee/:id',
    component: Employees,
    canActivate: [authGuard]
  },
  {
    path: 'employee',
    component: Employees,
    canActivate: [authGuard]
  },
  {
    path: 'tasks',
    component: Tasks,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
