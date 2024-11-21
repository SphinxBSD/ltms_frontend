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
  selector: 'app-producto-card',
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
  templateUrl: './producto-card.component.html',
  styleUrl: './producto-card.component.css'
})
export class ProductoCardComponent {
  productos: any[] = [];
  
  constructor(private rutasService: ParametrosService) {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.rutasService.getProductos().subscribe((productos) => {
      this.productos = productos;
      this.productos = this.productos.map(ruta => ({...ruta, edit: false}));
    });
  }


  crearProducto(): void {
    const nombre = prompt('Ingrese el nombre de la nueva ruta:');
    if (nombre) {
      // const nuevaProducto: Producto = { id: Math.random(), nombre };
      // this.rutasService.agregarProducto(nuevaProducto);
      // this.productos.push(nuevaProducto);
      // this.snackBar.open('Producto agregada', 'Cerrar', { duration: 2000 });
    }
  }

  toggleEdit(ruta: any) {
    if (ruta.edit) {
      this.editarProducto(ruta);
    }
    ruta.edit = !ruta.edit;
  }
  
  editarProducto(ruta: any) {
    console.log(ruta.idProducto)
    this.rutasService.actualizarProducto(ruta).subscribe(() => {
      Swal.fire('Producto actualizado', '', 'success');
    });
  }
  
  eliminarProducto(ruta: any) {
    this.rutasService.eliminarProducto(ruta.idProducto).subscribe(() => {
      Swal.fire('Producto eliminado', '', 'success');
      this.obtenerProductos();
    });
  }
}
