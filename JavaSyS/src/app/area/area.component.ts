import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CasoResumen } from '../casos/caso.modelo';
import { AREAS, ClaveArea } from '../datos/areas';
import { ESCRIBIR_CORREO, FORMA_DE_TRABAJO, PERFIL } from '../datos/perfil';
import { SeoService } from '../seo.service';

/** Página de un área (diseño, QA o frontend): su método, sus pruebas y sus casos. */
@Component({
  selector: 'app-area',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
})
export class AreaComponent {
  private readonly seo = inject(SeoService);

  /** Los dos llegan desde la ruta: qué área es y la lista de casos ya resuelta. */
  readonly clave = input.required<ClaveArea>();
  readonly casos = input<CasoResumen[]>([]);

  readonly area = computed(() => AREAS.find((a) => a.clave === this.clave()) ?? AREAS[0]);
  readonly otras = computed(() => AREAS.filter((a) => a.clave !== this.clave()));
  readonly cv = computed(() => PERFIL.cv[this.area().cv]);
  readonly escribirCorreo = ESCRIBIR_CORREO;
  readonly agil = FORMA_DE_TRABAJO.agil;
  /** Solo las normas que aplican a esta área. */
  readonly normas = computed(() => FORMA_DE_TRABAJO.normas.filter((n) => n.areas.includes(this.clave())));

  /** Los casos del área, con los datos de la lista general y el enfoque propio del área. */
  readonly casosDelArea = computed(() =>
    this.area().casos.flatMap((propio) => {
      const caso = this.casos().find((c) => c.slug === propio.slug);
      return caso ? [{ ...caso, enfoque: propio.enfoque, ancla: propio.ancla }] : [];
    }),
  );

  constructor() {
    effect(() => {
      const area = this.area();
      this.seo.aplicar({
        titulo: area.seo.titulo,
        descripcion: area.seo.descripcion,
        ruta: `/${area.ruta}`,
        datos: [
          this.seo.migas([
            ['Inicio', '/'],
            [area.nombre, `/${area.ruta}`],
          ]),
        ],
      });
    });
  }
}
