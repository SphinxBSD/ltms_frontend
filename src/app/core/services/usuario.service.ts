import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { Observable, of, throwError} from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from '../environment';
import { usuarioRegistroRequest } from '../../models/request/usuario-registro-request.model';
import { usuarioRegistroResponse } from '../../models/response/usuario-registro-response';
import { UsuarioListarResponse } from '../../models/response/usuario-listar-response.model';
import { PageResponse } from '../../models/response/page-response.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = `${environment.API_URL}/usuario`;
  

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }


  registrarUsuario(usuario: usuarioRegistroRequest, profileImage: File): Observable<usuarioRegistroResponse> {
    const formData: FormData = new FormData();
    // Añadir los campos del usuario al FormData
    formData.append('username', usuario.username);
    formData.append('email', usuario.email);
    formData.append('celular', usuario.celular);
    formData.append('ci', usuario.ci.toString());
    formData.append('direccion', usuario.direccion);
    formData.append('nombres', usuario.nombres);
    formData.append('paterno', usuario.paterno);
    formData.append('materno', usuario.materno);
    formData.append('rol', usuario.rol);
    formData.append('fechaNac', usuario.fechaNac);
    formData.append('profileImage', profileImage, profileImage.name);
    return this.http.post<usuarioRegistroResponse>(this.url + '/registrar', formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllUsuarios(page: number, size: number): Observable<PageResponse<UsuarioListarResponse>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PageResponse<UsuarioListarResponse>>
    (this.url + '/showAllUsers', { params });
  }

  disableUser(userId: number): Observable<any> {
    return this.http.delete(`${this.url}/${userId}/disable`, { responseType: 'text' });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.url}/${userId}/delete`, { responseType: 'text' });
  }

  getUsuarioProfile(): Observable<UsuarioListarResponse> {
    return this.http.get<UsuarioListarResponse>(`${this.url}/getProfile`);
  }

  actualizarDatosUsuario(idUsuario:number, usuario: usuarioRegistroRequest): Observable<any> {
    return this.http.put(`${this.url}/actualizar/${idUsuario}`, usuario);
  }

  actualizarImagenPerfil(idUsuario: number, profileImage: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('profileImage', profileImage, profileImage.name);
    return this.http.put(`${this.url}/actualizar/${idUsuario}/imagen`, formData);
  }

  actualizarPassword(currentPassword: string, newPassword: string): Observable<any> {
    const payload = { currentPassword, newPassword };
    return this.http.put(`${this.url}/actualizar/password`,  payload );
  }
  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 400) {
        errorMessage = error.error; // Asumiendo que el backend retorna un mensaje de error simple
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor, inicia sesión de nuevo.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
      }
    }
    return throwError(() => errorMessage);
  }

}
