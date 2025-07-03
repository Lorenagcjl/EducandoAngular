export interface Pago {
  cuenta: string;
  motivo: string;
  metodoPago: string;
  valor: number;
  numeroComprobante: string;
  fechaTransaccion: string; // usar Date solo si vas a transformarlo
  imagenComprobante: File;
  estadoPago?: string;
  idRubro?: number;
  totalPagar?: number | null;
}
export interface PagoDetalleDTO {
  idPago: number;
  idUsuario: number;
  nombres: string;
  cuenta: string;
  motivo: string;
  metodoPago: string;
  valor: number | null;
  numeroComprobante: string;
  fechaTransaccion: string | null;
  imagenComprobante?: string | null;
  estadoPago?: string | null;
  fechaRegistro?: string | null;
  totalPagar?: number | null;
}
