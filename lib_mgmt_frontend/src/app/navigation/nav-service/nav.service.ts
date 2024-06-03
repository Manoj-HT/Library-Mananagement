import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private isNav = signal(true);

  setNavigation(state: boolean) {
    this.isNav.set(state);
  }

  getNavigationState() {
    return this.isNav;
  }

  private toolBarState = signal(false);
  tools = new BehaviorSubject<{next : boolean; prev: boolean}>({next : false, prev: false})
  resetTools(){
    this.tools.next({
      next : false,
      prev : false
    })
  }
  getToolBarState() {
    return this.toolBarState;
  }

  setToolBarState(state: boolean) {
    this.toolBarState.update((prevSate) => state);
  }

  routesObject = {
    home: false,
    users: false,
    books: false,
    collection: false,
    last: false,
  };

  routeState = signal(this.routesObject);

  currentRoute(url: string) {
    let route = url.split('/')[2] as RoutesList;
    this.routeState.update((routeState) => {
      routeState = {
        ...this.routesObject,
        [route]: true,
      };
      return routeState;
    });
  }
}

export type RoutesList =
  | 'home'
  | 'users'
  | 'books'
  | 'collection'
  | 'last'
  | 'collection';
