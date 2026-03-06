import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../shared/services/theme/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen = false;

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) { }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    // Bloquear scroll del body cuando el menú está abierto
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  async scrollTo(id: string, event: Event) {
    event.preventDefault(); // Evita el salto brusco del href
    this.closeMenu();

    const currentRoute = this.router.url.split('?')[0].split('#')[0];

    // Si no estamos en el Home ('/'), navegamos primero allí
    if (currentRoute !== '/') {
      await this.router.navigate(['/']);
      // Retraso mínimo para permitir que Angular renderice el DOM del Home
      setTimeout(() => this.scrollElement(id), 100);
    } else {
      // Si ya estamos en Home, scrolleamos directamente
      this.scrollElement(id);
    }
  }

  private scrollElement(id: string) {
    const element = document.getElementById(id);
    if (element) {
      // Ajuste de comportamiento de scroll suave
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Cerrar el menú al redimensionar a pantalla grande
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const target = event.target as Window;
    if (target.innerWidth > 768 && this.menuOpen) {
      this.closeMenu();
    }
  }
}
