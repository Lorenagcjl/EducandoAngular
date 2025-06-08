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

export const routes: Routes = [
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
      // otras rutas hijas
    ]
  },
  {
    path: 'instructor',
    component: DashboardInstructorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Instructor' },
    children:[
      { path: 'eventos', component: CalendarioEventosComponent },
    ]
  },
  {
    path: 'integrante',
    component: DashboardIntegranteComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Integrante' },
    children: [
      { path: 'eventos', component: CalendarioEventosComponent },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
