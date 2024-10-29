import { Component, Input, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
import { FormGroup, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    // MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,

  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent {
  passwordForm!: FormGroup;
  isSubmitting: boolean = false;
  @Input() usuarioId!: number;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    if (newPassword !== confirmNewPassword) {
      form.get('confirmNewPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      return null;
    }
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    Swal.fire({
      title: '¿Está seguro de actualizar la contraseña?',
      showCancelButton: true,
      confirmButtonText: `Actualizar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Actualizar contraseña');
        // const currentPass = this.passwordForm.get('currentPassword')?.value;
        this.usuarioService.actualizarPassword(
          this.passwordForm.get("currentPassword")?.value,
          this.passwordForm.get("newPassword")?.value
        ).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            Swal.fire({
              title: "Contraseña actualizada",
              text: response.body,
              icon: "success"
            });
            this.passwordForm.reset();
          },
          error: (error) => {
            this.isSubmitting = false;
            let errorMessage = error.error.error || 'Error al actualizar la contraseña.';
            Swal.fire({
              title: "Error",
              text: errorMessage,
              icon: "error"
            });
          }
        });
      }
    });

    // const payload: UpdatePasswordPayload = {
    //   currentPassword: this.passwordForm.get('currentPassword')?.value,
    //   newPassword: this.passwordForm.get('newPassword')?.value
    // };

    // this.usuarioService.updatePassword(payload).subscribe({
    //   next: (response) => {
    //     this.isSubmitting = false;
    //     this.snackBar.open('Contraseña actualizada exitosamente.', 'Cerrar', { duration: 3000 });
    //     this.passwordForm.reset();
    //     this.router.navigate(['/profile']); // Cambia la ruta según tu configuración
    //   },
    //   error: (error) => {
    //     this.isSubmitting = false;
    //     const errorMessage = error.error.message || 'Error al actualizar la contraseña.';
    //     this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
    //   }
    // });
  }

  get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get confirmNewPassword() {
    return this.passwordForm.get('confirmNewPassword');
  }

}
