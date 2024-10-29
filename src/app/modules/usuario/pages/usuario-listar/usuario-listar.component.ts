import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Usuario } from '../../../../models/usuario.model';
import { UsuarioService } from '../../../../core/services/usuario.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { UsuarioListarResponse } from '../../../../models/response/usuario-listar-response.model';
import { PageResponse } from '../../../../models/response/page-response.model';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuario-listar',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    RouterModule,
    MatTableModule,
    MatDividerModule,
    MatPaginatorModule,
  ],
  templateUrl: './usuario-listar.component.html',
  styleUrl: './usuario-listar.component.css'
})
export class UsuarioListarComponent implements OnInit {

  displayedColumns: string[] = ['username', 'nombres', 'paterno', 'materno', 'email', 'rol'];
  dataSource = new MatTableDataSource<UsuarioListarResponse>();
  totalUsuarios = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading = false;

  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: Usuario | null = new Usuario;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usuarioService: UsuarioService,
    private router: Router,
  ) {
    
  }

  salir(): void {
    console.log('Saliendo');
  }

  ngOnInit():void {
    this.loadUsers(this.pageIndex, this.pageSize);
  }

  loadUsers(page: number, size: number): void {
    this.isLoading = true;
    this.usuarioService.getAllUsuarios(page, size).subscribe({
      next: (data: PageResponse<UsuarioListarResponse>) => {
        this.dataSource.data = data.content;
        this.totalUsuarios = data.totalElements;
        // console.log(data);
      },
      error: (error) => {
        Swal.fire('Error', 'Error al cargar los usuarios', 'error');
      },
    });
  }

  onPaginateChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers(this.pageIndex, this.pageSize);
  }

  getImageSrc(base64Image: string): string {
    // Assuming you have a way to determine the image type
    let mimeType = 'image/jpeg'; // Default to jpeg, adjust this as necessary
  
    // You could add logic to determine MIME type based on content or file extension
    if (base64Image.startsWith('/9j/')) {
      mimeType = 'image/jpeg';
    } else if (base64Image.startsWith('iVBORw0KGgo')) {
      mimeType = 'image/png';
    }
  
    return `data:${mimeType};base64,${base64Image}`;
  }

  editUser(usuario: Usuario): void {
    // console.log('listar');
    // console.log(this.listaUsuarios);
    this.router.navigate(['admin/usuarios/editar'], { state: { usuario } });
    console.log('Editando usuario');
  }
  removeUser(id: number): void {
    console.log('Eliminando usuario');
      Swal.fire({
        title: 'Eliminar usuario',
        text: '¿Está seguro de eliminar el usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'No, Cancelar!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with user deletion
          this.usuarioService.deleteUser(id).subscribe({
            next: (response) => {
              Swal.fire("Exito", response, 'warning');
              this.loadUsers(this.pageIndex, this.pageSize);
            },
            error: (err) => {
              console.log(err);
              Swal.fire('Error', 'Error al eliminar el usuario', 'error');
            },
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'El usuario no fue eliminado :)',
            'error'
          );
        }
      });
  }

  disableUser(id: number): void {
    console.log('Eliminando usuario');
      Swal.fire({
        title: 'Deshabilitar usuario',
        text: '¿Está seguro de deshabilitar este usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deshabilitar!',
        cancelButtonText: 'No, Cancelar!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with user deletion
          this.usuarioService.disableUser(id).subscribe({
            next: (response) => {
              Swal.fire("Exito", response, 'warning');
              this.loadUsers(this.pageIndex, this.pageSize);
            },
            error: (err) => {
              console.log(err);
              Swal.fire('Error', 'Error al deshabilitar el usuario', 'error');
            },
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'El usuario no fue deshabilitado :)',
            'error'
          );
        }
      });
  }


}
