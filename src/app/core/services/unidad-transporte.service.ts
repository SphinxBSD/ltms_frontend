import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadTransporteService {

  private apiUrl: string = `${environment.API_URL}/unidades-transporte`;

  constructor(private http: HttpClient) { }

  getUnidadesTransporte(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  actualizarUnidadTransporte(unidadTransporte: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${unidadTransporte.idUnidadTransporte}`, unidadTransporte);
  }

  eliminarUnidadTransporte(idUnidadTransporte: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idUnidadTransporte}`);
  }
}
