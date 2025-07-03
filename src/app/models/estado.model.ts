export interface EstadoCuentaDTO {
  mes: string;
  estadoPago: string;
  fechaPago?: string | null;  // DateOnly no existe en TS, usa string ISO o null
  monto?: number | null;
  metodo?: string | null;
  observaciones?: string | null;
}

export interface EstadoCuentaIntegranteDTO {
  idUsuario: number;
  nombreCompleto: string;
  mes: string;
  estadoPago: string;
  fechaPago?: string | null;
  monto?: number | null;
  metodo?: string | null;
  observaciones?: string | null;
}
export interface EstadoCuentaAgrupadoDTO {
  idUsuario: number;
  nombreCompleto: string;
  detalles: EstadoCuentaDTO[];
}
