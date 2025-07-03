export interface Solicitud {
  idSolicitud: number;
  idUsuario: number;
  titulo: string;
  descripcion: string;
  archivo: string;
  fechaRegistro: string;
  estadoSolicitud: string;
  tipoDocumento: string;
}
export interface SolicitudListado {
  idSolicitud: number;
  titulo: string;
  descripcion: string;
  estadoSolicitud: string;
  fechaRegistro: string;
  nombreUsuario: string;
  idGrupo: number;
  tipoDocumento: string;
  archivo: string;
}
