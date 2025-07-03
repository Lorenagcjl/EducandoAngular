import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RubrosIntegranteComponent } from './rubros-integrante.component';
import { MisPagosComponent } from './mis-pagos.component';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, RubrosIntegranteComponent, MisPagosComponent],
  templateUrl: './pagos.component.html',
  styleUrls:['./pagos.component.css']
})
export class PagosComponent {
  activeTab: 'rubros' | 'pagos' = 'rubros';
   @ViewChild(MisPagosComponent) misPagosComponent!: MisPagosComponent;

   cambiarTab(tab: 'rubros' | 'pagos') {
    this.activeTab = tab;

    if (tab === 'pagos' && this.misPagosComponent) {
      this.misPagosComponent.cargarPagos(); //Recargar pagos al cambiar de pestaña
    }
  }
}

