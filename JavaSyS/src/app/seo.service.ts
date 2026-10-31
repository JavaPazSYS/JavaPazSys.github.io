
import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PERFIL, SITIO } from './datos/perfil';

export interface Pagina {
  /** Título de la pestaña: lo que la página quiere responder primero, la marca al final. */
  titulo: string;
  descripcion: string;
  /** Ruta de la página, con barra inicial: «/casos/villahome». */
  ruta: string;
  /** Bloques JSON-LD propios de la página. */
  datos?: object[];
  /** Páginas que no deben aparecer en buscadores (la de error). */
  sinIndexar?: boolean;
}

/** Escribe por página el título, la descripción, la URL canónica y los datos estructurados. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly documento = inject(DOCUMENT);
  private readonly titulo = inject(Title);
  private readonly meta = inject(Meta);

  aplicar(pagina: Pagina): void {
    const url = SITIO.url + (pagina.ruta === '/' ? '/' : pagina.ruta);
    const descripcion = recortar(pagina.descripcion, 158);

    this.titulo.setTitle(pagina.titulo);
    this.meta.updateTag({ name: 'description', content: descripcion });
    this.meta.updateTag({ name: 'robots', content: pagina.sinIndexar ? 'noindex, follow' : 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: pagina.titulo });
    this.meta.updateTag({ property: 'og:description', content: descripcion });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: `${SITIO.url}/${SITIO.imagen}` });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt', content: 'Java/SyS · Javiera Paz B. · Diseño UI/UX, QA y Frontend, con el loto de la marca' });
    this.meta.updateTag({ name: 'twitter:title', content: pagina.titulo });
    this.meta.updateTag({ name: 'twitter:description', content: descripcion });
    this.meta.updateTag({ name: 'twitter:image', content: `${SITIO.url}/${SITIO.imagen}` });

    this.canonica(url);
    this.estructurados(pagina.datos ?? []);
  }

  /** Migas de pan en JSON-LD, a partir de pares [nombre, ruta]. */
  migas(tramos: [string, string][]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: tramos.map(([nombre, ruta], i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: nombre,
        item: SITIO.url + ruta,
      })),
    };
  }

  /** Quién es la autora: se usa en la portada y como autora de cada caso. */
  persona(): object {
    return {
      '@type': 'Person',
      '@id': `${SITIO.url}/#javiera-becerra`,
      name: PERFIL.nombre,
      url: `${SITIO.url}/`,
      jobTitle: 'Diseñadora UI/UX, QA y desarrolladora frontend',
      email: `mailto:${PERFIL.correo}`,
      sameAs: [PERFIL.linkedin],
      knowsAbout: [
        'Diseño UI/UX',
        'Sistemas de diseño',
        'Aseguramiento de calidad de software',
        'Automatización de pruebas',
        'Accesibilidad web',
        'Desarrollo frontend',
        'Angular',
        'React',
      ],
    };
  }

  private canonica(url: string): void {
    let enlace = this.documento.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!enlace) {
      enlace = this.documento.createElement('link');
      enlace.rel = 'canonical';
      this.documento.head.appendChild(enlace);
    }
    enlace.href = url;
  }

  private estructurados(bloques: object[]): void {
    this.documento.head.querySelectorAll('script[data-seo]').forEach((s) => s.remove());
    for (const bloque of bloques) {
      const script = this.documento.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', '');
      script.textContent = JSON.stringify(bloque);
      this.documento.head.appendChild(script);
    }
  }
}

/** Corta en el último espacio antes del límite, para no dejar una palabra a medias. */
function recortar(texto: string, limite: number): string {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  if (limpio.length <= limite) return limpio;
  const corte = limpio.slice(0, limite - 1);
  return corte.slice(0, corte.lastIndexOf(' ')).replace(/[,;:—–-]$/, '') + '…';
}
