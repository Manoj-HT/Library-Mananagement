import { Injectable, inject } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book';
import { Person } from '../../models/person';
import { Collection } from '../../models/collection';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
private config = inject(ConfigService)
private http = inject(HttpClient)
getDashboardDetails(){
  let bookListUrl = this.config.prefix+this.config.api.booksList
  let usersList = this.config.prefix+this.config.api.usersList
  return forkJoin([this.http.get<Book[]>(bookListUrl), this.http.get<Person[]>(usersList)])
}

getUserList(){
  let url = this.config.prefix+this.config.api.usersList
  return this.http.get<Person[]>(url)
}

createUser(person : Person){
  let url = `${this.config.prefix}${this.config.api.createUser}`
  return this.http.post<Person>(url, person)
}

getUserDetails(id : string){
  let url = `${this.config.prefix}${this.config.api.userDetails}?id=${id}`
  return this.http.get<Person>(url)
}

updateUser(person : Person){
  let url = `${this.config.prefix}${this.config.api.updateUser}?id=${person.id}`
  return this.http.put<Person>(url, person)
}

getAllAdminList(){
  let url = `${this.config.prefix}${this.config.api.getAllAdminList}`
  return this.http.get<Person[]>(url)
}

deleteUser(id : string){
  let url = `${this.config.prefix}${this.config.api.userDetails}?id=${id}`
  return this.http.delete<ApiResponse>(url)
}

getBooksList(){
  let url = `${this.config.prefix}${this.config.api.booksList}`
  return this.http.get<Book[]>(url)
}

getBook(id : string){
  let url = `${this.config.prefix}${this.config.api.bookDetails}?id=${id}`
  return this.http.get<Book>(url)
}

getBookContent(id : string){
  let url = `${this.config.prefix}${this.config.api.getBookContent}?id=${id}`
  return this.http.get<{text : string}>(url)
}

updateBookContent(body : {id : string; text : string}){
  let url = `${this.config.prefix}${this.config.api.updateBookContent}`
  return this.http.put<ApiResponse>(url,body)
}

createBook(book : Book){
  let url = `${this.config.prefix}${this.config.api.createBook}`
  return this.http.post<Book>(url, book)
}

editBook(book : Book){
  let url = `${this.config.prefix}${this.config.api.updateBook}?id=${book.id}`
  return this.http.put<Book>(url, book)
}

deleteBook(id : string){
let url = `${this.config.prefix}${this.config.api.bookDetails}?id=${id}`
return this.http.delete<ApiResponse>(url)
}

getCollectionList(){
  let url = `${this.config.prefix}${this.config.api.collectionList}`
  return this.http.get<Collection[]>(url)
}

createCollection(collection : Collection){
  let url = `${this.config.prefix}${this.config.api.createCollection}`
  return this.http.post<ApiResponse>(url, collection)
}

getCollection(id : string){
  let url = `${this.config.prefix}${this.config.api.collectionDetails}?id=${id}`
  return this.http.get<Collection>(url)
}

updateCollection(collection: Collection){
  let url = `${this.config.prefix}${this.config.api.updateCollection}?id=${collection.id}`
  return this.http.put<ApiResponse>(url, collection)
}

deleteCollection(id: string){
  let url = `${this.config.prefix}${this.config.api.collectionDetails}?id=${id}`
  return this.http.delete<ApiResponse>(url)
}

partialSearchByName(searchValue : string){
  let url = `${this.config.prefix}${this.config.api.partialSearchByName}?search=${searchValue}`
  return this.http.get<Book[]>(url)
}

readBook(){
  let url = `${this.config.prefix}${this.config.api.partialSearchByName}?bookId={bookId}&userId={userId}`
  this.http.get(url)
}

mapBookToUser(userId: string, bookId: string){
  let url = `${this.config.prefix}${this.config.api.mapBookToUser}?userId=${userId}&bookId=${bookId}`
  return this.http.get<Book>(url)
}

getPageByPageNumber(bookId: string, pg1: number, pg2: Number){
  let url = `${this.config.prefix}${this.config.api.pageByPageNumber}?bookId=${bookId}&firstPage=${pg1}&secondPage=${pg2}`
  return this.http.get<{page1: string; page2: string}>(url)
}
  
}

export type ApiResponse = {
  message : string;
}