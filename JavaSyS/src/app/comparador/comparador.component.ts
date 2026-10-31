import { Component, computed, input, signal } from '@angular/core';

/** Comparador antes / después: una misma vista, con un control deslizante que mueve el corte. */
@Component({
  selector: 'app-comparador',
  standalone: true,
  template: `
    <div class="marco" [class.marco--vertical]="vertical() || esVertical()" [style.--corte]="corte() + '%'">
      <img class="despues" [src]="despues()" [alt]="'Después: ' + titulo()" [attr.width]="ancho()" [attr.height]="alto()"
        (load)="medir($event)">
      <img class="antes" [src]="antes()" [alt]="'Antes: ' + titulo()" [attr.width]="ancho()" [attr.height]="alto()">
      <span class="linea" aria-hidden="true"></span>
      <span class="rotulo rotulo--antes" aria-hidden="true">Antes</span>
      <span class="rotulo rotulo--despues" aria-hidden="true">Después</span>
      <input type="range" min="0" max="100" step="1" [value]="corte()"
        [attr.aria-label]="'Mover el corte entre el antes y el después de ' + titulo()"
        [attr.aria-valuetext]="corte() + ' % muestra el antes'"
        (input)="corte.set(+$any($event.target).value)">
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .marco {
      position: relative;
      overflow: hidden;
      max-height: 82vh;
      margin-inline: auto;
      background: var(--carbon);
      border: 1px solid var(--gris-700);
      border-radius: var(--radio);
    }

    /* Capturas de teléfono: más angostas y centradas. */
    .marco--vertical {
      max-width: 22.5rem;
    }

    .despues {
      width: 100%;
      height: auto;
    }

    .antes {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top left;
      clip-path: inset(0 calc(100% - var(--corte)) 0 0);
    }

    .linea {
      position: absolute;
      top: 0;
      bottom: 0;
      left: var(--corte);
      width: 2px;
      margin-left: -1px;
      background: var(--hueso);
      box-shadow: 0 0 0 1px rgb(13 12 12 / 0.35);
    }

    .linea::after {
      content: '‹ ›';
      position: absolute;
      top: min(50%, 41vh);
      left: 50%;
      translate: -50% -50%;
      display: grid;
      place-items: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      background: var(--vino);
      color: var(--hueso);
      font-size: var(--t-l);
      line-height: 1;
      white-space: nowrap;
    }

    .rotulo {
      position: absolute;
      top: 0.75rem;
      padding: 0.25rem 0.625rem;
      border-radius: 999px;
      background: rgb(13 12 12 / 0.82);
      color: var(--hueso);
      font-size: var(--t-xs);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .rotulo--antes {
      left: 0.75rem;
    }

    .rotulo--despues {
      right: 0.75rem;
    }

    input {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      opacity: 0;
      cursor: ew-resize;
    }

    .marco:has(input:focus-visible) {
      outline: 2px solid var(--hueso);
      outline-offset: 3px;
    }
  `,
})
export class ComparadorComponent {
  readonly antes = input.required<string>();
  readonly despues = input.required<string>();
  readonly titulo = input('');
  /** Ancho y alto de la captura del después, para reservar su espacio. */
  readonly ancho = input<number | null>(null);
  readonly alto = input<number | null>(null);

  readonly corte = signal(50);
  readonly vertical = signal(false);
  /** Con las dimensiones conocidas se sabe de antemano si es una captura de teléfono. */
  readonly esVertical = computed(() => (this.alto() ?? 0) > (this.ancho() ?? 0) * 1.2);

  medir(evento: Event): void {
    const imagen = evento.target as HTMLImageElement;
    this.vertical.set(imagen.naturalHeight > imagen.naturalWidth * 1.2);
  }
}
