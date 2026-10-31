import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Caso, CasoResumen } from './caso.modelo';
import { CasosService } from './casos.service';

/*
  Los datos se resuelven antes de pintar la página. Así el HTML prerenderizado y el primer
  dibujo en el navegador son idénticos, y la página no salta al terminar de cargar.
*/

export const listaDeCasos: ResolveFn<CasoResumen[]> = () =>
  inject(CasosService)
    .listar()
    .catch(() => []);

/** null cuando el caso no existe: la página muestra su aviso de error. */
export const casoDeLaRuta: ResolveFn<Caso | null> = (ruta) =>
  inject(CasosService)
    .obtener(ruta.paramMap.get('slug') ?? '')
    .catch(() => null);
