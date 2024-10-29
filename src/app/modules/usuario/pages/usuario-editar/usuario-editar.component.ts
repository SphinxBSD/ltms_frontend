import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
import { Usuario } from '../../../../models/usuario.model';
import { Persona } from '../../../../models/persona.model';
import { UsuarioListarResponse } from '../../../../models/response/usuario-listar-response.model';
import { UsuarioService } from '../../../../core/services/usuario.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { usuarioRegistroRequest } from '../../../../models/request/usuario-registro-request.model';
import { UpdatePasswordComponent } from '../../components/update-password/update-password.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-usuario-editar',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    UpdatePasswordComponent
],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*', opacity: 1
      })),
      state('out', style({
        height: '0px', opacity: 0
      })),
      transition('in <=> out', animate('300ms ease-in-out'))
    ])
  ],
  templateUrl: './usuario-editar.component.html',
  styleUrl: './usuario-editar.component.css'
})
export class UsuarioEditarComponent implements OnInit {
  usuario: Usuario = new Usuario();
  persona: Persona = new Persona();
  usuarioProfile: UsuarioListarResponse;
  tempDate: Date | null = null;
  saveProfileImg: boolean = false;

  imagePreview: string | ArrayBuffer | null = null;
  readonly startDate = new Date(1990, 0, 1);
  selectedFile: File | null = null;

  mostrarForm: boolean = false;

  constructor(private route: ActivatedRoute, private location: Location, private usuarioService: UsuarioService) {
    this.usuarioProfile = {
      idUsuario: 0,
      username: '',
      nombres: '',
      paterno: '',
      materno: '',
      email: '',
      rol: '',
      ci: 0,
      fechaNac: '',
      direccion: '',
      celular: '',
      estado: '',
      profileImage: '',
    }
  }

  ngOnInit(): void {
    this.usuarioService.getUsuarioProfile().subscribe(
      {
        next: (response) => {
          this.usuarioProfile = response;
          this.tempDate = new Date(response.fechaNac);
          this.imagePreview = (response.profileImage);
          // console.log(this.usuarioProfile);
          // console.log(response.fechaNac);
          // console.log(this.tempDate);
        },
        error: (error) => {
          console.error(error);
        },
      }
    );
    this.usuario.persona = this.persona;
    const navigation = this.location.getState() as any;
    if (navigation.usuario) {
      // this.usuario = navigation.usuario;
      console.log(this.usuario);
    } else {
      // const userId = this.route.snapshot.paramMap.get('id');
      // Logic to fetch the user by ID (not implemented)
    }
  }

  onSubmit(userForm: NgForm): void {
    if (userForm.valid) {
      Swal.fire({
        title: "Desea actualizar sus datos?",
        text: "Los cambios se guardaran permanentemente!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, actualizar!"
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Enviando datos');
          console.log(this.usuarioProfile);
          // Format the selected date before sending it to the backend
          const formattedDate = moment.default(userForm.value.fechaNac).format('YYYY-MM-DD');
          console.log(formattedDate);

          var usuarioRequest: usuarioRegistroRequest = userForm.value;
          usuarioRequest.fechaNac = formattedDate;
          
          this.usuarioService.actualizarDatosUsuario(this.usuarioProfile.idUsuario, usuarioRequest).subscribe({
            next: (response) => {
              Swal.fire({
                title: "Actualizado!",
                text: "Se actualizaron sus datos.",
                icon: "success"
              });
              console.log(response);
            },
            error: (error) => {
              Swal.fire({
                title: "Error",
                text: 'Ocurrió un error al actualizar sus datos.',
                icon: "error"
              });
              console.error(error);
            }
          });

          
        }
      });
      
    }

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
        if (typeof reader.result === 'string') {
          // console.log('string');
          this.usuarioProfile.profileImage = reader.result;
          this.saveProfileImg = true;
        }
        // this.usuarioProfile.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getImageSrc(base64Image: string): string {
    // Assuming you have a way to determine the image type
    let mimeType = 'image/jpeg'; // Default to jpeg, adjust this as necessary
  
    // You could add logic to determine MIME type based on content or file extension
    if (base64Image.startsWith('/9j/')) {
      mimeType = 'image/jpeg';
      return `data:${mimeType};base64,${base64Image}`;
    } else if (base64Image.startsWith('iVBORw0KGgo')) {
      mimeType = 'image/png';
      return `data:${mimeType};base64,${base64Image}`;
    }
    return `${base64Image}`;
  }

  saveProfileImage(idUsuario: number): void {
    Swal.fire({
      title: "Desea actualizar la foto de perfil?",
      text: "Se eliminara la foto de perfil actual!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, actualizar!"
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.selectedFile){
          this.usuarioService.actualizarImagenPerfil(idUsuario, this.selectedFile).subscribe({
            next: (response) => {
              console.log(response);
              this.saveProfileImg = false;
            },
            error: (error) => {
              console.error(error);
            }
          });
        }else{
          Swal.fire({
            title: "Error",
            text: 'Debe seleccionar una imagen de perfil.',
            icon: "error"
          });
        }
        
        Swal.fire({
          title: "Actualizado!",
          text: "Se actualizo su foto de perfil.",
          icon: "success"
        });
      }
    });
  }

  mostrarActualizarPassword() {
    this.mostrarForm = !this.mostrarForm;
  }
}
