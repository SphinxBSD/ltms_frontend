import { Component, Input } from '@angular/core';

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

import { Carroceria } from '../../../../models/carroceria.model';
import { CarroceriaService } from '../../../../core/services/carroceria.service';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carroceria',
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
  templateUrl: './carroceria.component.html',
  styleUrl: './carroceria.component.css'
})
export class CarroceriaComponent {
  @Input() idVehiculo: number = 0;
  carroceria: Carroceria;
  imagenesPreview: any[] = [];
  imagenes: File[] = [];

  carroceriaTipos: string[] = ['VOLTEO', 'TANQUE', 'PORTACONTENEDORES', 'GRUA', 'TOLVA'];
  imagenesUrl: { nombre: string; url: SafeUrl }[] = [];

  isEditar: boolean = false;
  readonly startDate = new Date(2010, 0, 1);

  dia: Date = new Date();

  constructor(
    private carroceriaService: CarroceriaService,
    private sanitizer: DomSanitizer
  ){
    this.carroceria = new Carroceria();
  }

  ngOnInit(): void {
    this.carroceriaService.getCarroceria(this.idVehiculo).subscribe(
      {
        next: (response) => {
          this.carroceria = response;
          this.dia =  new Date(response.anioFab);
          this.dia = new Date( this.dia.setDate(this.dia.getDate() +1));
          this.carroceria.anioFab = this.dia;
          // console.log(this.carroceria);
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

  onSubmit(carroceriaForm: NgForm): void {
    
  }
  
  subirNuevaImagen(event: any): void {

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

  eliminarImagenR(index: number): void {
    this.imagenes.splice(index, 1);
    this.imagenesPreview.splice(index, 1);
  }

  eliminarImagenA(nombreImagen: string): void {
  }

  subirNuevaImagenA(event: any): void {

  }

  cargarImagenes(): void {
    this.imagenesUrl = [];
    this.carroceria.imagenes.forEach((nombreImagen) => {
      this.carroceriaService
        .obtenerImagen(this.carroceria.codigo, nombreImagen)
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
  
}
