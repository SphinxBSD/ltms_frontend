import { Component } from '@angular/core';
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
  ],
  templateUrl: './usuario-registrar.component.html',
  styleUrl: './usuario-registrar.component.css'
})
export class UsuarioRegistrarComponent {
  usuario: Usuario;
  selectedFile: File | null = null;
  usuarioRegistroRequest: usuarioRegistroRequest;
  imagePreview: string | ArrayBuffer | null = null;
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
      fechaNacimiento: '',
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
    const formattedDate = moment.default(userForm.value.fechaNacimiento).format('YYYY-MM-DD');
    console.log(formattedDate);
    if (userForm.valid || this.selectedFile) {
      // console.log('Enviando datos');
      this.usuarioRegistroRequest = userForm.value;
      this.usuarioRegistroRequest.fechaNacimiento = formattedDate;
      // console.log(this.usuarioRegistroRequest);
      if (this.selectedFile) {
        this.usuarioService.registrarUsuario(this.usuarioRegistroRequest, this.selectedFile).subscribe({
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
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Opcional: Validar el tipo y tamaño del archivo
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          title: "Aviso",
          text: 'Solo se permiten imágenes PNG, JPEG o JPG.',
          icon: "warning"
        });
        this.selectedFile = null;
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        Swal.fire({
          title: "Aviso",
          text: 'La imagen debe ser menor a 5MB.',
          icon: "warning"
        });
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
      // Generar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

}
