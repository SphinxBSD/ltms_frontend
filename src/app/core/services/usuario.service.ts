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
  private usuarios: Usuario[] = [
    {
      id: 1,
      username: 'userpro',
      email: 'jon@gmail.com',
      password: '123',
      rol: 'admin',
      persona: {
        id: 1,
        nombres: 'John Jaime',
        paterno: 'Walt',
        materno: 'Disney',
        ci: 123456,
        fechaNacimiento: new Date(1990, 5, 20),
        direccion: 'Av. America',
        celular: 123456,
        estado: 'activo',
        profile: 'assets/images/profile1.jpg',
      }
    },
    {
      id: 2,
      username: 'alfred.doe',
      email: 'alfred@gmail.com',
      password: 'password1',
      rol: 'editor',
      persona: {
        id: 2,
        nombres: 'Alfred',
        paterno: 'Doe',
        materno: 'Smith',
        ci: 654321,
        fechaNacimiento: new Date(1985, 10, 15),
        direccion: 'Calle Central #123',
        celular: 789012,
        estado: 'activo',
        profile: 'assets/images/profile1.jpg',
      }
    },
    {
      id: 3,
      username: 'pedro123',
      email: 'pedro@gmail.com',
      password: 'mypassword',
      rol: 'user',
      persona: {
        id: 3,
        nombres: 'Pedro',
        paterno: 'Gomez',
        materno: 'Rodriguez',
        ci: 789456,
        fechaNacimiento: new Date(1993, 2, 25),
        direccion: 'Av. Libertad #456',
        celular: 345678,
        estado: 'activo',
        profile: 'assets/images/profile1.jpg',
      }
    },
    {
      id: 4,
      username: 'karina.doe',
      email: 'karina@gmail.com',
      password: 'karina123',
      rol: 'admin',
      persona: {
        id: 4,
        nombres: 'Karina',
        paterno: 'Doe',
        materno: 'Perez',
        ci: 321654,
        fechaNacimiento: new Date(1991, 7, 10),
        direccion: 'Av. Independencia #789',
        celular: 987654,
        estado: 'activo',
        profile: 'assets/images/profile1.jpg',
      }
    },
    {
      id: 5,
      username: 'maria.hernandez',
      email: 'maria@gmail.com',
      password: 'maria456',
      rol: 'user',
      persona: {
        id: 5,
        nombres: 'Maria',
        paterno: 'Hernandez',
        materno: 'Lopez',
        ci: 852369,
        fechaNacimiento: new Date(1996, 1, 17),
        direccion: 'Calle Flores #12',
        celular: 654987,
        estado: 'activo',
        profile: 'assets/images/profile1.jpg',
      },
    },
    {
      id: 6,
      username: 'carlos1988',
      email: 'carlos@gmail.com',
      password: 'carlospass',
      rol: 'editor',
      persona: {
        id: 6,
        nombres: 'Carlos',
        paterno: 'Sanchez',
        materno: 'Martinez',
        ci: 147258,
        fechaNacimiento: new Date(1988, 9, 30),
        direccion: 'Av. del Sol #101',
        celular: 321789,
        estado: 'activo',
        profile: 'assets/images/profile1.jpg',
      },
    },
    {
      id: 7,
      username: 'laura.gonzalez',
      email: 'laura@gmail.com',
      password: 'laura789',
      rol: 'admin',
      persona: {
        id: 7,
        nombres: 'Laura',
        paterno: 'Gonzalez',
        materno: 'Ramirez',
        ci: 963258,
        fechaNacimiento: new Date(1992, 4, 5),
        direccion: 'Calle Oro #35',
        celular: 852741,
        estado: 'activo',
        profile: 'assets/images/profile1.jpg',
      }
    },
    {
      id: 8,
      username: 'juan.perez',
      email: 'juan@gmail.com',
      password: 'juan123',
      rol: 'user',
      persona: {
        id: 8,
        nombres: 'Juan',
        paterno: 'Perez',
        materno: 'Gonzalez',
        ci: 456123,
        fechaNacimiento: new Date(1990, 11, 22),
        direccion: 'Av. Victoria #456',
        celular: 741852,
        estado: 'activo',
        profile: 'assets/images/profile1.jpg',
      },
    },
    {
      id: 9,
      username: 'sophia.martinez',
      email: 'sophia@gmail.com',
      password: 'sophia456',
      rol: 'editor',
      persona: {
        id: 9,
        nombres: 'Sophia',
        paterno: 'Martinez',
        materno: 'Lopez',
        ci: 951753,
        fechaNacimiento: new Date(1995, 6, 30),
        direccion: 'Calle Luna #78',
        celular: 963258,
        estado: 'activo',
        profile: 'assets/images/profile1.jpg',
      }
    },
    {
      id: 10,
      username: 'diego.flores',
      email: 'diego@gmail.com',
      password: 'diego123',
      rol: 'admin',
      persona: {
        id: 10,
        nombres: 'Diego',
        paterno: 'Flores',
        materno: 'Rojas',
        ci: 159753,
        fechaNacimiento: new Date(1987, 3, 12),
        direccion: 'Av. Estrella #90',
        celular: 789456,
        estado: 'activo',
        profile: 'assets/images/profile1.jpg',
      }
    }
  ];
  

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  findAll(): Observable<Usuario[]> {
    return of(this.usuarios);
  }

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
    formData.append('fechaNac', usuario.fechaNacimiento);
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
