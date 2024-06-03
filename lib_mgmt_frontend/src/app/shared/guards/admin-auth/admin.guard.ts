import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem('role') !== 'admin') {
    new Router().navigate(['/login']);
  }
  return localStorage.getItem('role') === 'admin';
};
