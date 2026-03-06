import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Señal que indica si el tema actual es oscuro
  isDarkTheme = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  /**
   * Inicializa el tema buscando preferencias previas
   * en localStorage, o cayendo al default (oscuro).
   */
  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    // Para este proyecto el default lo haremos 'dark', pero si el usuario prefirió light, cambia
    if (savedTheme === 'light') {
      this.isDarkTheme.set(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      this.isDarkTheme.set(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark'); // Set default
    }
  }

  /**
   * Alterna el tema y lo guarda en localStorage.
   */
  toggleTheme(): void {
    if (this.isDarkTheme()) {
      // Cambiar a light
      this.isDarkTheme.set(false);
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      // Cambiar a dark
      this.isDarkTheme.set(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }
}
