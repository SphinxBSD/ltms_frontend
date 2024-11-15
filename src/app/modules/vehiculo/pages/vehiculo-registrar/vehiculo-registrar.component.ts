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
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { Vehiculo } from '../../../../models/vehiculo.model';
import { VehiculoService } from '../../../../core/services/vehiculo.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculo-registrar',
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
    MatCardModule,
    MatGridListModule
  ],
  templateUrl: './vehiculo-registrar.component.html',
  styleUrl: './vehiculo-registrar.component.css'
})
export class VehiculoRegistrarComponent {

  vehiculo: Vehiculo;
  imagenesPreview: any[] = [];
  imagenes: File[] = [];
  vehiculoEstados: string[] = ['ACTIVO', 'INACTIVO'];
  vehiculoTipos: string[] = ['CAMION', 'FURGONETA', 'REMOLQUE', 'CISTERNA', 'CAMIONETA'];

  constructor(
    private vehiculoService: VehiculoService
  ){
    this.vehiculo = new Vehiculo();
  }

  onSubmit(vehiculoForm: NgForm): void {
    if (this.imagenes.length < 3) {
      Swal.fire({
        title: 'Error',
        text: 'Debe subir al menos 3 imágenes del vehículo',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    if (vehiculoForm.valid){
      // console.log('Registrando conductor');
      // console.log(typeof(vehiculoForm.value));
      this.vehiculoService.registrarVehiculo(vehiculoForm, this.imagenes).subscribe(
        {
          next: (response) => {
            Swal.fire({
              title: 'Vehículo registrado',
              text: 'El vehículo ha sido registrado correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.limpiar(vehiculoForm);
          },
          error: (error) => {
            Swal.fire({
              title: 'Error al registrar vehículo',
              text: 'Ha ocurrido un error al registrar el vehículo',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      );
    }
  }

  limpiar(vehiculoForm: NgForm): void {
    vehiculoForm.reset();
    vehiculoForm.resetForm();
    this.imagenes = [];
    this.imagenesPreview = [];
    // this.profileImage.clearImage();
  }

  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.match(/image\/*/) && file.size >= 5 * 1024 * 1024) {
          Swal.fire({
            title: 'Error',
            text: 'Solo se permiten imágenes PNG, JPEG o JPG y deben ser menores a 5MB',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          return;
        }
        this.imagenes.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenesPreview.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  eliminarImagen(index: number): void {
    this.imagenes.splice(index, 1);
    this.imagenesPreview.splice(index, 1);
  }
  
}
