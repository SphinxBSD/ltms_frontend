
export class Vehiculo {
    idVehiculo!: number;
    placa!: string;
    marca!: string;
    tipo!: 'CAMION' | 'FURGONETA' | 'REMOLQUE' | 'CISTERNA' | 'CAMIONETA';
    modelo!: string;
    anio!: number;
    numeroSerie!: string;
    procedencia!: string;
    estado!: string;
    imagenes!: string[];
}