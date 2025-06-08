import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const roleExpected = route.data['role'];
    const role = this.authService.getRole();
    console.log('RoleGuard: esperado=', roleExpected, 'actual=', role);
    if (role === roleExpected) return true;

    this.router.navigate(['/unauthorized']); 
    return false;
  }
}
