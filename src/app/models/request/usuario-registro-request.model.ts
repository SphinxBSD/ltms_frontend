export interface usuarioRegistroRequest {
    //Datos de usuario
    username: string;
    email: string;
    password: string;
    rol: string;
    //Datos personales
    nombres: string;
    paterno: string;
    materno: string;
    ci: number;
    fechaNac: string;
    direccion: string;
    celular: string;
    estado: string;
}