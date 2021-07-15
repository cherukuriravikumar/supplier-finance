import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // unauthorized route check
    const isUnauthorizedOnly =
      route.data.roles.length === 1 && route.data.roles[0] === 'UNAUTHORIZED';

    const redirectRoute = isUnauthorizedOnly ? '/dashboard' : '/sign-in';
    const forbiddenRoute = '/forbidden';

    return this.authService.user$.pipe(
      map((user) => {
        if (user && !isUnauthorizedOnly) {
          if (route.data.roles.includes(user.userType)) {
            return true;
          }
          this.router.navigate([forbiddenRoute]);
          return false;
        } else if (!user && isUnauthorizedOnly) {
          return true;
        } else {
          this.router.navigate([redirectRoute]);
          return false;
        }
      })
    );
  }
}
