import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';

/** Un punto; según el contexto, en píxeles de la sección o en coordenadas del dibujo (640 × 440). */
interface Punto {
  x: number;
  y: number;
}

/** Lo que está haciendo la lengua en cada momento. */
type Modo = 'reposo' | 'boton' | 'presion' | 'trago';

/**
 * Escena del estanque de la sección de contacto. Una luciérnaga sigue al mouse (en pantallas
 * táctiles revolotea sola cerca de la rana) y la rana la mira.
 *  · Sobre un botón o enlace de la sección, la rana estira la lengua hasta él y la mantiene.
 *  · Al hacer clic en ese botón, se traga la luciérnaga: la garganta se infla y se relame.
 *  · Al mantener apretado en cualquier otro lugar, la lengua crece mientras dure la presión hasta
 *    llegar al mouse; al soltar vuelve, y si alcanzó la luciérnaga, se la traga.
 *  · Cuando está tranquila, cada tanto salta a otro nenúfar; y si la luciérnaga queda a su
 *    espalda, se da vuelta para mirarla.
 * Es decorativa: no recibe clics ni foco. Se anima siempre (decisión de diseño).
 */
@Component({
  selector: 'app-estanque',
  standalone: true,
  templateUrl: './estanque.component.html',
  styleUrls: ['./estanque.component.css'],
  host: { 'aria-hidden': 'true' },
})
export class EstanqueComponent {
  /** Nenúfares de la escena: el punto donde se sienta la rana en cada uno (coordenadas del dibujo). */
  private readonly NENUFARES: Punto[] = [{ x: 330, y: 376 }, { x: 440, y: 394 }, { x: 225, y: 388 }];
  private readonly ESCALA = 1.05;
  /** La boca de la rana, en coordenadas del dibujo. Cambia cuando salta o se da vuelta. */
  private boca: Punto = { x: 330 + 1.05 * -28.5, y: 376 + 1.05 * -8 };
  /** El centro del ojo, en coordenadas propias de la rana. */
  private readonly OJO: Punto = { x: -17, y: -18 };
  /** Velocidad a la que crece la lengua mientras se mantiene apretado (unidades del dibujo por segundo). */
  private readonly CRECE = 520;

  private readonly anfitrion = inject(ElementRef<HTMLElement>);
  private readonly lienzo = viewChild.required<ElementRef<SVGSVGElement>>('lienzo');
  private readonly rana = viewChild.required<ElementRef<SVGGElement>>('rana');
  private readonly pupila = viewChild.required<ElementRef<SVGCircleElement>>('pupila');
  private readonly garganta = viewChild.required<ElementRef<SVGEllipseElement>>('garganta');
  private readonly onda = viewChild.required<ElementRef<SVGEllipseElement>>('onda');
  private readonly lengua = viewChild.required<ElementRef<SVGLineElement>>('lengua');
  private readonly punta = viewChild.required<ElementRef<SVGCircleElement>>('punta');
  private readonly luciernaga = viewChild.required<ElementRef<HTMLElement>>('luciernaga');

  constructor() {
    const destruir = inject(DestroyRef);
    afterNextRender(() => destruir.onDestroy(this.iniciar()));
  }

