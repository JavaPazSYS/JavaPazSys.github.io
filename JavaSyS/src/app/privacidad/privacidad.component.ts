import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentimientoService } from '../consentimiento.service';
import { PERFIL } from '../datos/perfil';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacidad.component.html',
})
export class PrivacidadComponent {
  readonly perfil = PERFIL;
  readonly consentimiento = inject(ConsentimientoService);

  constructor() {
    const seo = inject(SeoService);
    seo.aplicar({
      titulo: 'Política de privacidad · JavaSyS',
      descripcion:
        'Qué datos trata este portafolio: no tiene formularios ni cuentas, y la medición de visitas con Google Analytics se activa solo con consentimiento.',
      ruta: '/privacidad',
      datos: [
        seo.migas([
          ['Inicio', '/'],
          ['Privacidad', '/privacidad'],
        ]),
      ],
    });
  }
}
