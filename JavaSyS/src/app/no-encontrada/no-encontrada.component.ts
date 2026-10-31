import { Component, ElementRef, afterNextRender, computed, inject, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CasoResumen } from '../casos/caso.modelo';
import { AREAS } from '../datos/areas';
import { SeoService } from '../seo.service';

interface Entrada {
  seccion: string;
  titulo: string;
  enlace: string | string[];
  ancla?: string;
}

/**
 * Página de error, pensada como la «fe de erratas» de una edición impresa: un 404 cuyo
 * cero es una brújula sin norte, y el índice de lo que sí existe.
 * Netlify la entrega con código 404 para cualquier dirección que no exista.
 */
@Component({
  selector: 'app-no-encontrada',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './no-encontrada.component.html',
  styleUrls: ['./no-encontrada.component.css'],
})
export class NoEncontradaComponent {
  /** Llega resuelto desde la ruta. */
  readonly casos = input<CasoResumen[]>([]);

  /** Dirección que se intentó abrir. Solo se conoce en el navegador. */
  readonly direccion = signal('');
  /** La aguja deja de vagar y apunta al cursor cuando hay uno. */
  readonly siguiendo = signal(false);

  private readonly brujula = viewChild<ElementRef<SVGElement>>('brujula');
  private readonly aguja = viewChild<ElementRef<SVGGElement>>('aguja');

  readonly indice = computed<Entrada[]>(() => [
    { seccion: 'Portada', titulo: 'JavaSyS', enlace: '/' },
    ...AREAS.map((area) => ({ seccion: `Área ${area.numero}`, titulo: area.nombre, enlace: ['/', area.ruta] })),
    ...this.casos().map((caso) => ({
      seccion: `Caso ${caso.numero}`,
      titulo: caso.titulo,
      enlace: ['/casos', caso.slug],
    })),
    { seccion: 'Sección', titulo: 'Contacto', enlace: '/', ancla: 'contacto' },
  ]);

  /** El texto de la cinta se repite para que el desplazamiento no tenga costura. */
  readonly cinta = Array.from({ length: 6 });

  constructor() {
    inject(SeoService).aplicar({
      titulo: 'Página no encontrada · JavaSyS',
      descripcion: 'La dirección solicitada no existe en el portafolio de Javiera Paz B.',
      ruta: '/no-encontrada',
      sinIndexar: true,
    });

    afterNextRender(() => {
      const ruta = decodeURIComponent(location.pathname);
      if (ruta !== '/no-encontrada') this.direccion.set(ruta.length > 60 ? `${ruta.slice(0, 57)}…` : ruta);
    });
  }

  /** La aguja apunta hacia donde está el cursor. */
  apuntar(evento: PointerEvent): void {
    const brujula = this.brujula()?.nativeElement;
    const aguja = this.aguja()?.nativeElement;
    if (!brujula || !aguja || evento.pointerType !== 'mouse') return;

    const caja = brujula.getBoundingClientRect();
    const dx = evento.clientX - (caja.left + caja.width / 2);
    const dy = evento.clientY - (caja.top + caja.height / 2);
    aguja.style.rotate = `${Math.atan2(dy, dx) * (180 / Math.PI) + 90}deg`;
    if (!this.siguiendo()) this.siguiendo.set(true);
  }

  /** Sin cursor encima, la aguja vuelve a vagar. */
  soltar(): void {
    this.siguiendo.set(false);
    const aguja = this.aguja()?.nativeElement;
    if (aguja) aguja.style.rotate = '';
  }
}
