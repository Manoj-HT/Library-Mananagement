import { Component, inject } from '@angular/core';
import { booksList, Book } from '../../shared/models/book';
import { FormElements } from '../../shared/components/form-elements/form_elements';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api/api.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'books-list',
  standalone: true,
  imports: [FormElements, RouterLink, DatePipe],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.scss',
})
export class BooksListComponent {
  booksList = [...booksList];
  private fb = inject(FormBuilder);
  form = this.fb.group({
    book: [''],
  });
  router = inject(Router);
  arrayCopy = JSON.parse(JSON.stringify(this.booksList));
  private api = inject(ApiService);
  ngOnInit(): void {
    this.getBookList();
  }

  getBookList() {
    this.api.getBooksList().subscribe({
      next: (res) => {
        this.booksList = res;
      },
    });
  }

  search(e: Event) {
    console.log((e.target as HTMLInputElement).value);
    let term = (e.target as HTMLInputElement).value;
    this.booksList = this.arrayCopy;
    this.booksList = this.booksList.filter((item: Book) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  deleteBook(id: string) {
    this.api.deleteBook(id).subscribe({
      next: (res) => {
        this.getBookList()
      },
    });
  }
  getBook(book: Book) {
    console.log("calling");
    this.router.navigate(['/admin/view-book-details', book.id]);
  }
}
