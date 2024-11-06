import { Persona } from './persona.model';
export class Conductor {
    idConductor: number = 0;
    licencia!: string;
    descripcion!: string;
    estado!: string;
    fechaContrato!: Date;

    idPersona: number = 0;
    nombres!: string;
    paterno!: string;
    materno!: string;
    ci!: number;
    fechaNac!: Date;
    direccion!: string;
    celular!: Number;
    profile!: string;
}