export interface UsuarioListarResponse {
    //Datos de usuario
    idUsuario: number;
    username: string;
    email: string;
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
    profileImage: string;
}