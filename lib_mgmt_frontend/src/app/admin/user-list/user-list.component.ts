import { Component, inject } from '@angular/core';
import { FormElements } from '../../shared/components/form-elements/form_elements';
import { Person, usersList } from '../../shared/models/person';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api/api.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [FormElements, DatePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  usersList = [...usersList];
  private fb = inject(FormBuilder);
  form = this.fb.group({
    user: [''],
  });
  router = inject(Router);
  arrayCopy = JSON.parse(JSON.stringify(this.usersList));
  private api = inject(ApiService);
  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.api.getUserList().subscribe({
      next: (res) => {
        this.usersList = res;
      },
    });
  }

  search(e: Event) {
    console.log((e.target as HTMLInputElement).value);
    let term = (e.target as HTMLInputElement).value;
    this.usersList = this.arrayCopy;
    this.usersList = this.usersList.filter((item: Person) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  getUser(user: Person) {
    this.router.navigate(['/admin/edit-user', user.id]);
  }

  createUser() {
    this.router.navigate(['/admin/create-user']);
  }

  delete(id: string) {
    this.api.deleteUser(id).subscribe({
      next: (res) => {
        this.getAllUsers()
      },
    });
  }
}
