/*
  Dibuja las etapas del loto que acompañan a cada sección de la portada, de abajo hacia arriba:
    etapa-1-naciendo.svg  una hoja de nenúfar pequeña asomando del agua (Contacto, 04)
    etapa-2-nenufar.svg   la hoja de nenúfar flotando                (Trayectoria, 03)
    etapa-3-capullo.svg   el nenúfar con un capullo cerrado          (Casos, 02)
    etapa-4-abriendo.svg  el nenúfar con el capullo más grande, abriéndose (Áreas, 01)
  La flor abierta y grande es la de la portada.
  Colores neutros que se leen sobre fondo claro y oscuro; el vino, solo en el capullo.

  Uso:
    node scripts/etapas-loto.mjs
*/
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const publico = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const GRIS = '#8f8a85';
const BORDE = '#1d1715';

const defs = (id) => `<defs>
    <linearGradient id="${id}-hoja" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e6862"/><stop offset="1" stop-color="#2b2826"/></linearGradient>
    <linearGradient id="${id}-vino" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#6b1e2b"/><stop offset="1" stop-color="#c4566f"/></linearGradient>
    <linearGradient id="${id}-vino-claro" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7a2236"/><stop offset="1" stop-color="#d07a91"/></linearGradient>
  </defs>`;

// Ondas del agua alrededor de un punto
const ondas = (cx, cy, n, rx = 18, ry = 4) =>
  Array.from({ length: n }, (_, i) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx + i * 11}" ry="${ry + i * 2.4}" fill="none" stroke="${GRIS}" stroke-opacity="${(0.6 - i * 0.16).toFixed(2)}" stroke-width="0.9"/>`).join('');

// Hoja de nenúfar con muesca, en perspectiva
function nenufar(id, cx, cy, rx, ry, muesca = [-30, 6]) {
  const p = (t) => {
    const r = (t * Math.PI) / 180;
    return [(cx + rx * Math.cos(r)).toFixed(1), (cy + ry * Math.sin(r)).toFixed(1)];
  };
  const [ax, ay] = p(muesca[0]);
  const [bx, by] = p(muesca[1]);
  const venas = [50, 95, 140, 185, 230, 275, 320]
    .map((t) => {
      const [x, y] = p(t);
      return `M${cx} ${cy} L${(cx + (x - cx) * 0.8).toFixed(1)} ${(cy + (y - cy) * 0.8).toFixed(1)}`;
    })
    .join(' ');
  return `<path d="M${cx} ${cy} L${bx} ${by} A${rx} ${ry} 0 1 1 ${ax} ${ay} Z" fill="url(#${id}-hoja)" stroke="${BORDE}" stroke-width="1" stroke-linejoin="round"/>` +
    `<path d="${venas}" fill="none" stroke="#b9b2aa" stroke-opacity="0.35" stroke-width="0.6"/>`;
}

// Capullo cerrado: una gota alta con su nervio
const capullo = (id, x, y, alto, ancho) =>
  `<path d="M${x - ancho} ${y} C${x - ancho} ${y - alto * 0.45} ${x - ancho * 0.4} ${y - alto * 0.8} ${x} ${y - alto} C${x + ancho * 0.4} ${y - alto * 0.8} ${x + ancho} ${y - alto * 0.45} ${x + ancho} ${y} C${x + ancho * 0.5} ${y + 2} ${x - ancho * 0.5} ${y + 2} ${x - ancho} ${y} Z" fill="url(#${id}-vino)" stroke="${BORDE}" stroke-width="0.9" stroke-linejoin="round"/>` +
  `<path d="M${x} ${y - alto} C${x - 1.2} ${y - alto * 0.6} ${x - 1.2} ${y - alto * 0.3} ${x} ${y + 1.4}" fill="none" stroke="${BORDE}" stroke-opacity="0.55" stroke-width="0.7"/>`;

// Pétalo en gota apoyado en (0,0), girado
const petalo = (fill, w, h, giro, x, y) =>
  `<path d="M0 0 C${-w} ${-h * 0.18} ${-w * 0.92} ${-h * 0.72} 0 ${-h} C${w * 0.92} ${-h * 0.72} ${w} ${-h * 0.18} 0 0 Z" transform="translate(${x} ${y}) rotate(${giro})" fill="${fill}" stroke="${BORDE}" stroke-width="0.9" stroke-linejoin="round"/>`;

const archivo = (nombre, viewBox, contenido) =>
  writeFileSync(join(publico, nombre), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" aria-hidden="true">\n  <!-- Loto de la marca Java/SyS: ${nombre.replace('.svg', '')}. Dibujo propio. -->\n  ${contenido}\n</svg>\n`);

// 1. Naciendo: una hoja de nenúfar pequeña, recién asomando del agua, con ondas
archivo('etapa-1-naciendo.svg', '-12 22 88 32', defs('e1') +
  ondas(32, 40, 3, 16, 4.5) +
  nenufar('e1', 32, 39, 13, 4.8, [-36, 4]));

// 2. Nenúfar: la hoja flotando
archivo('etapa-2-nenufar.svg', '-12 22 88 32', defs('e2') +
  ondas(32, 40, 2, 32, 11) +
  nenufar('e2', 32, 38, 27, 10));

// 3. Nenúfar con capullo cerrado
archivo('etapa-3-capullo.svg', '-12 8 88 46', defs('e3') +
  ondas(32, 40, 2, 32, 11) +
  nenufar('e3', 32, 38, 27, 10) +
  capullo('e3', 31, 37, 22, 6));

// 4. Nenúfar con el capullo más grande, abriéndose: los pétalos de afuera se separan
archivo('etapa-4-abriendo.svg', '-12 0 88 56', defs('e4') +
  ondas(32, 42, 2, 32, 11) +
  nenufar('e4', 32, 40, 27, 10) +
  petalo('url(#e4-vino-claro)', 6.5, 22, -32, 31, 39) +
  petalo('url(#e4-vino-claro)', 6.5, 22, 32, 31, 39) +
  capullo('e4', 31, 39, 31, 7.5));

console.log('etapas del loto en public/');
