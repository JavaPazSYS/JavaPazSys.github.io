import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../Forms/login/login.component';
import { RegisterComponent } from '../Forms/register/register.component';
import { EcommerceComponent } from '../ecommerce/ecommerce.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LandingPagesComponent } from '../landing-pages/landing-pages.component';
import { ForgetPassComponent } from '../forget-pass/forget-pass.component';

export type CategoryKey = 'login' | 'register' | 'forget-pass' | 'ecommerce' | 'dashboard' | 'landing-pages';

@Component({
  selector: 'app-repositorio',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    RegisterComponent,
    ForgetPassComponent,
    EcommerceComponent,
    DashboardComponent,
    LandingPagesComponent,
  ],
  templateUrl: './repositorio.component.html',
  styleUrl: './repositorio.component.css'
})
export class RepositorioComponent {
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  activo: CategoryKey = 'login';

  mostrar(componente: CategoryKey) {
    this.activo = componente;
  }
}
