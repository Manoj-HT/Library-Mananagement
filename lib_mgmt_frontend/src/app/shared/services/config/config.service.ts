import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  prefix = 'http://localhost:5000';
  api = {
    login: '/login',
    updateLoginStatus: '/update-login-status',
    usersList: '/users-list',
    getAllAdminList: '/admin-list',
    createUser: '/create-user',
    updateUser: '/update-user',
    userDetails: '/user',
    booksList: '/books-list',
    createBook: '/create-book',
    bookDetails: '/book',
    updateBook: '/update-book',
    updateBookContent: '/update-book-content',
    getBookContent: '/book-content',
    collectionList: '/collections-list',
    createCollection: '/create-collection',
    collectionDetails: '/collection',
    updateCollection: "/update-collection",
    partialSearchByName: "/partial-search-by-name",
    mapBookToUser: "/map-book-to-user",
    pageByPageNumber: "/book-by-page-number"
  };
}
