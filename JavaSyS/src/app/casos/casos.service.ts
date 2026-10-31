import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Caso, CasoResumen } from './caso.modelo';

/**
 * Lee los casos que scripts/sincronizar-casos.mjs deja en public/casos/.
 * Usa HttpClient para que el prerenderizado espere la respuesta y la traspase al navegador.
 */
@Injectable({ providedIn: 'root' })
export class CasosService {
  private readonly http = inject(HttpClient);
  private indice?: Promise<CasoResumen[]>;
  private readonly casos = new Map<string, Promise<Caso>>();

  listar(): Promise<CasoResumen[]> {
    return (this.indice ??= firstValueFrom(this.http.get<CasoResumen[]>('casos/indice.json')));
  }

  obtener(slug: string): Promise<Caso> {
    let caso = this.casos.get(slug);
    if (!caso) {
      caso = firstValueFrom(this.http.get<Caso>(`casos/${slug}/datos.json`));
      this.casos.set(slug, caso);
    }
    return caso;
  }
}
