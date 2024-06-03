import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { FormElements } from '../../shared/components/form-elements/form_elements';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../authServices/authentication.service';
import { Router } from '@angular/router';
const password_login_imports = [FormElements];

@Component({
  selector: 'password-login',
  standalone: true,
  imports: [password_login_imports],
  templateUrl: './password-login.component.html',
  styleUrl: './password-login.component.scss',
})
export class PasswordLoginComponent {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  authService = inject(AuthenticationService);
  route = inject(Router);
  button = viewChild<ElementRef>('loginButton');

  login() {
    let btn = this.button()?.nativeElement as HTMLButtonElement;
    btn.innerText = 'Please Wait';
    btn.disabled = true;
    let loginCredentials = {
      email: this.form.controls.email.value as string,
      password: this.form.controls.password.value as string,
    };
    this.authService.login(loginCredentials).subscribe({
      next: (res) => {
        this.authService.setRole(res.role);
        this.authService.setId(res.id)
        this.authService.registerLogin(res).subscribe({
          next: () => {
            if (res.role == 'admin') {
              this.route.navigate(['/admin/home']);
            }
            if (res.role == 'reader') {
              this.route.navigate(['/reader/home']);
            }
          },
        });
      },
      error: (error) => {
        btn.disabled = false;
        btn.innerText = 'Sign In';
        this.authService.invalidUser.set(true);
      },
    });
  }
}
