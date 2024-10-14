import { CanActivateFn } from '@angular/router';
import { inject } from "@angular/core";
import { Router } from '@angular/router';
import { TokenService } from "../services/token.service";
// import { JwtHelperService } from '@auth0/angular-jwt';

export const AuthGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const routerService = inject(Router);
  const token = tokenService.getToken();
  // const jwtHelper = new JwtHelperService();
  const isExpired = tokenService.isTokenExpired(token);
  if (isExpired) {
    tokenService.removeToken();
    return routerService.createUrlTree(['/auth/login']);
  }
  if (!token) {
    return routerService.createUrlTree(['/auth/login']);
  }
  return true;



};
