export interface UsuarioReadDTO {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  correo: string;
  rol: string;
  grupo: string;
  estado: boolean;
  foto?: string; 
  nombreCompleto?: string;
}

export interface UsuarioCreateDTO {
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  correo: string;
  idRol: number;
  idGrupo: number;
}

export interface UsuarioUpdateDTO {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  correo: string;
  idRol: number;
  idGrupo: number;
}
