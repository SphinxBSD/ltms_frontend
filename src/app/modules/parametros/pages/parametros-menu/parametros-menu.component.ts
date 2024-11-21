import { Component } from '@angular/core';
import { RutaCardComponent } from '../../components/ruta-card/ruta-card.component';
import { ProductoCardComponent } from '../../components/producto-card/producto-card.component';
import { PlantaCardComponent } from '../../components/planta-card/planta-card.component';

@Component({
  selector: 'app-parametros-menu',
  standalone: true,
  imports: [
    RutaCardComponent,
    ProductoCardComponent,
    PlantaCardComponent
  ],
  templateUrl: './parametros-menu.component.html',
  styleUrl: './parametros-menu.component.css'
})
export class ParametrosMenuComponent {

}
