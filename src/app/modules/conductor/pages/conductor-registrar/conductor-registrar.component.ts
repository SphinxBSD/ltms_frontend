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

import { Conductor } from '../../../../models/conductor.model';
import { ConductorService } from '../../../../core/services/conductor.service';
import { UploadProfileComponent } from '../../../commons/upload-profile/upload-profile.component';

import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-conductor-registrar',
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
    UploadProfileComponent
  ],
  templateUrl: './conductor-registrar.component.html',
  styleUrl: './conductor-registrar.component.css'
})
export class ConductorRegistrarComponent {

  conductor: Conductor;
  readonly startDate = new Date(1990, 0, 1);

  @ViewChild(UploadProfileComponent) profileImage!: UploadProfileComponent;  

  constructor(
    private conductorService: ConductorService
  ){
    this.conductor = new Conductor();
  }



  onSubmit(condutorForm: NgForm): void {
    // Format the selected date before sending it to the backend
    if (condutorForm.valid || this.profileImage.selectedFile) {
      condutorForm.value.fechaNac = moment.default(condutorForm.value.fechaNac).format('YYYY-MM-DD');
      condutorForm.value.fechaContrato = moment.default(condutorForm.value.fechaContrato).format('YYYY-MM-DD');
      if (this.profileImage.selectedFile) {
        console.log('Registrando conductor');
        console.log(condutorForm.value);
        this.conductorService.registrarConductor(condutorForm, this.profileImage.selectedFile).subscribe({
          next: (response) => {
            Swal.fire({
              title: "Registro exitoso",
              text: response.message,
              icon: "success"
            });
            this.limpiar(condutorForm);
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

  limpiar(condutorForm: NgForm): void {
    condutorForm.reset();
    condutorForm.resetForm();
    this.profileImage.clearImage();
  }
}
