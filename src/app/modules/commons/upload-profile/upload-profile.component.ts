import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './upload-profile.component.html',
  styleUrl: './upload-profile.component.css'
})
export class UploadProfileComponent {

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

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

  clearImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
  }
}
