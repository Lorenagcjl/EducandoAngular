export interface MensajeDTO {
  idMensaje: number;
  idRemitente: number;
  idDestinatario: number;
  contenido: string;
  fechaEnvio: string;
  remitenteNombre: string;
  destinatarioNombre: string;
  remitenteFotoUrl?: string; 
}

export interface MensajeCreacionDTO {
  idDestinatario: number;
  contenido: string;
}

export interface MensajeEdicionDTO {
  idMensaje: number;
  contenido: string;
}