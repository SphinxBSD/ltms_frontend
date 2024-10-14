import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule, 
    MatButtonModule,
    MatIconModule, 
    MatSidenavModule, 
    MatTableModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent {
  
}
