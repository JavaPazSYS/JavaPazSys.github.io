import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal, DOCUMENT } from '@angular/core';
import { SITIO } from './datos/perfil';

export type Consentimiento = 'pendiente' | 'aceptado' | 'rechazado';

const CLAVE = 'consentimiento-analitica';

/**
 * Google Analytics se carga únicamente si la persona lo acepta.
 * Sin decisión no se carga nada; con la señal «Global Privacy Control» o «Do Not Track»
 * del navegador se entiende rechazado y ni siquiera se pregunta.
 */
@Injectable({ providedIn: 'root' })
export class ConsentimientoService {
  private readonly enNavegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly documento = inject(DOCUMENT);
  private cargado = false;

  /** null mientras no se ha leído la decisión (en el servidor y antes de hidratar). */
  readonly estado = signal<Consentimiento | null>(null);

  /** Lee la decisión guardada. Se llama una vez, ya en el navegador. */
  iniciar(): void {
    if (!this.enNavegador) return;
    const guardado = this.leer();
    if (guardado) this.estado.set(guardado);
    else this.estado.set(this.pideNoRastrear() ? 'rechazado' : 'pendiente');
    if (this.estado() === 'aceptado') this.cargarAnalitica();
    this.mostrarAviso(this.estado() === 'pendiente');
  }

  decidir(decision: 'aceptado' | 'rechazado'): void {
    this.estado.set(decision);
    this.mostrarAviso(false);
    try {
      localStorage.setItem(CLAVE, decision);
    } catch {
      // Sin almacenamiento disponible la decisión vale solo para esta visita.
    }
    if (decision === 'aceptado') this.cargarAnalitica();
    else this.borrarCookies();
  }

  /** Vuelve a mostrar el aviso para cambiar la decisión. */
  reabrir(): void {
    this.estado.set('pendiente');
    this.mostrarAviso(true);
    // El aviso está arriba de la página: se lleva la vista hasta él.
    this.documento.defaultView?.scrollTo({ top: 0 });
    this.documento.querySelector<HTMLElement>('.aviso-medicion button')?.focus();
  }

  /** El aviso se muestra con una clase en <html>; index.html la pone antes del primer dibujo. */
  private mostrarAviso(visible: boolean): void {
    this.documento.documentElement.classList.toggle('medicion-pendiente', visible);
  }

  private leer(): Consentimiento | null {
    try {
      const valor = localStorage.getItem(CLAVE);
      return valor === 'aceptado' || valor === 'rechazado' ? valor : null;
    } catch {
      return null;
    }
  }

  private pideNoRastrear(): boolean {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    return nav.globalPrivacyControl === true || nav.doNotTrack === '1';
  }

  private cargarAnalitica(): void {
    if (this.cargado) return;
    this.cargado = true;
    const ventana = window as Window & { dataLayer?: unknown[] };
    ventana.dataLayer = ventana.dataLayer ?? [];
    // gtag exige el objeto «arguments», no un arreglo.
    function gtag(..._argumentos: unknown[]) {
      ventana.dataLayer!.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', SITIO.analitica, { anonymize_ip: true });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${SITIO.analitica}`;
    document.head.appendChild(script);
  }

  private borrarCookies(): void {
    for (const cookie of document.cookie.split(';')) {
      const nombre = cookie.split('=')[0].trim();
      if (nombre.startsWith('_ga')) document.cookie = `${nombre}=; Max-Age=0; path=/`;
    }
  }
}
