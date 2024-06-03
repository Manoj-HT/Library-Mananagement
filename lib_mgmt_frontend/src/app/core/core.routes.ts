import { Routes } from '@angular/router';
import { LoginPageComponent } from '../authentication/login-page/login-page.component';
import ADMIN_ROUTES from '../admin/admin.routes';
import USER_ROUTES from '../user/user.routes'
export default [
  {
    path: 'login',
    loadComponent: () => LoginPageComponent,
  },
  {
    path: 'admin',
    loadChildren: () => ADMIN_ROUTES(),
  },
  {
    path: 'reader',
    loadChildren: () => USER_ROUTES(),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
] as Routes;
