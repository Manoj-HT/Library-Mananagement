import { Component, OnInit, inject } from '@angular/core';
import { NavService, RoutesList } from '../nav-service/nav.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../authentication/authServices/authentication.service';
import { ApiService } from '../../shared/services/api/api.service';

@Component({
  selector: '[nav-bar]',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  navService = inject(NavService);
  routeState = this.navService.routeState;
  router = inject(Router);
  nav_element = { ...this.navService.routesObject };
  authService = inject(AuthenticationService);
  userRole = this.authService.getRole();
  showHideDescription(element: RoutesList, state: boolean) {
    this.nav_element = {
      ...this.navService.routesObject,
    };
    this.nav_element[element] = state;
  }

  ngOnInit(){
    this.getUserById()
  }

  navigate(route: RoutesList) {
    if (this.userRole().admin) {
      this.router.navigate(['/admin/', route]);
    }
    if (this.userRole().reader) {
      if (route == 'last') {
        this.router.navigate([`/reader/last/b${this.bookId}s${this.studiedstate}`])
      } else {
        this.router.navigate(['/reader/', route]);
      }
    }
  }

  private api = inject(ApiService)
  profileImage!: string
  studiedstate!: string
  bookId!:string
  getUserById(){
    let id = this.authService.getId()
    this.api.getUserDetails(id).subscribe({
      next : (res) => {
        this.profileImage = res.profilePicture
        if(res.books.length != 0){
          this.studiedstate = String(res.books[res.books.length -1].studiedState)
          this.bookId = String(res.books[res.books.length -1].id)
        }
      }
    })
  }

  isToolBar = this.navService.getToolBarState();
  pageNavigation(direction : "next"|"prev"){
    this.isClick = {
      ...this.isClick,
      [direction] : true
    }
    this.navService.tools.next(this.isClick)
  }
  isClick = {
    next: false,
    prev: false,
  }
  isHover = {
    next: false,
    prev: false,
  };

  openProfile() {
    if (this.authService.getRole()().admin) {
      this.router.navigate(['/admin/profile']);
    }
    if (this.authService.getRole()().reader) {
      this.router.navigate(['/reader/profile']);
    }
  }
}
