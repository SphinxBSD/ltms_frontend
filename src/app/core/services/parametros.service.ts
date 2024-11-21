import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  private rutaPathUrl: string = `${environment.API_URL}/rutas`;
  private productoPathUrl: string = `${environment.API_URL}/productos`;
  private plantaPathUrl: string = `${environment.API_URL}/plantas`;

  constructor(private http: HttpClient) { }

  // SERVICIOS DE RUTAS
  getRutas(): Observable<any> {
    return this.http.get<any>(this.rutaPathUrl);
  }

  actualizarRuta(ruta: any): Observable<any> {
    return this.http.put<any>(`${this.rutaPathUrl}/${ruta.idRuta}`, ruta);
  }

  eliminarRuta(idRuta: number): Observable<any> {
    return this.http.delete<any>(`${this.rutaPathUrl}/${idRuta}`);
  }
  // ------------------


  // SERVICIOS DE PRODUCTOS
  getProductos(): Observable<any> {
    return this.http.get<any>(this.productoPathUrl);
  }

  actualizarProducto(producto: any): Observable<any> {
    return this.http.put<any>(`${this.rutaPathUrl}/${producto.idProducto}`, producto);
  }

  eliminarProducto(idProducto: number): Observable<any> {
    return this.http.delete<any>(`${this.rutaPathUrl}/${idProducto}`);
  }
  // ------------------
}
