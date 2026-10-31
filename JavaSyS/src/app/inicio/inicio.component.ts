import { Component, ElementRef, afterNextRender, computed, inject, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CasoResumen, NOMBRE_DISCIPLINA } from '../casos/caso.modelo';
import { AREAS } from '../datos/areas';
import { CURSOS, EDUCACION, ESCRIBIR_CORREO, EXPERIENCIA, FORMA_DE_TRABAJO, MENSAJE_LINKEDIN, PERFIL, PRINCIPIOS, SITIO } from '../datos/perfil';
import { EstanqueComponent } from '../estanque/estanque.component';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, EstanqueComponent],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  readonly perfil = PERFIL;
  readonly escribirCorreo = ESCRIBIR_CORREO;
  /** Aviso que aparece bajo los botones de contacto. */
  readonly aviso = signal('');
  private avisoTimer = 0;

  /**
   * Al abrir LinkedIn deja copiado un mensaje para pegarlo en «Mensaje» (LinkedIn no permite
   * abrir un chat con texto precargado desde otro sitio). El enlace igual abre el perfil.
   */
  copiarMensajeLinkedin(): void {
    navigator.clipboard
      ?.writeText(MENSAJE_LINKEDIN)
      .then(() => this.avisar('Te copié un mensaje: pégalo en «Mensaje» en LinkedIn y complétalo.'))
      .catch(() => undefined);
  }

  private avisar(texto: string): void {
    this.aviso.set(texto);
    clearTimeout(this.avisoTimer);
    this.avisoTimer = window.setTimeout(() => this.aviso.set(''), 7000);
  }
  readonly principios = PRINCIPIOS;
  readonly forma = FORMA_DE_TRABAJO;
  readonly areas = AREAS;
  readonly experiencia = EXPERIENCIA;
  readonly educacion = EDUCACION;
  readonly cursos = CURSOS;
  readonly nombreDisciplina = NOMBRE_DISCIPLINA;

  /** Llega resuelto desde la ruta. */
  readonly casos = input<CasoResumen[]>([]);
  readonly error = computed(() => !this.casos().length);

  private readonly loto = viewChild<ElementRef<HTMLElement>>('loto');
  private readonly nombre = viewChild<ElementRef<HTMLElement>>('nombre');
  private readonly rol = viewChild<ElementRef<HTMLElement>>('rol');
  private readonly base = viewChild<ElementRef<HTMLElement>>('base');
  private readonly agua = viewChild<ElementRef<HTMLElement>>('agua');

  constructor() {
    afterNextRender(() => {
      this.entrada();
      this.deshojar();
    });
    const seo = inject(SeoService);
    seo.aplicar({
      titulo: 'JavaSyS · Diseño UI/UX, QA y Frontend',
      descripcion:
        'Portafolio de Javiera Paz B., ingeniera en Informática: diseño UI/UX, QA y desarrollo frontend. El método de cada área y casos reales con sus pruebas.',
      ruta: '/',
      datos: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': `${SITIO.url}/#sitio`,
              url: `${SITIO.url}/`,
              name: 'JavaSyS',
              alternateName: 'Javiera Paz B. · Portafolio',
              description: 'Portafolio de diseño UI/UX, QA y desarrollo frontend',
              inLanguage: 'es',
              author: { '@id': `${SITIO.url}/#javiera-becerra` },
            },
            seo.persona(),
          ],
        },
      ],
    });
  }

  /**
   * Entrada de la portada, una vez por visita: el loto sale del agua al centro de la pantalla,
   * grande, y se abre pétalo a pétalo entre ondas; gira 90° a la izquierda mientras se desplaza a la derecha del nombre (los pétalos quedan
   * apuntando hacia él) y después el nombre se descubre desde el loto hacia la izquierda.
   * Se ve siempre al abrir la portada, también con «reducir movimiento» (decisión de diseño).
   */
  /**
   * La flor de la portada se deshoja: un clic en un pétalo rosado lo suelta y cae girando.
   * Cuando no queda ninguno, la flor vuelve a florecer pétalo a pétalo. Las hojas grises no se
   * sueltan. Es decorativo: solo con mouse o dedo.
   */
  private deshojar(): void {
    const loto = this.loto()?.nativeElement;
    if (!loto?.animate) return;
    const grupos = [...loto.querySelectorAll<SVGGElement>('.petalo')];
    const brillo = grupos.at(-1); // el reflejo del pétalo central: cae junto con él
    const petalos = grupos.filter((g) => Number(g.dataset['paso']) >= 2 && g !== brillo);
    const caidos = new Map<SVGGElement, Animation[]>();
    let floreciendo = false;

    const soltar = (petalo: SVGGElement) => {
      if (floreciendo || caidos.has(petalo)) return;
      // La flor está girada 90° a la izquierda: «abajo» en pantalla es −x en el dibujo.
      const lado = Math.random() < 0.5 ? -1 : 1;
      const caida = [
        { opacity: 1, transform: 'none' },
        { opacity: 1, transform: `translate(-18px, ${lado * 10}px) rotate(${lado * 40}deg)`, offset: 0.35 },
        { opacity: 0, transform: `translate(-70px, ${lado * 26}px) rotate(${lado * 140}deg) scale(0.7)` },
      ];
      const opciones: KeyframeAnimationOptions = { duration: 1600, easing: 'cubic-bezier(0.33, 0, 0.67, 1)', fill: 'forwards' };
      const animaciones = [petalo.animate(caida, opciones)];
      if (petalo.dataset['paso'] === '4' && brillo) animaciones.push(brillo.animate(caida, opciones));
      caidos.set(petalo, animaciones);
      if (caidos.size === petalos.length) setTimeout(florecer, 1500);
    };

    const florecer = () => {
      floreciendo = true;
      petalos.forEach((petalo, i) => {
        const vuelve = [
          { opacity: 0, transform: 'scale(0.3)' },
          { opacity: 1, transform: 'scale(1)' },
        ];
        const grupo = petalo.dataset['paso'] === '4' && brillo ? [petalo, brillo] : [petalo];
        caidos.get(petalo)?.forEach((a) => a.cancel());
        for (const g of grupo) g.animate(vuelve, { duration: 900, delay: 200 + i * 220, easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)', fill: 'backwards' });
      });
      setTimeout(() => {
        caidos.clear();
        floreciendo = false;
      }, 200 + petalos.length * 220 + 900);
    };

    for (const petalo of petalos) {
      petalo.classList.add('petalo--suelto');
      petalo.addEventListener('pointerdown', () => soltar(petalo));
    }
  }

  private entrada(): void {
    const html = document.documentElement;
    if (!html.classList.contains('entrada-pendiente')) return;
    const loto = this.loto()?.nativeElement;
    const nombre = this.nombre()?.nativeElement;
    if (!loto || !nombre || !loto.animate) {
      html.classList.remove('entrada-pendiente');
      return;
    }

    // Distancia desde el lugar final del loto hasta el centro de la pantalla visible.
    const caja = loto.getBoundingClientRect();
    const centroY = Math.min(window.innerHeight, 760) / 2;
    const dx = window.innerWidth / 2 - (caja.left + caja.width / 2);
    const dy = centroY - (caja.top + caja.height / 2);
    const suave = 'cubic-bezier(0.22, 1, 0.36, 1)';
    // Al centro se ve grande: cerca de la mitad del alto de la pantalla.
    const escala = Math.max(1.2, Math.min(window.innerHeight * 0.5, 440, window.innerWidth * 0.8) / caja.height);
    // Sale del agua: parte un poco más abajo y sube mientras se abre.
    const subida = caja.height * escala * 0.16;
    const alCentro = (giro: number, bajo = 0) =>
      `translate(${dx}px, ${dy + bajo}px) scale(${escala}) rotate(${giro}deg)`;

    // El agua: una línea de superficie con ondas, a la altura de la base de la flor.
    const agua = this.agua()?.nativeElement;
    const seccion = loto.closest('section')?.getBoundingClientRect();
    if (agua && seccion) {
      agua.style.left = `${window.innerWidth / 2 - seccion.left}px`;
      agua.style.top = `${centroY + caja.height * escala * 0.3 - seccion.top}px`;
    }

    // 1. Pétalo a pétalo, de las hojas al centro, en cinco pasos que se superponen.
    const PASO = 260;
    const ABRIR = 1000;
    const brote = 'cubic-bezier(0.25, 0.8, 0.25, 1)';
    loto.querySelectorAll<SVGGElement>('.petalo').forEach((petalo) => {
      const paso = Number(petalo.dataset['paso'] ?? 0);
      petalo.animate(
        [
          { opacity: 0, transform: 'scale(0.3)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: ABRIR, delay: 150 + paso * PASO, easing: brote, fill: 'backwards' },
      );
    });

    // 2. Mientras se abre ya empieza a girar despacio a la izquierda; después sigue girando
    //    mientras viaja, hasta quedar a 90° con los pétalos apuntando al nombre.
    const abierta = 150 + 4 * PASO + ABRIR + 150;
    const viaje = 1900;
    const total = abierta + viaje;
    loto.animate(
      [
        { transform: alCentro(0, subida), easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)' },
        { transform: alCentro(-8), offset: (abierta * 0.7) / total, easing: 'linear' },
        { transform: alCentro(-18), offset: abierta / total, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
        { transform: 'rotate(-90deg)' },
      ],
      { duration: total, fill: 'backwards' },
    );

    // Las ondas se abren mientras la flor sale del agua; el agua se va cuando la flor viaja.
    if (agua) {
      agua.animate(
        [{ opacity: 0 }, { opacity: 1, offset: 0.08 }, { opacity: 1, offset: 0.82 }, { opacity: 0 }],
        { duration: abierta + 500, easing: 'ease-in-out' },
      );
      agua.querySelectorAll<HTMLElement>('i').forEach((onda, i) => {
        onda.animate(
          [
            { opacity: 0, transform: 'scale(0.3)' },
            { opacity: 0.5, offset: 0.15 },
            { opacity: 0, transform: 'scale(2.6)' },
          ],
          { duration: 2200, delay: 200 + i * 650, easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)' },
        );
      });
    }

    // 3. El nombre sale del agua: cada línea sube desde abajo, desenfocada, y se aclara;
    //    bajo el nombre se abren ondas, como en la superficie de un estanque.
    const fin = total;
    nombre.querySelectorAll<HTMLElement>('.portada__linea').forEach((linea, i) => {
      linea.animate(
        [
          { opacity: 0, transform: 'translateY(0.55em)', filter: 'blur(14px)' },
          { opacity: 0.55, filter: 'blur(5px)', offset: 0.45 },
          { opacity: 1, transform: 'none', filter: 'blur(0)' },
        ],
        { duration: 2100, delay: fin - 800 + i * 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
      );
    });
    nombre.querySelectorAll<HTMLElement>('.portada__ondas i').forEach((onda, i) => {
      onda.animate(
        [
          { opacity: 0, transform: 'scale(0.25, 0.5)' },
          { opacity: 0.35, offset: 0.2 },
          { opacity: 0, transform: 'scale(1.1, 1.6)' },
        ],
        { duration: 2600, delay: fin - 700 + i * 550, easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)', fill: 'backwards' },
      );
    });
    for (const [elemento, retraso] of [[this.rol(), fin + 900], [this.base(), fin + 1100]] as const) {
      elemento?.nativeElement.animate(
        [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
        { duration: 800, delay: retraso, easing: suave, fill: 'backwards' },
      );
    }

    // Las animaciones ya cubren el estado inicial: se quita la clase que los escondía.
    html.classList.remove('entrada-pendiente');
  }
}
