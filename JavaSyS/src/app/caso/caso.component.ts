import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Caso, CasoResumen, Kpi, NOMBRE_DISCIPLINA, Paso } from '../casos/caso.modelo';
import { ComparadorComponent } from '../comparador/comparador.component';
import { AREAS } from '../datos/areas';
import { SITIO } from '../datos/perfil';
import { SeoService } from '../seo.service';

const ESTADO_REQUERIMIENTO = {
  cumplido: 'Cumplido',
  parcial: 'Parcial',
  fuera: 'Fuera de alcance',
};

@Component({
  selector: 'app-caso',
  standalone: true,
  imports: [RouterLink, ComparadorComponent],
  templateUrl: './caso.component.html',
  styleUrls: ['./caso.component.css'],
})
export class CasoComponent {
  private readonly seo = inject(SeoService);
  private readonly formato = new Intl.NumberFormat('es-CL');

  /** Los tres llegan desde la ruta casos/:slug: el parámetro y los datos ya resueltos. */
  readonly slug = input.required<string>();
  readonly caso = input<Caso | null>(null);
  readonly casos = input<CasoResumen[]>([]);

  readonly vista = signal(0);
  readonly copiado = signal(false);

  readonly nombreDisciplina = NOMBRE_DISCIPLINA;
  readonly areas = AREAS;
  readonly estadoRequerimiento = ESTADO_REQUERIMIENTO;

  readonly otros = computed(() => this.casos().filter((c) => c.slug !== this.slug()));

  readonly siguiente = computed(() => {
    const casos = this.casos();
    const posicion = casos.findIndex((c) => c.slug === this.slug());
    return posicion >= 0 && casos.length > 1 ? casos[(posicion + 1) % casos.length] : null;
  });

  readonly cliente = computed(() => {
    const cliente = this.caso()?.meta.cliente;
    if (!cliente) return '';
    return cliente.autorizado && cliente.nombre ? cliente.nombre : cliente.descripcion_anonima;
  });

  readonly pasos = computed(() => {
    const i = this.caso()?.intervencion;
    if (!i) return [];
    const grupos: { nombre: string; pasos: Paso[] }[] = [
      { nombre: 'Diseño UI/UX', pasos: i.uiux },
      { nombre: 'QA', pasos: i.qa },
      { nombre: 'Marca', pasos: i.marca },
    ];
    return grupos.filter((g) => g.pasos?.length);
  });

  /** El sitio publicado del caso, solo si es una dirección web. */
  readonly sitio = computed(() => {
    const url = this.caso()?.meta.sitio ?? '';
    return /^https:\/\//.test(url) ? { url, texto: url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '') } : null;
  });

  readonly totales = computed(() => {
    const p = this.caso()?.pruebas;
    if (!p) return [];
    const cifras: [string, number | null][] = [
      ['Pruebas automatizadas', p.automatizadas],
      ['Defectos detectados', p.defectos],
      ['Defectos corregidos', p.corregidos],
    ];
    return cifras.filter((c): c is [string, number] => c[1] !== null && c[1] !== undefined);
  });

  constructor() {
    // Al pasar de un caso a otro se vuelve a la primera vista y se describe la página nueva.
    effect(() => {
      const slug = this.slug();
      const caso = this.caso();
      this.vista.set(0);
      this.copiado.set(false);
      if (caso) this.describir(slug, caso);
      else {
        this.seo.aplicar({
          titulo: 'Caso no encontrado · JavaSyS',
          descripcion: 'El caso solicitado no existe en el portafolio de Javiera Paz B.',
          ruta: `/casos/${slug}`,
          sinIndexar: true,
        });
      }
    });
  }

  /** Título, descripción, URL canónica y datos estructurados de la página del caso. */
  private describir(slug: string, caso: Caso): void {
    const disciplinas = new Intl.ListFormat('es', { type: 'conjunction' }).format(
      caso.meta.disciplinas.map((d) => NOMBRE_DISCIPLINA[d]),
    );
    const largo = `${caso.meta.titulo} · Caso de ${disciplinas} · JavaSyS`;
    const ruta = `/casos/${slug}`;
    const descripcion =
      caso.meta.bajada ||
      caso.resumen.frase ||
      this.casos().find((c) => c.slug === slug)?.resumen ||
      caso.meta.titulo;

    this.seo.aplicar({
      titulo: largo.length <= 65 ? largo : `${caso.meta.titulo} · JavaSyS`,
      descripcion,
      ruta,
      datos: [
        this.seo.migas([
          ['Inicio', '/'],
          ['Casos', '/#casos'],
          [caso.meta.titulo, ruta],
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: caso.meta.titulo,
          headline: caso.meta.titulo,
          description: descripcion,
          url: SITIO.url + ruta,
          inLanguage: 'es',
          about: caso.meta.disciplinas.map((d) => NOMBRE_DISCIPLINA[d]),
          author: this.seo.persona(),
        },
      ],
    });
  }

  /** Comparte el caso con el menú del sistema; si no existe, copia el enlace. */
  async compartir(): Promise<void> {
    const datos = { title: this.caso()?.meta.titulo, url: location.href };
    try {
      if (navigator.share) return await navigator.share(datos);
      await navigator.clipboard.writeText(datos.url);
      this.copiado.set(true);
    } catch {
      // La persona canceló o el navegador no lo permite: no hay nada que informar.
    }
  }

  /** Ancho y alto de una imagen del caso: reserva su espacio antes de que cargue. */
  ancho(archivo: string): number | null {
    return this.caso()?.dimensiones?.[archivo]?.[0] ?? null;
  }

  alto(archivo: string): number | null {
    return this.caso()?.dimensiones?.[archivo]?.[1] ?? null;
  }

  ruta(archivo: string): string {
    return /^https?:\/\//.test(archivo) ? archivo : `casos/${this.slug()}/${archivo}`;
  }

  parrafos(texto: string | undefined): string[] {
    return (texto ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  }

  numero(valor: number): string {
    return this.formato.format(valor);
  }

  unidad(unidad: string): string {
    const limpia = (unidad ?? '').trim();
    return limpia ? ` ${limpia}` : '';
  }

  cambio(kpi: Kpi): string {
    return `${this.numero(kpi.antes)} → ${this.numero(kpi.despues)}${this.unidad(kpi.unidad)}`;
  }

  operador(operador: string): string {
    return operador === '<=' ? '≤' : operador === '>=' ? '≥' : operador;
  }

  familia(nombre: string): string {
    return `'${nombre}', var(--serif)`;
  }
}
