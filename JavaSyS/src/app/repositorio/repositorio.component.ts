import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-repositorio',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './repositorio.component.html',
  styleUrl: './repositorio.component.css'
})
export class RepositorioComponent {
    ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'auto' }); // o 'smooth' si prefieres animado
  }
  activo: 'login' | 'register' = 'login';

  mostrar(componente: 'login' | 'register') {
    this.activo = componente;
  }
}
