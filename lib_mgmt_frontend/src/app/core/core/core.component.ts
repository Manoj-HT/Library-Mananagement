import { Component, inject } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { NavService } from '../../navigation/nav-service/nav.service';
import { filter } from 'rxjs';
import { NavBarComponent } from '../../navigation/nav-bar/nav-bar.component';

@Component({
  selector: 'core',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
})
export class CoreComponent {
  navService = inject(NavService);
  isNav = this.navService.getNavigationState();
  routeService = inject(Router);
  ngOnInit(): void {
    this.routeService.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe({
        next: (e) => {
          this.navService.currentRoute((e as NavigationEnd).url);
        },
      });
  }
}
