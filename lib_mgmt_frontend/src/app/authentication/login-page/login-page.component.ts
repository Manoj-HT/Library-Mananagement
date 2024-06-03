import { Component, inject } from '@angular/core';
import { PasswordLoginComponent } from '../password-login/password-login.component';
import { NavService } from '../../navigation/nav-service/nav.service';
import { SVG } from '../../shared/svg/svg';
import { AuthenticationService } from '../authServices/authentication.service';
import { Router } from '@angular/router';
const login_page_imports = [PasswordLoginComponent, SVG];
@Component({
  selector: 'login-page',
  standalone: true,
  imports: [login_page_imports],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  navService = inject(NavService);
  ngOnInit(): void {
    this.navService.setNavigation(false);
    this.checkLoggedIn();
  }

  router = inject(Router);
  checkLoggedIn() {
    let role = localStorage.getItem('role');
    if (localStorage.getItem('role')) {
      switch (role) {
        case 'admin':
          this.router.navigate(['/admin/home']);
          break;
        case 'reader':
          this.router.navigate(['/reader/home']);
          break;
      }
    }
  }

  authService = inject(AuthenticationService);
  isInvalidUser = this.authService.invalidUser;
  ngOnDestroy(): void {
    this.navService.setNavigation(true);
  }
}
