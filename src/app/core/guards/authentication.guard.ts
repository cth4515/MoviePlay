import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  Route
} from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { map, catchError, take } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthenticationGuard implements CanActivate, CanLoad {
  isAuth: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  canLoad(route: Route): Observable<boolean> {
    return this.IsAuthenticated().pipe(take(1));
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log("Inside Auth Guard");
    return this.IsAuthenticated(state);
  }

  private IsAuthenticated(state?: RouterStateSnapshot) {
    return this.authenticationService.isAuthenticated.pipe(
      map(e => {
        if (e) {
          return true;
        } else {
          this.router.navigate(["/login"], {
            queryParams: { returnUrl: state.url }
          });
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(["/login"]);
        return of(false);
      })
    );
  }
}
