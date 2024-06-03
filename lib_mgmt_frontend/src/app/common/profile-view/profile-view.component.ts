import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormElements } from '../../shared/components/form-elements/form_elements';
import { FormBuilder, Validators } from '@angular/forms';
import { SingleSelectType } from '../../shared/components/form-elements/single-select/single-select.component';
import { Book } from '../../shared/models/book';
import { AuthenticationService } from '../../authentication/authServices/authentication.service';
import { Person, Role } from '../../shared/models/person';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api/api.service';

@Component({
  selector: 'profile-view',
  standalone: true,
  imports: [FormElements],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
})
export class ProfileViewComponent {
  genderOption: SingleSelectType = {
    keyToDisplay: 'name',
    dataArray: [{ name: 'male' }, { name: 'female' }, { name: 'other' }],
  };
  roleOption: SingleSelectType = {
    keyToDisplay: 'name',
    dataArray: [{ name: 'admin' }, { name: 'reader' }],
  };
  roleOptionSignal = signal(this.roleOption);
  genderOptionsSignal = signal(this.genderOption);
  img = viewChild<ElementRef>('profilePicture');
  heading!: string;
  fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    gender: ['', Validators.required],
    role: ['', Validators.required],
  });
  isRemoveButton = signal(false);
  private api = inject(ApiService);
  private auth = inject(AuthenticationService);
  ngOnInit(): void {
    this.findRoute();
  }

  showRoleValue(e: Event) {}

  routeService = inject(Router);
  findRoute() {
    let url = this.routeService.url;
    let urlArray = url.split('/');
    switch (urlArray[2]) {
      case 'create-user':
        this.initialiseForCreateUser();
        break;
      case 'edit-user':
        this.initialiseForEditUser(urlArray[3]);
        break;
      case 'profile':
        this.initialiseForProfileView();
        break;
    }
  }

  books: Book[] = [];
  backgroundImage!: string;
  getGender(e: { name: 'male' | 'female' | 'other' }) {
    let img = this.img()?.nativeElement as HTMLImageElement;
    switch (e.name) {
      case 'male':
        img.src = 'male.svg';
        break;
      case 'female':
        img.src = 'female.svg';
        break;
      case 'other':
        img.src = 'other.svg';
        break;
    }
  }

  getUserById(id: string) {
    this.api.getUserDetails(id).subscribe({
      next: (res) => {
        this.currentUser = {
          ...res,
        };
        this.form.setValue({
          name: res.name,
          email: res.email,
          password: res.password,
          gender: res.gender,
          role: res.role,
        });
        this.getGender({ name: res.gender });
        this.getBookList(res.books);
      },
    });
  }

  initialiseForProfileView() {
    this.isView = true;
    this.heading = 'My Profile';
    this.getUserById(this.auth.getId());
    this.form.disable();
    this.backgroundImage = 'profile_view_background.svg';
  }

  isView = false;
  readOnly = false;
  isCard = signal(false);
  passwordField = viewChild<ElementRef>('passwordField');
  currentUser!: Person;
  initialiseForEditUser(id: string) {
    this.getUserById(id);
    let passField = this.passwordField()?.nativeElement as HTMLDivElement;
    passField.style.display = 'none';
    this.isView = false;
    this.isCard.set(true);
    this.heading = 'Edit User';
    this.backgroundImage = 'edit_user_background.svg';
  }

  getBookList(books: Book[]) {
    this.books = books
  }

  removeBookFromList(id: string, index: number) {
    let book = this.books[index];
    book = {
      ...book,
      offShelf: false,
      author: ' ' as unknown as Person,
    };
    new Observable<any>().subscribe({
      next: () => {
        this.books.splice(index, 1);
      },
    });
  }

  update(person: Person) {
    person = {
      ...person,
      profilePicture:
        person.gender == 'male'
          ? 'male.svg'
          : person.gender == 'female'
          ? 'female.svg'
          : 'other.svg',
    };
    this.api.updateUser(person).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  initialiseForCreateUser() {
    this.isView = false;
    this.heading = 'Create User';
    this.backgroundImage = 'create_user_background.svg';
  }

  create(person: Person) {
    person = {
      ...person,
      profilePicture:
        person.gender == 'male'
          ? 'male.svg'
          : person.gender == 'female'
          ? 'female.svg'
          : 'other.svg',
    };
    this.api.createUser(person).subscribe({
      next: (res) => {
        this.routeService.navigate(['/admin/users']);
      },
    });
  }

  editButtonText = 'Edit';
  roleField = viewChild<ElementRef>('roleField');
  editCurrentProfile() {
    this.editButtonText = 'Update';
    let role = this.roleField()?.nativeElement as HTMLDivElement;
    role.style.display = 'none';
    this.form.enable();
  }

  updateUser() {
    this.submit();
    this.editButtonText = 'Edit';
    this.form.disable();
  }

  submit() {
    let gender;
    if (
      (
        this.form.controls.gender.value as unknown as {
          name: 'male' | 'female' | 'other';
        }
      ).name
    ) {
      gender = (
        this.form.controls.gender.value as unknown as {
          name: 'male' | 'female' | 'other';
        }
      ).name;
    } else {
      gender = this.form.controls.gender.value as 'male' | 'female' | 'other';
    }
    let role;
    if (
      (
        this.form.controls.role.value as unknown as {
          name: Role;
        }
      ).name
    ) {
      role = (
        this.form.controls.role.value as unknown as {
          name: Role;
        }
      ).name;
    } else {
      role = this.form.controls.role.value as Role;
    }
    let person: Person = {
      ...this.currentUser,
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      gender,
      role,
    };

    person['books'] = this.books;
    let url = this.routeService.url.split('/')[2];
    if (url == 'edit-user') {
      this.update(person);
      this.routeService.navigate(['/admin/users']);
    }
    if (url == 'create-user') {
      this.create(person);
    }
    if (url == 'profile') {
      this.update(person);
    }
  }

  logOut() {
    this.authService.logOut();
  }

  viewBook(id: string) {
    if (this.authService.getRole()().admin) {
      this.routeService.navigate([`/admin/view-book-details/${id}`]);
    }
    if (this.authService.getRole()().reader) {
      this.routeService.navigate([`/reader/book/${id}`]);
    }
  }

  authService = inject(AuthenticationService);
  addBook() {
    if (this.authService.getRole()().admin) {
      this.routeService.navigate(['/admin/books']);
    }
    if (this.authService.getRole()().reader) {
      this.routeService.navigate(['/reader/books']);
    }
  }
}
