import { CanActivateFn } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Inject, inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(AuthService).isAuthenticated();
};

/**
import { Injectable } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export const authGuard: CanActivateFn = (route, state) => {
  constructor(private authService: AuthService, private router: Router){};
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean {
      console.log('CanActivate called');
    let isLoggedIn = this.authService.isAuthenticated();
    if (isLoggedIn){
      return true
    } else {
      this.router.navigate(['/contact']);
    }
  }
  
}

 */