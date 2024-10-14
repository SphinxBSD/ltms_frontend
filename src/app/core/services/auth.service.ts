import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { TokenService } from './token.service';
import { environment } from '../environment';
import { tap } from 'rxjs/operators';

import { LoginToken } from '../../models/auth.model';
import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private url = `${environment.API_URL}/auth/autenticar`;

  private authState = new BehaviorSubject<Usuario | null>(null);
  authState$ = this.authState.asObservable();

  constructor() { }

  login(username: string, password: string) {
    
    return this.http.post<LoginToken>(this.url, { username, password })
        .pipe(
            tap(response => this.tokenService.setToken(response.token))
        );
  }
}
