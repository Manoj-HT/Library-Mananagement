import { Component, inject, signal } from '@angular/core';
import { FormElements } from '../../shared/components/form-elements/form_elements';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authServices/authentication.service';
import { Book } from '../../shared/models/book';
import { ApiService } from '../../shared/services/api/api.service';
import { SingleSelectType } from '../../shared/components/form-elements/single-select/single-select.component';
import { Person } from '../../shared/models/person';

@Component({
  selector: 'book-meta',
  standalone: true,
  imports: [FormElements],
  templateUrl: './book-meta.component.html',
  styleUrl: './book-meta.component.scss',
})
export class BookMetaComponent {
  heading!: string;
  routeService = inject(Router);
  fb = inject(FormBuilder);
  metaForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    shortDescription: ['', Validators.required],
    genre: ['', Validators.required],
  });
  title!: string;
  isPages = signal(true);
  isEditContent = signal(false);
  state!: 'create' | 'edit' | 'view';
  private api = inject(ApiService);
  textContentForm = this.fb.group({
    id: this.routeService.url.split('/')[3],
    text: [''],
  });
  ngOnInit(): void {
    this.findRoute();
  }

  authService = inject(AuthenticationService);
  viewBook() {
    if (this.authService.getRole()().admin) {
      this.routeService.navigate(['/admin/book/bId23p26']);
    }
    if (this.authService.getRole()().reader) {
      this.routeService.navigate(['/reader/last/bId23p26']);
    }
  }

  findRoute() {
    let url = this.routeService.url;
    switch (url.split('/')[2]) {
      case 'create-book':
        this.initialiseForCreateBook();
        break;
      case 'view-book-details':
        this.initialiseForEditBook();
        break;
      case 'book':
        this.initialiseForBookView();
        break;
    }
  }
  initialiseForCreateBook() {
    this.isPages.set(false);
    this.heading = 'Create Book';
    this.buttonText = 'Publish';
    this.state = 'create';
    this.getAllAdmins();
  }

  adminOptions: SingleSelectType = {
    keyToDisplay: 'name',
    dataArray: [],
  };
  adminOptionSignal = signal(this.adminOptions);
  getAllAdmins() {
    this.api.getAllAdminList().subscribe({
      next: (res) => {
        this.adminOptionSignal.update((admin) => {
          admin = {
            ...admin,
            dataArray: res,
          };
          return admin;
        });
      },
    });
  }

  getHeading(e: Event, text: 'title' | 'author') {
    switch (text) {
      case 'author':
        this.author = (e as unknown as Person).name;
        break;
      case 'title':
        let input = e.target as HTMLInputElement;
        this.heading = input.value;
        this.title = input.value;
        if (input.value == '') {
          this.heading = 'Book';
          this.title = 'Book';
        }
        break;
    }
  }

  book!: Book;
  getBookById() {
    let id = this.routeService.url.split('/')[3];
    this.api.getBook(id).subscribe({
      next: (res) => {
        this.book = res;
        this.heading = this.title = res.title;
        this.author = res.author.name;
        this.metaForm.setValue({
          title: res.title,
          author: res.author.name,
          shortDescription: res.shortDescription,
          genre: res.genre,
        });
      },
    });
  }

  getBookContent() {
    let id = this.routeService.url.split('/')[3];
    this.api.getBookContent(id).subscribe({
      next: (res) => {
        this.textContentForm.get('text')?.setValue(res.text);
      },
    });
  }

  updateBookContent() {
    let id = this.routeService.url.split('/')[3];
    let body = {
      id: this.textContentForm.controls.id.value as string,
      text: this.textContentForm.controls.text.value as string,
    };
    this.api.updateBookContent(body).subscribe({
      next: (res) => {},
    });
  }

  author!: string;
  initialiseForEditBook() {
    this.isPages.set(false);
    this.isEditContent.set(true);
    this.buttonText = 'Update';
    this.state = 'edit';
    this.getBookById();
    this.getBookContent();
  }

  buttonText!: string;
  initialiseForBookView() {
    this.buttonText = 'read';
  }

  buttonAction() {
    switch (this.state) {
      case 'create':
        this.createBook();
        break;
      case 'edit':
        this.editBook();
        break;
    }
  }

  createSendObject() {
    return {
      ...this.book,
      title: this.metaForm.controls.title.value as string,
      author: this.metaForm.controls.author.value as string,
      shortDescription: this.metaForm.controls.shortDescription.value as string,
      genre: this.metaForm.controls.genre.value as string,
    } as unknown as Book;
  }
  createBook() {
    this.api.createBook(this.createSendObject()).subscribe({
      next: (res) => {
        this.routeService.navigate(['/admin/books']);
      },
    });
  }

  editBook() {
    this.api.editBook(this.createSendObject()).subscribe({
      next: (res) => {
        this.routeService.navigate(['/admin/books']);
      },
    });
  }
}
