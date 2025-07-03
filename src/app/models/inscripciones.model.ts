export interface InscripcionDetalleDTO {
  idInscripcion: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  correo: string;
  observaciones: string;
  fechaRegistro: Date;
  estadoInscripcion?: string;
  idGrupo?: number;
  fechaResolucion: Date;
}
export interface AprobarInscripcionDTO {
  idInscripcion: number;
  aprobar: boolean;
}