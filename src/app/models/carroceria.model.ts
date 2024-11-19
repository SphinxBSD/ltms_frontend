
export class Carroceria {
  idCarroceria!: number;
  codigo!: string;
  capacidad!: number;
  anioFab!: Date;
  tipo!: 'VOLTEO' | 'TANQUE' | 'PORTACONTENEDORES' | 'GRUA' | 'TOLVA';
  idVehiculo!: number;
  imagenes!: string[];
}