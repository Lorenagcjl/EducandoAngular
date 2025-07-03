// Interfaces básicas para tipado

export interface Integrante {
  idUsuario: number;
  nombreCompleto: string;
  cedula: string;
  correo: string;
  telefono: string;
  foto: string | null;
  tienePagoAprobado: boolean; 
}


export interface Asistencia {
  idEvento: number;
  idUsuario: number;
  estadoAsistencia: string;
}

export interface Evento {
  idEvento: number;
  nombreEvento: string;
  fechaEvento: string;
  estado: boolean;
}

export interface AsistenciaResumenDTO {
  idUsuario: number;
  nombreCompleto: string;
  fechaRegistro: string;
  idEvento: number;
  nombreEvento: string;
  fechaEvento: string; // usar string para fechas al recibir JSON (ej. "2025-06-17")
  estadoAsistencia: string;
}