  /** Arranca la escena y devuelve la función que la detiene. */
  private iniciar(): () => void {
    const host: HTMLElement = this.anfitrion.nativeElement;
    const seccion = host.parentElement;
    if (!seccion) return () => undefined;
    const conMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const luz = this.luciernaga().nativeElement;

    // Luciérnaga, en píxeles de la sección. Empieza cerca de la rana.
    const boca = this.aSeccion(this.boca, host);
    const pos = { x: boca.x - 40, y: boca.y - 70 };
    let mouse: Punto | null = null;
    let visible = true;
    let enPantalla = false;
    let marco = 0;

    // Lengua, en coordenadas del dibujo: dirección y largo actual.
    let modo: Modo = 'reposo';
    let largo = 0;
    let dir: Punto = { x: -1, y: 0 };
    let boton: Element | null = null;
    let trago = 0; // instante en que empezó a tragar
    let anterior = performance.now();

    // La rana: en qué nenúfar está, hacia dónde mira (1 izquierda, −1 derecha) y si va saltando.
    const SALTO = 650;
    let nenufar = 0;
    let cara = 1;
    let giro = 1;
    let salto: { desde: Punto; hasta: number; inicio: number } | null = null;
    let proximoSalto = performance.now() + 5000 + Math.random() * 4000;
    const ranaG = this.rana().nativeElement;

    /** Coloca la rana: posición, giro y estiramiento; y recalcula dónde queda la boca. */
    const moverRana = (t: number, mirarA: Punto | null) => {
      let { x, y } = this.NENUFARES[nenufar];
      let estira = 1;
      if (salto) {
        const f = Math.min(1, (t - salto.inicio) / SALTO);
        const hasta = this.NENUFARES[salto.hasta];
        x = salto.desde.x + (hasta.x - salto.desde.x) * f;
        y = salto.desde.y + (hasta.y - salto.desde.y) * f - 46 * 4 * f * (1 - f);
        estira = 1 + 0.14 * Math.sin(Math.PI * f);
        cara = hasta.x < salto.desde.x ? 1 : -1;
        if (f >= 1) {
          nenufar = salto.hasta;
          salto = null;
          this.salpicar(hasta);
          proximoSalto = t + 6000 + Math.random() * 5000;
        }
      } else if (mirarA) {
        // Se da vuelta si lo que mira queda a su espalda (con un margen, para que no titubee).
        if (mirarA.x > x + 14) cara = -1;
        else if (mirarA.x < x - 14) cara = 1;
      }
      giro += (cara - giro) * 0.2;
      const sx = this.ESCALA * giro;
      ranaG.setAttribute(
        'transform',
        `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sx.toFixed(3)} ${(this.ESCALA * estira).toFixed(3)})`,
      );
      this.boca = { x: x + sx * -28.5, y: y + this.ESCALA * estira * -8 };
    };

    /** Salta a otro nenúfar, al azar. */
    const saltar = (t: number) => {
      const otros = this.NENUFARES.map((_, i) => i).filter((i) => i !== nenufar);
      salto = { desde: { ...this.NENUFARES[nenufar] }, hasta: otros[Math.floor(Math.random() * otros.length)], inicio: t };
    };

    const ponerLuz = (encendida: boolean) => {
      visible = encendida;
      luz.classList.toggle('luciernaga--visible', enPantalla && visible);
    };

    const tragar = () => {
      modo = 'trago';
      trago = performance.now();
      this.inflarGarganta();
    };

    const dibujar = (t: number) => {
      const dt = Math.min(0.05, (t - anterior) / 1000);
      anterior = t;

      // La rana mira hacia el botón o la luciérnaga; si está tranquila, cada tanto salta.
      if (!salto && modo === 'reposo' && largo === 0 && t > proximoSalto) saltar(t);
      const mira = modo === 'boton' && boton ? this.centro(boton, seccion) : pos;
      moverRana(t, this.aDibujo(mira, host, this.lienzo().nativeElement));

      // Luciérnaga: sigue al mouse; sin mouse, revolotea sobre la rana.
      if (modo !== 'trago') {
        const reposo = this.aSeccion(this.boca, host);
        const meta = mouse ?? { x: reposo.x - 30 + Math.sin(t / 1300) * 46, y: reposo.y - 80 + Math.sin(t / 900) * 22 };
        pos.x += (meta.x - pos.x) * 0.08;
        pos.y += (meta.y - pos.y) * 0.08;
      }

      // Lengua según el modo
      if (modo === 'boton' && boton) {
        const destino = this.aDibujo(this.centro(boton, seccion), host, this.lienzo().nativeElement);
        if (destino) this.apuntar(destino, (d, l) => { dir = d; largo += (l - largo) * 0.22; });
      } else if (modo === 'presion' && mouse) {
        const destino = this.aDibujo(mouse, host, this.lienzo().nativeElement);
        if (destino) this.apuntar(destino, (d, l) => { dir = d; largo = Math.min(l, largo + this.CRECE * dt); });
      } else if (modo === 'trago') {
        // La lengua vuelve rápido con la luciérnaga pegada en la punta; después se relame.
        const pasado = t - trago;
        if (pasado < 260) {
          largo *= 0.78;
          const p = this.aSeccion({ x: this.boca.x + dir.x * largo, y: this.boca.y + dir.y * largo }, host);
          pos.x = p.x;
          pos.y = p.y;
        } else if (pasado < 300) {
          largo = 0;
          ponerLuz(false);
        } else if (pasado < 1100) {
          // Relamerse: la punta asoma y recorre el labio.
          const f = (pasado - 300) / 800;
          const angulo = Math.PI * (0.75 + f * 0.55);
          dir = { x: Math.cos(angulo), y: Math.sin(angulo) };
          largo = Math.sin(f * Math.PI) * 9;
        } else {
          largo = 0;
          modo = boton ? 'boton' : 'reposo';
          setTimeout(() => ponerLuz(true), 700);
        }
      } else {
        largo *= 0.75;
        if (largo < 0.5) largo = 0;
      }

      this.pintarLengua(dir, largo);
      const temblor = Math.sin(t / 180) * 1.5;
      luz.style.transform = `translate3d(${pos.x}px, ${pos.y + temblor}px, 0)`;
      this.mirar(modo === 'boton' && boton ? this.centro(boton, seccion) : pos, host);

      // Si la lengua apretada llega hasta la luciérnaga, se la traga.
      if (modo === 'presion' && visible) {
        const punta = this.aSeccion({ x: this.boca.x + dir.x * largo, y: this.boca.y + dir.y * largo }, host);
        if (Math.hypot(punta.x - pos.x, punta.y - pos.y) < 14) tragar();
      }

      if (enPantalla) marco = requestAnimationFrame(dibujar);
    };

    // Solo se anima mientras la sección está a la vista.
    const observador = new IntersectionObserver(([entrada]) => {
      enPantalla = entrada.isIntersecting;
      luz.classList.toggle('luciernaga--visible', enPantalla && visible);
      cancelAnimationFrame(marco);
      if (enPantalla) {
        anterior = performance.now();
        marco = requestAnimationFrame(dibujar);
      }
    });
    observador.observe(seccion);

    const dentro = (e: PointerEvent) => {
      const caja = seccion.getBoundingClientRect();
      return e.clientX >= caja.left && e.clientX <= caja.right && e.clientY >= caja.top && e.clientY <= caja.bottom;
    };
    const relativo = (e: PointerEvent): Punto => {
      const caja = seccion.getBoundingClientRect();
      return { x: e.clientX - caja.left, y: e.clientY - caja.top };
    };

    const mover = (e: PointerEvent) => {
      if (conMouse && e.pointerType === 'mouse') mouse = dentro(e) ? relativo(e) : null;
      if (modo === 'presion' && e.pointerType !== 'mouse') mouse = relativo(e);
    };

    // Sobre un botón o enlace: la lengua va hasta él.
    const entrar = (e: PointerEvent) => {
      const objetivo = (e.target as Element).closest?.('a, button');
      if (!objetivo || e.pointerType !== 'mouse') return;
      boton = objetivo;
      if (modo !== 'trago' && !salto) modo = 'boton';
    };
    const salir = (e: PointerEvent) => {
      const objetivo = (e.target as Element).closest?.('a, button');
      if (!objetivo || objetivo !== boton) return;
      if ((e.relatedTarget as Element | null)?.closest?.('a, button') === boton) return;
      boton = null;
      if (modo === 'boton') modo = 'reposo';
    };

    // Clic en un botón: se traga la luciérnaga. Presión en cualquier otro lado: la lengua crece.
    const apretar = (e: PointerEvent) => {
      if (modo === 'trago' || salto) return;
      const objetivo = (e.target as Element).closest?.('a, button');
      if (objetivo) {
        boton = objetivo;
        // El botón queda en vino mientras la rana traga y hasta que el mouse sale de él (así se ve
        // también al volver de la pestaña que abrió). En pantallas táctiles, unos segundos.
        objetivo.classList.add('boton--atrapado');
        const soltarBoton = () => setTimeout(() => objetivo.classList.remove('boton--atrapado'), 400);
        if (e.pointerType === 'mouse') objetivo.addEventListener('pointerleave', soltarBoton, { once: true });
        else setTimeout(soltarBoton, 2000);
        tragar();
        return;
      }
      mouse = relativo(e);
      modo = 'presion';
    };
    const soltar = () => {
      if (modo === 'presion') modo = 'reposo';
    };

    window.addEventListener('pointermove', mover, { passive: true });
    seccion.addEventListener('pointerover', entrar);
    seccion.addEventListener('pointerout', salir);
    seccion.addEventListener('pointerdown', apretar);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
    return () => {
      cancelAnimationFrame(marco);
      observador.disconnect();
      window.removeEventListener('pointermove', mover);
      seccion.removeEventListener('pointerover', entrar);
      seccion.removeEventListener('pointerout', salir);
      seccion.removeEventListener('pointerdown', apretar);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);
    };
  }

  /** Dirección y distancia desde la boca hasta un punto del dibujo. */
  private apuntar(destino: Punto, usar: (dir: Punto, largo: number) => void): void {
    const dx = destino.x - this.boca.x;
    const dy = destino.y - this.boca.y;
    const distancia = Math.hypot(dx, dy) || 1;
    usar({ x: dx / distancia, y: dy / distancia }, distancia);
  }

  private pintarLengua(dir: Punto, largo: number): void {
    const x = (this.boca.x + dir.x * largo).toFixed(1);
    const y = (this.boca.y + dir.y * largo).toFixed(1);
    const lengua = this.lengua().nativeElement;
    lengua.setAttribute('x1', this.boca.x.toFixed(1));
    lengua.setAttribute('y1', this.boca.y.toFixed(1));
    lengua.setAttribute('x2', x);
    lengua.setAttribute('y2', y);
    const punta = this.punta().nativeElement;
    punta.setAttribute('cx', x);
    punta.setAttribute('cy', y);
    punta.setAttribute('r', largo > 1 ? '3' : '0');
  }

  /** Al caer en un nenúfar se abre una onda en el agua. */
  private salpicar(donde: Punto): void {
    const onda = this.onda().nativeElement;
    onda.setAttribute('cx', String(donde.x));
    onda.setAttribute('cy', String(donde.y + 6));
    onda.animate(
      [
        { opacity: 0.6, transform: 'scale(0.6)' },
        { opacity: 0, transform: 'scale(5)' },
      ],
      { duration: 1100, easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)' },
    );
  }

  /** La garganta se infla dos veces, como al tragar. */
  private inflarGarganta(): void {
    this.garganta().nativeElement.animate(
      [
        { transform: 'scale(0)' },
        { transform: 'scale(1.15)', offset: 0.3 },
        { transform: 'scale(0.4)', offset: 0.55 },
        { transform: 'scale(1)', offset: 0.75 },
        { transform: 'scale(0)' },
      ],
      { duration: 900, delay: 220, easing: 'ease-in-out' },
    );
  }

  /** La pupila apunta hacia un punto de la sección, sin salirse del ojo. */
  private mirar(pos: Punto, host: HTMLElement): void {
    const local = this.aDibujo(pos, host, this.rana().nativeElement);
    if (!local) return;
    const dx = local.x - this.OJO.x;
    const dy = local.y - this.OJO.y;
    const largo = Math.hypot(dx, dy) || 1;
    const pupila = this.pupila().nativeElement;
    pupila.setAttribute('cx', (this.OJO.x + (dx / largo) * 2.4).toFixed(2));
    pupila.setAttribute('cy', (this.OJO.y + (dy / largo) * 2.4).toFixed(2));
  }

  /** El punto de un botón al que apunta la lengua: su centro, en píxeles de la sección. */
  private centro(elemento: Element, seccion: HTMLElement): Punto {
    const caja = elemento.getBoundingClientRect();
    const base = seccion.getBoundingClientRect();
    return { x: caja.left + caja.width / 2 - base.left, y: caja.top + caja.height / 2 - base.top };
  }

  /** De coordenadas del dibujo a píxeles relativos a la sección. */
  private aSeccion(p: Punto, host: HTMLElement): Punto {
    const matriz = this.lienzo().nativeElement.getScreenCTM();
    const caja = host.getBoundingClientRect();
    if (!matriz) return { x: caja.width * 0.7, y: caja.height * 0.8 };
    return { x: matriz.a * p.x + matriz.c * p.y + matriz.e - caja.left, y: matriz.b * p.x + matriz.d * p.y + matriz.f - caja.top };
  }

  /** De píxeles relativos a la sección a coordenadas de un elemento del dibujo. */
  private aDibujo(p: Punto, host: HTMLElement, elemento: SVGGraphicsElement): Punto | null {
    const matriz = elemento.getScreenCTM();
    if (!matriz) return null;
    const caja = host.getBoundingClientRect();
    const punto = new DOMPoint(p.x + caja.left, p.y + caja.top).matrixTransform(matriz.inverse());
    return { x: punto.x, y: punto.y };
  }
}
