import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { usuarioRegistroRequest } from '../../../../models/request/usuario-registro-request.model';
import { Usuario } from '../../../../models/usuario.model';
import { Persona } from '../../../../models/persona.model';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { UploadProfileComponent } from '../../../commons/upload-profile/upload-profile.component';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-usuario-registrar',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    UploadProfileComponent],
  templateUrl: './usuario-registrar.component.html',
  styleUrl: './usuario-registrar.component.css'
})
export class UsuarioRegistrarComponent {
  usuario: Usuario;
  usuarioRegistroRequest: usuarioRegistroRequest;

  @ViewChild(UploadProfileComponent) profileImage!: UploadProfileComponent;

  readonly startDate = new Date(1990, 0, 1);

  constructor(
    private usuarioService: UsuarioService 
  ) {
    this.usuarioRegistroRequest = {
      username: '',
      email: '',
      password: '',
      rol: 'ROLE_USER',
      nombres: '',
      paterno: '',
      materno: '',
      ci: 0,
      fechaNac: '',
      direccion: '',
      celular: '',
      estado: '',
    }
    this.usuario = new Usuario();
    this.usuario.persona = new Persona();
  }

  salir(): void {
    console.log('Saliendo');
  }

  onSubmit(userForm: NgForm): void {
    // Format the selected date before sending it to the backend
    const formattedDate = moment.default(userForm.value.fechaNac).format('YYYY-MM-DD');
    // console.log(formattedDate);
    if (userForm.valid || this.profileImage.selectedFile) {
      // console.log('Enviando datos');
      this.usuarioRegistroRequest = userForm.value;
      this.usuarioRegistroRequest.fechaNac = formattedDate;
      // console.log(this.usuarioRegistroRequest);
      if (this.profileImage.selectedFile) {
        this.usuarioService.registrarUsuario(this.usuarioRegistroRequest, this.profileImage.selectedFile).subscribe({
          next: (response) => {
            
            Swal.fire({
              title: "Registro exitoso",
              text: response.message,
              icon: "success"
            });
            this.limpiar(userForm);
          },
          error: (error) => {
            Swal.fire({
              title: "Error",
              text: 'Ocurrió un error al registrar el usuario.',
              icon: "error"
            });
          }
        });
      } else {
        Swal.fire({
          title: "Error",
          text: 'Debe seleccionar una imagen de perfil.',
          icon: "error"
        });
      }
    }

  }

  limpiar(userForm: NgForm): void {
    userForm.reset();
    userForm.resetForm();
    this.profileImage.clearImage();
  }
}
