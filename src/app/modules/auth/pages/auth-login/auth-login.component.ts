import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FooterComponent } from '../../../../shared/footer/footer.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FooterComponent,
  ],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css'
})
export class AuthLoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  hidePass = true;

  constructor() {}

  userForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.userForm.valid) {
      // this.showSpinner = true;
      const { username, password } = this.userForm.getRawValue();
      this.auth.login(username, password)
        .subscribe({
          next: () => {
            console.log('Login success');
            this.router.navigate(['/admin']);
          },
          error: () => {
            // this.showSpinner = false;
            this.openSnackBar('Invalid credentials', 'Close');
          }
        });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 5000 });
  }
}
