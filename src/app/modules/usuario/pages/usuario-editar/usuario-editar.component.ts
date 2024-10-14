import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
import { Usuario } from '../../../../models/usuario.model';
import { Persona } from '../../../../models/persona.model';

@Component({
  selector: 'app-usuario-editar',
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
  ],
  templateUrl: './usuario-editar.component.html',
  styleUrl: './usuario-editar.component.css'
})
export class UsuarioEditarComponent implements OnInit {
  usuario: Usuario = new Usuario();
  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    const navigation = this.location.getState() as any;
    if (navigation.usuario) {
      this.usuario = navigation.usuario;
      console.log(this.usuario);
    } else {
      // const userId = this.route.snapshot.paramMap.get('id');
      // Logic to fetch the user by ID (not implemented)
    }
  }

  onSubmit(userForm: NgForm): void {
    if (userForm.valid) {
      console.log('Enviando datos');
      console.log(this.usuario);
    }
    userForm.reset();
    userForm.resetForm();
  }
  limpiar(userForm: NgForm): void {
    userForm.reset();
    userForm.resetForm();
  }
}
