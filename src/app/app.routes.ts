import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { ResetRequestComponent } from './auth/reset-request/reset-request.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardInstructorComponent } from './dashboard-instructor/dashboard-instructor.component';
import { DashboardIntegranteComponent } from './dashboard-integrante/dashboard-integrante.component';
import { ActivarCuentaComponent } from './components/activar-cuenta/activar-cuenta.component';
import { CalendarioEventosComponent } from './components/calendario-eventos.component';
import { PagosComponent } from './pages/pagos/pagos.component';
import { AdminPagosComponent } from './pages/admin/admin-pagos.component';
import { AsistenciasContainerComponent } from './asistencias-container/asistencias-container.component';
import { ResumenIntegranteComponent } from './resumen-integrante/resumen-integrante.component';
import { AdminPeriodosComponent } from './admin-periodos/admin-periodos.component';
import { InscripcionesComponent } from './pages/instructor/inscripciones.component';
import { HomeComponent } from './pages/home.component';
import { DocumentosComponent } from './admin/documentos.component';
import { MisSolicitudesComponent } from './solicitudes/mis-solicitudes/mis-solicitudes.component';
import { AdminSolicitudesComponent } from './pages/admin/admin-solicitudes/admin-solicitudes.component';
import { ChatComponent } from './components/chat/chat.component';
import { PerfilUsuarioComponent } from './perfil-usuario.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },


  { path: 'login', component: LoginComponent },
  { path: 'restablecer', component: ResetRequestComponent },
  { path: 'cambiar-contrasena', component: ResetPasswordComponent },
  { path: 'activar', component: ActivarCuentaComponent },
  {
    path: 'admin',
    component: DashboardAdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Administrador' },
    children: [
      { path: 'usuarios', component: UsuarioListComponent },
      { path: 'eventos', component: CalendarioEventosComponent },
      { path: 'pagos', component: AdminPagosComponent },
      { path: 'inscripciones', component: AdminPeriodosComponent },
      { path: 'documentos', component: DocumentosComponent },
      { path: 'solicitudes', component: AdminSolicitudesComponent },
      { path: 'mensajes', component: ChatComponent },
      { path: 'perfil', component: PerfilUsuarioComponent },
    ]
  },
  {
    path: 'instructor',
    component: DashboardInstructorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Instructor' },
    children:[
      { path: 'eventos', component: CalendarioEventosComponent },
      { path: 'asistencias', component: AsistenciasContainerComponent },
      { path: 'inscripciones', component: InscripcionesComponent },
      { path: 'documentos', component: DocumentosComponent },
      { path: 'solicitudes', component: MisSolicitudesComponent},
      { path: 'mensajes', component: ChatComponent },
      { path: 'perfil', component: PerfilUsuarioComponent },
    ]
  },
  {
    path: 'integrante',
    component: DashboardIntegranteComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Integrante' },
    children: [
      { path: 'eventos', component: CalendarioEventosComponent },
      { path: 'pagos', component: PagosComponent },
      { path: 'asistencias', component: ResumenIntegranteComponent},
      { path: 'documentos', component: DocumentosComponent },
      { path: 'solicitudes', component: MisSolicitudesComponent},
      { path: 'mensajes', component: ChatComponent },
      { path: 'perfil', component: PerfilUsuarioComponent },
    ]
  },
  // ✅ Redirige raíz a Home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ✅ Ruta comodín: si no coincide con nada, va a home
  { path: '**', redirectTo: 'home' }
];
