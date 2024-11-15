import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../environment';
import { NgForm } from '@angular/forms';
import { registroResponse } from '../../models/response/registro-response.model';
import { Vehiculo } from '../../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private url = `${environment.API_URL}/vehiculo`;

  constructor(private http: HttpClient) { }

  getVehiculos(page: number, size: number, sort: string, order: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('order', order);
    
    return this.http.get<any>(`${this.url}/showAllVehiculos`, { params });
  }

  registrarVehiculo(vehiculoForm: NgForm, imagenes: File[]): Observable<registroResponse> {
    //Crear un nuevo form data
    const formData = new FormData();

    //Agregar el vehiculo
    formData.append('placa', vehiculoForm.value.placa);
    formData.append('marca', vehiculoForm.value.marca);
    formData.append('modelo', vehiculoForm.value.modelo);
    formData.append('anio', vehiculoForm.value.anio);
    formData.append('estado', vehiculoForm.value.estado);
    formData.append('tipo', vehiculoForm.value.tipo);
    formData.append('numeroSerie', vehiculoForm.value.numeroSerie);
    formData.append('procedencia', vehiculoForm.value.procedencia);

    // Agregar las imágenes al FormData
    imagenes.forEach((imagen, index) => {
      formData.append('imagenes', imagen, imagen.name);
    });
    
    return this.http.post<registroResponse>(`${this.url}/registrar`, formData)
      .pipe(catchError(this.handleError));
  }


  getInfoVehiculo(idVehiculo: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.url}/getinfo/${idVehiculo}`)
      .pipe(catchError(this.handleError));
  }

  obtenerImagen(placa: string, nombreImagen: string): Observable<Blob> {
    const url = `${this.url}/imagenes/${placa}/${nombreImagen}`;
    return this.http.get(url, { responseType: 'blob' });
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
