import { Component, afterNextRender, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ConsentimientoService } from './consentimiento.service';
import { AREAS } from './datos/areas';
import { PERFIL } from './datos/perfil';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly perfil = PERFIL;
  readonly anio = new Date().getFullYear();
  readonly menuAbierto = signal(false);
  readonly consentimiento = inject(ConsentimientoService);
  private readonly router = inject(Router);

  /** La página de error se muestra sin la cabecera: tiene su propio índice. */
  readonly sinCabecera = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      map(() => ['no-encontrada', '**'].includes(this.router.routerState.snapshot.root.firstChild?.routeConfig?.path ?? '')),
    ),
    { initialValue: false },
  );

  /** Primero las tres áreas, cada una con su página; después lo común. */
  readonly areas = AREAS;
  readonly enlaces = [
    { texto: 'Casos', ancla: 'casos' },
    { texto: 'Contacto', ancla: 'contacto' },
  ];

  /** Comparte la página con el menú del sistema; si no existe, copia el enlace. */
  readonly copiado = signal(false);

  async compartir(): Promise<void> {
    try {
      if (navigator.share) return await navigator.share({ title: document.title, url: location.href });
      await navigator.clipboard.writeText(location.href);
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2500);
    } catch {
      // La persona canceló o el navegador no lo permite: no hay nada que informar.
    }
  }

  constructor() {
    // La decisión guardada solo existe en el navegador: se lee después de pintar.
    afterNextRender(() => this.consentimiento.iniciar());
  }
}
