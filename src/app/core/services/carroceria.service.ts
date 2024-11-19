import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { NgForm } from '@angular/forms';
import { registroResponse } from '../../models/response/registro-response.model';
import { environment } from '../environment';
import { Carroceria } from '../../models/carroceria.model';

@Injectable({
  providedIn: 'root'
})
export class CarroceriaService {

  private url = `${environment.API_URL}/carroceria`;

  constructor(private http: HttpClient) { }

  getCarroceria(idVehiculo:number): Observable<Carroceria> {
    return this.http.get<Carroceria>(`${this.url}/getinfo/${idVehiculo}`);
  }

  obtenerImagen(codigo: string, nombreImagen: string): Observable<Blob> {
    const url = `${this.url}/imagenes/${codigo}/${nombreImagen}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  
}
