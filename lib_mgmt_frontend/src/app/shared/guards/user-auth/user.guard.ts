import { CanActivateFn, Router } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem('role') !== 'reader') {
    new Router().navigate(['/login']);
  }
  return localStorage.getItem('role') === "reader";
};
