import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authServices/authentication.service';
import { Role } from '../../shared/models/person';
import { FormElements } from '../../shared/components/form-elements/form_elements';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../shared/services/api/api.service';
import { Collection } from '../../shared/models/collection';
import { Book } from '../../shared/models/book';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'collection',
  standalone: true,
  imports: [FormElements, DatePipe],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss',
})
export class CollectionComponent {
  private router = inject(Router);
  private auth = inject(AuthenticationService);
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  headingForm = this.fb.group({
    name: [''],
    search: [''],
  });
  collectionList!: Collection[];
  isCollectionEditCard = signal(false);
  isEdit = signal(false);
  ngOnInit(): void {
    this.findRoute();
    this.getCollectionList();
  }

  getCollectionList() {
    this.api.getCollectionList().subscribe({
      next: (res) => {
        this.collectionList = res;
      },
    });
  }

  role!: Role;
  findRoute() {
    let role = this.auth.getRole()();
    if (role.admin) {
      this.initializeForAdmin();
    } else {
      this.initializeForReader();
    }
  }

  readBook(bookId : string){
    let userId = this.auth.getId()
    this.api.mapBookToUser(userId, bookId).subscribe({
      next : (res) => {
        this.router.navigate([`/reader/last/b${res.id}s${res.studiedState}`])
      }
    })
  }

  createSendObject() {
    return {
      ...this.collection,
      name: this.headingForm.controls.name.value as string,
      books: this.booksInCollection,
    } as Collection;
  }

  collection!: Collection;
  booksInCollection: Book[] = [];
  booksInCollectionCopy: Book[] = [];
  getCollection(id: string) {
    this.api.getCollection(id).subscribe({
      next: (res) => {
        this.collection = res;
        this.booksInCollection = res.books;
        this.booksInCollectionCopy = JSON.parse(JSON.stringify(res.books));
        this.isCollectionEditCard.set(true);
        this.headingForm.get('name')?.setValue(res.name)
      },
    });
  }

  getCollectionForAdmin(id: string) {
    this.getCollection(id);
    this.isEdit.set(true);
  }

  removeBookInCollection(id: string) {
    let index = this.booksInCollection.findIndex((book) => book.id === id);
    this.booksInCollection.splice(index, 1);
  }

  addToBookCollection(id: string) {
    this.api.getBook(id).subscribe({
      next: (res) => {
        this.booksInCollectionCopy.push(res);
        this.isSearch.set(false);
        this.booksInCollection = JSON.parse(
          JSON.stringify(this.booksInCollectionCopy)
        );
      },
    });
  }

  editCollection() {
    this.api.updateCollection(this.createSendObject()).subscribe({
      next: (res) => {
        this.getCollectionList();
        this.isCollectionEditCard.set(false)
      },
    });
  }

  deleteCollection(id: string) {
    this.api.deleteCollection(id).subscribe({
      next: (res) => {
        this.getCollectionList();
      },
    });
  }

  addToCollection() {
    this.isCollectionEditCard.set(false);
    this.api.createCollection(this.createSendObject()).subscribe({
      next: (res) => {
        this.getCollectionList();
        this.isCollectionEditCard.set(false);
      },
    });
  }

  collectionDetails() {
    this.booksInCollection = []
    this.booksInCollectionCopy = []
    this.isCollectionEditCard.set(true);
    this.isEdit.set(false);
  }

  initializeForAdmin() {
    this.role = 'admin';
  }

  initializeForReader() {
    this.role = 'reader';
  }

  isSearch = signal(false);
  getSearchValue(e: Event) {
    let value = (e.target as HTMLInputElement).value;
    if (value == '') {
      this.booksInCollection = JSON.parse(
        JSON.stringify(this.booksInCollectionCopy)
      );
      this.isSearch.set(false);
      return;
    }
    this.api.partialSearchByName(value).subscribe({
      next: (res) => {
        this.booksInCollection = res;
        this.isSearch.set(true);
      },
    });
  }



  viewBook(id: string) {
    this.router.navigate(['/reader/book/',id]);
  }
}
