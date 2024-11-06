import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../environment';
import { NgForm } from '@angular/forms';
import { registroResponse } from '../../models/response/registro-response.model';
import { Conductor } from '../../models/conductor.model';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {

  private url = `${environment.API_URL}/conductor`;

  constructor(private http: HttpClient) { }

  registrarConductor(conductor: NgForm, profileImage: File): Observable<registroResponse> {
    const formData: FormData = new FormData();
    // Añadir los campos del conductor al FormData
    // Datos de la persona
    formData.append('celular', conductor.value.celular);
    formData.append('ci', conductor.value.ci.toString());
    formData.append('direccion', conductor.value.direccion);
    formData.append('nombres', conductor.value.nombres);
    formData.append('paterno', conductor.value.paterno);
    formData.append('materno', conductor.value.materno);
    formData.append('fechaNac', conductor.value.fechaNac);
    formData.append('profileImage', profileImage, profileImage.name);
    // Datos del conductor
    formData.append('licencia', conductor.value.licencia);
    formData.append('descripcion', conductor.value.descripcion);
    formData.append('fechaContrato', conductor.value.fechaContrato);

    return this.http.post<registroResponse>(this.url + '/registrar', formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getConductores(page: number, size: number, sort: string, order: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('order', order);
    
    return this.http.get<any>(`${this.url}/showAllConductores`, { params });
  }

  getConductorById(id: number): Observable<Conductor> {
    return this.http.get<any>(`${this.url}/getConductor/${id}`);
  }

  actualizarImagenPerfil(idConductor: number, profileImage: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('profileImage', profileImage, profileImage.name);
    return this.http.put(`${this.url}/actualizar/${idConductor}/imagen`, formData);
  }

  actualizarDatosConductor(idConductor:number, conductor: NgForm): Observable<any> {
    return this.http.put(`${this.url}/actualizar/${idConductor}`, conductor.value);
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
