import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

import { Documento } from '../../models/documento.model';
import { DocumentoTipo } from '../../models/documento-tipo.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private apiUrl = `${environment.API_URL}/documento`;

  constructor(private http: HttpClient) {}

  getDocumentsByConductor(idConductor: number): Observable<Documento[]> {
    return this.http.get<Documento[]>(
      `${this.apiUrl}/entidad/${idConductor}?tipoEntidad=CONDUCTOR`
    );
  }

  getDocumentsByVehiculo(idConductor: number): Observable<Documento[]> {
    return this.http.get<Documento[]>(
      `${this.apiUrl}/entidad/${idConductor}?tipoEntidad=VEHICULO`
    );
  }

  createDocument(formData: FormData): Observable<Documento> {
    return this.http.post<Documento>(this.apiUrl + '/create', formData);
  }

  updateDocument(id: number, formData: FormData): Observable<Documento> {
    return this.http.put<Documento>(`${this.apiUrl}/update/${id}`, formData);
  }

  deleteDocument(idDocumento: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${idDocumento}`);
  }

  downloadDocument(id: number): Observable<Blob> {
    const headers = new HttpHeaders().set('Accept', '*/*'); // O el tipo de archivo específico
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      headers: headers,
      responseType: 'blob',
    });
  }

  getDocumentoTipos(): Observable<DocumentoTipo[]> {
    return this.http.get<DocumentoTipo[]>(`${this.apiUrl}/tipos`);
  }
}
