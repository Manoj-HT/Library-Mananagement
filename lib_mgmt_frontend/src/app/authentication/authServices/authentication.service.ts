import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Person, Role } from '../../shared/models/person';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../shared/services/config/config.service';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  roleObject = {
    admin: false,
    reader: false,
  };
  role = signal(this.roleObject);
  getRole() {
    if (localStorage.getItem('role')) {
      this.role.update((state) => {
        let roleName = localStorage.getItem('role') as Role;
        state = {
          ...this.roleObject,
          [roleName]: true,
        };
        return state;
      });
    }
    return this.role;
  }

  setRole(roleState: Role) {
    this.role.update((role) => {
      (role = {
        ...this.roleObject,
        [roleState]: true,
      }),
        localStorage.setItem('role', roleState);
      return role;
    });
  }

  invalidUser = signal(false);

  id = signal('');
  getId() {
    this.id.update((i) => {
      i = localStorage.getItem('id') as string;
      return i;
    });
    return this.id();
  }

  setId(id: string) {
    this.id.update((i) => {
      localStorage.setItem('id', id);
      return i;
    });
  }

  registerLogin(res: Person) {
    let url = `${this.config.prefix}${this.config.api.updateLoginStatus}?id=${res.id}`;
    return this.http.put<{ message: string }>(url, {});
  }

  login(loginCredentials: { email: string; password: string }) {
    let url = this.config.prefix + this.config.api.login;
    return this.http.post<Person>(url, loginCredentials).pipe(
      map((res) => {
        let result = res as unknown as loginType;
        localStorage.setItem('token', result.token);
        return res;
      })
    );
  }

  private router = inject(Router);
  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

export type loginType = Person & {
  token: string;
};
