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
    fechaNacimiento: string;
    direccion: string;
    celular: string;
    estado: string;
}