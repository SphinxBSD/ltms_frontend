import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

import { Conductor } from '../../../../models/conductor.model';
import { ConductorService } from '../../../../core/services/conductor.service';

import Swal from 'sweetalert2';
import * as moment from 'moment';

import { ConductorDocumentosComponent } from '../../components/conductor-documentos/conductor-documentos.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-conductor-informacion',
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
    RouterLink,
    ConductorDocumentosComponent
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
  templateUrl: './conductor-informacion.component.html',
  styleUrl: './conductor-informacion.component.css'
})
export class ConductorInformacionComponent implements OnInit{

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  saveProfileImg: boolean = false;

  isEditar: boolean = false;
  showDocs: boolean = false;

  conductor: Conductor = new Conductor();
  readonly startDate = new Date(1990, 0, 1);

  constructor(
    private conductorService: ConductorService,
    private route: ActivatedRoute,
  ){ }

  ngOnInit(): void {
    const idConductor = this.route.snapshot.paramMap.get('idConductor');
    this.conductorService.getConductorById(Number(idConductor)).subscribe(
      response => {
        this.conductor = response;
      });
  }

  onSubmit(conductorForm: NgForm){
    // console.log(conductorForm.value);
    if (conductorForm.valid) {
      Swal.fire({
        title: "Desea actualizar los datos del conducor?",
        text: "Los cambios se guardaran permanentemente!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, actualizar!"
      }).then((result) => {
        if (result.isConfirmed) {
          // console.log('Enviando datos');
          // console.log(this.conductor);
          // Format the selected date before sending it to the backend
          conductorForm.value.fechaNac = moment.default(conductorForm.value.fechaNac).format('YYYY-MM-DD');
          conductorForm.value.fechaContrato = moment.default(conductorForm.value.fechaContrato).format('YYYY-MM-DD');
          // console.log(conductorForm.value.fechaNac);
          // console.log(conductorForm.value.fechaContrato);

          this.conductorService.actualizarDatosConductor(this.conductor.idConductor, conductorForm).subscribe({
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
          this.conductor.profile = reader.result;
          this.saveProfileImg = true;
        }
        // this.usuarioProfile.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfileImage(idConductor: number): void {
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
          this.conductorService.actualizarImagenPerfil(idConductor, this.selectedFile).subscribe({
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

  mostrarDocumentos(): void {
    this.showDocs = !this.showDocs;
  }
}
