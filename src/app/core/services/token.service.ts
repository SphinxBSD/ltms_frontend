import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private jwtHelper!: JwtHelperService;
  cookieService = inject(CookieService);

  constructor() {
    this.jwtHelper = new JwtHelperService();
  }

  setToken(token: string) {
    // Guarda el token en las cookies
    this.cookieService.set('authToken', token, { path: '/', secure: true, sameSite: 'Strict' });
  }

  getToken() {
    // Obtén el token de las cookies
    return this.cookieService.get('authToken');
  }

  isAuthenticated(): boolean {
    // Verifica si el token está presente
    return !!this.getToken();
  }

  logout() {
    // Elimina el token de las cookies
    this.cookieService.delete('authToken', '/');
  }

  // Método para verificar si el token está expirado
  isTokenExpired(token: string | null): boolean {
    if (!token) {
      return true;
    }
    return this.jwtHelper.isTokenExpired(token);
  }

  removeToken() {
    // Elimina el token de las cookies
    this.cookieService.delete('authToken', '/');
  }


}
