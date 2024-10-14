import { Persona } from './persona.model';
export class Usuario {
    id: number = 0;
    username!: string;
    email!: string;
    password!: string;
    rol!: string;
    persona!: Persona;
}