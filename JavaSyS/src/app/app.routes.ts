import { Routes } from '@angular/router';
import { casoDeLaRuta, listaDeCasos } from './casos/casos.resolver';
import { InicioComponent } from './inicio/inicio.component';

const noEncontrada = () => import('./no-encontrada/no-encontrada.component').then((m) => m.NoEncontradaComponent);

// El título y la descripción de cada página los escribe su componente con SeoService.
export const routes: Routes = [
  { path: '', component: InicioComponent, resolve: { casos: listaDeCasos } },
  {
    path: 'casos/:slug',
    resolve: { caso: casoDeLaRuta, casos: listaDeCasos },
    loadComponent: () => import('./caso/caso.component').then((m) => m.CasoComponent),
  },
  // Una página por área. La dirección coincide con «ruta» en datos/areas.ts.
  ...(
    [
      ['diseno-ui-ux', 'diseno'],
      ['qa', 'qa'],
      ['frontend', 'frontend'],
    ] as const
  ).map(([path, clave]) => ({
    path,
    data: { clave },
    resolve: { casos: listaDeCasos },
    loadComponent: () => import('./area/area.component').then((m) => m.AreaComponent),
  })),
  {
    path: 'privacidad',
    loadComponent: () => import('./privacidad/privacidad.component').then((m) => m.PrivacidadComponent),
  },
  // El índice de la página de error enumera los casos: también los recibe resueltos.
  { path: 'no-encontrada', loadComponent: noEncontrada, resolve: { casos: listaDeCasos } },
  { path: '**', loadComponent: noEncontrada, resolve: { casos: listaDeCasos } },
];
