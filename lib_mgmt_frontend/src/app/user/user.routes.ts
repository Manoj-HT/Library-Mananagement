import { Routes } from '@angular/router';
import { userGuard } from '../shared/guards/user-auth/user.guard';
import { CollectionComponent } from '../common/collection/collection.component';
import { BookViewComponent } from '../common/book-view/book-view.component';
import { ProfileViewComponent } from '../common/profile-view/profile-view.component';
import { BooksListComponent } from '../common/books-list/books-list.component';
import { BookMetaComponent } from '../common/book-meta/book-meta.component';

const routes = [
  {
    path: 'home',
    loadComponent: () => CollectionComponent,
  },
  {
    path: 'profile',
    loadComponent: () => ProfileViewComponent,
  },
  {
    path: 'books',
    loadComponent: () => BooksListComponent,
  },
  {
    path: 'book/:id',
    loadComponent: () => BookMetaComponent,
  },
  {
    path: 'last/:id',
    loadComponent: () => BookViewComponent,
  },
] as Routes;

export default () => {
  for (let ele of routes) {
    ele.canActivate = [userGuard];
  }
  return routes;
};
