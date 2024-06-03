import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { BooksListComponent } from '../common/books-list/books-list.component';
import { ProfileViewComponent } from '../common/profile-view/profile-view.component';
import { BookMetaComponent } from '../common/book-meta/book-meta.component';
import { adminGuard } from '../shared/guards/admin-auth/admin.guard';
import { BookViewComponent } from '../common/book-view/book-view.component';
import { CollectionComponent } from '../common/collection/collection.component';

const routes = [
  {
    path: 'home',
    loadComponent: () => AdminDashboardComponent,
  },
  {
    path: 'users',
    loadComponent: () => UserListComponent,
  },
  {
    path: 'books',
    loadComponent: () => BooksListComponent,
  },
  {
    path: 'create-user',
    loadComponent: () => ProfileViewComponent,
  },
  {
    path: 'edit-user/:id',
    loadComponent: () => ProfileViewComponent,
  },
  {
    path: 'profile',
    loadComponent: () => ProfileViewComponent,
  },
  {
    path: 'create-book',
    loadComponent: () => BookMetaComponent,
  },
  {
    path: 'view-book-details/:id',
    loadComponent: () => BookMetaComponent,
  },
  {
    path: 'book/:id',
    loadComponent: () => BookViewComponent,
  },
  {
    path: "collection",
    loadComponent : () => CollectionComponent
  }
] as Routes;

export default () => {
  for (let ele of routes) {
    ele.canActivate = [adminGuard];
  }
  return routes;
};
