export interface Evento {
  idEvento: number;
  nombreEvento: string;
  descripcion?: string;
  fechaEvento: string;
  inicioEvento?: string;
  finEvento?: string;
  lugar?: string;
  maquillaje?: string;
  peinado?: string;
  estado?: boolean;
  nombreCreador?: string;
  imagenes?: string[];
}

export interface EventoImagen {
  id: number;
  idEvento: number;
  archivo: string;
}
