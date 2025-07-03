export interface Rubro {
  idRubro: number;
  anio: number;
  mes: number;
  monto: number;
  iva: number; //agregado recientemente
  totalPagar: number, //agregado recientemente
  cuenta: string;
  tipoRubro: string;
  fechaMaximaPagar: Date;
  estado: string;
  idPago: number | null; 
}
