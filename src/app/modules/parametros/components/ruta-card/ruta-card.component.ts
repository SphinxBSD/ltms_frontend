import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametrosService } from '../../../../core/services/parametros.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ruta-card',
  standalone: true,
  imports: [
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './ruta-card.component.html',
  styleUrl: './ruta-card.component.css'
})
export class RutaCardComponent {
  rutas: any[] = [];
  
  constructor(private rutasService: ParametrosService) {
    this.obtenerRutas();
  }

  obtenerRutas(): void {
    this.rutasService.getRutas().subscribe((rutas) => {
      this.rutas = rutas;
      this.rutas = this.rutas.map(ruta => ({...ruta, edit: false}));
    });
  }


  crearRuta(): void {
    const nombre = prompt('Ingrese el nombre de la nueva ruta:');
    if (nombre) {
      // const nuevaRuta: Ruta = { id: Math.random(), nombre };
      // this.rutasService.agregarRuta(nuevaRuta);
      // this.rutas.push(nuevaRuta);
      // this.snackBar.open('Ruta agregada', 'Cerrar', { duration: 2000 });
    }
  }

  toggleEdit(ruta: any) {
    if (ruta.edit) {
      this.editarRuta(ruta);
    }
    ruta.edit = !ruta.edit;
  }
  
  editarRuta(ruta: any) {
    console.log(ruta.idRuta)
    this.rutasService.actualizarRuta(ruta).subscribe(() => {
      Swal.fire('Ruta actualizada', '', 'success');
    });
  }
  
  eliminarRuta(ruta: any) {
    this.rutasService.eliminarRuta(ruta.idRuta).subscribe(() => {
      Swal.fire('Ruta eliminada', '', 'success');
      this.obtenerRutas();
    });
  }
}
