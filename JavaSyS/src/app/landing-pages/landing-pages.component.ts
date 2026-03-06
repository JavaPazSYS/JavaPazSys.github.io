import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CarouselComponent, CarouselSlide } from '../shared/components/carousel/carousel.component';

@Component({
  selector: 'app-landing-pages',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './landing-pages.component.html',
  styleUrl: './landing-pages.component.css'
})
export class LandingPagesComponent {

  features: CarouselSlide[] = [
    { icon: 'fa-layer-group', title: 'Glassmorphism', description: 'Efectos de vidrio esmerilado nativos y fluidos para cualquier resolución.' },
    { icon: 'fa-magic', title: 'Golden Ratio', description: 'Espaciados y distribuciones matemáticas perfectas (1.618) para harmonía visual.' },
    { icon: 'fa-palette', title: 'CSS Global', description: 'Sistema centralizado de variables. Cero colores en duro en toda la arquitectura.' },
    { icon: 'fa-mobile-alt', title: '100% Responsive', description: 'Adaptación fluida desde monitores ultra-anchos hasta móviles.' }
  ];


}
