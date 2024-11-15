import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

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
import {MatDividerModule} from '@angular/material/divider';

import { Vehiculo } from '../../../../models/vehiculo.model';
import { VehiculoService } from '../../../../core/services/vehiculo.service';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculo-informacion',
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
    MatGridListModule,
    MatDividerModule
  ],
  templateUrl: './vehiculo-informacion.component.html',
  styleUrl: './vehiculo-informacion.component.css'
})
export class VehiculoInformacionComponent implements OnInit {
  vehiculo: Vehiculo;
  imagenesPreview: any[] = [];
  imagenes: File[] = [];
  vehiculoEstados: string[] = ['ACTIVO', 'INACTIVO'];
  vehiculoTipos: string[] = ['CAMION', 'FURGONETA', 'REMOLQUE', 'CISTERNA', 'CAMIONETA'];

  isEditar: boolean = false;
  imagenesUrl: { nombre: string; url: SafeUrl }[] = [];

  constructor(
    private route: ActivatedRoute,
    private vehiculoService: VehiculoService,
    private sanitizer: DomSanitizer
  ){
    this.vehiculo = new Vehiculo();
  }

  ngOnInit(): void {
      const idVehiculo = this.route.snapshot.paramMap.get('idVehiculo');
      this.vehiculoService.getInfoVehiculo(Number(idVehiculo)).subscribe(
        {
          next: (response) => {
            this.vehiculo = response;
            this.cargarImagenes();
            // console.log(this.vehiculo);
          },
          error: (error) => {
            Swal.fire({
              title: 'Error al obtener información del vehículo',
              text: 'Ha ocurrido un error al obtener la información del vehículo',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      );
  }

  cargarImagenes(): void {
    this.imagenesUrl = [];
    this.vehiculo.imagenes.forEach((nombreImagen) => {
      this.vehiculoService
        .obtenerImagen(this.vehiculo.placa, nombreImagen)
        .subscribe({
          next: (blob) => {
            const url = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(blob)
            );
            this.imagenesUrl.push({ nombre: nombreImagen, url: url });
          },
          error: (err) => {
            console.error(err);
            // Manejo de errores
          },
        });
    });
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

  eliminarImagen(nombreImagen: string): void {
    // this.vehiculoService
    //   .eliminarImagen(this.idVehiculo, nombreImagen)
    //   .subscribe({
    //     next: () => {
    //       // Actualizar la lista de imágenes
    //       this.vehiculo.imagenes = this.vehiculo.imagenes.filter(
    //         (img) => img !== nombreImagen
    //       );
    //       this.imagenesUrl = this.vehiculo.imagenes.map((img) =>
    //         this.obtenerUrlImagen(img)
    //       );
    //     },
    //     error: (err) => {
    //       console.error(err);
    //       // Manejo de errores
    //     },
    //   });
  }

  subirNuevaImagen(event: any): void {
    // const archivo = event.target.files[0];
    // if (archivo) {
    //   this.vehiculoService.subirImagen(this.idVehiculo, archivo).subscribe({
    //     next: (data) => {
    //       this.vehiculo = data;
    //       this.imagenesUrl = this.vehiculo.imagenes.map((img) =>
    //         this.obtenerUrlImagen(img)
    //       );
    //     },
    //     error: (err) => {
    //       console.error(err);
    //       // Manejo de errores
    //     },
    //   });
    // }
  }
}
