import { RenderMode, ServerRoute } from '@angular/ssr';
import { CASOS_PUBLICADOS } from './casos/casos.generado';

/*
  Todas las páginas se generan como HTML al compilar (el sitio es estático).
  La lista de casos la escribe scripts/sincronizar-casos.mjs.
*/
export const serverRoutes: ServerRoute[] = [
  {
    path: 'casos/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => CASOS_PUBLICADOS.map((slug) => ({ slug })),
  },
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'diseno-ui-ux', renderMode: RenderMode.Prerender },
  { path: 'qa', renderMode: RenderMode.Prerender },
  { path: 'frontend', renderMode: RenderMode.Prerender },
  { path: 'privacidad', renderMode: RenderMode.Prerender },
  { path: 'no-encontrada', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
