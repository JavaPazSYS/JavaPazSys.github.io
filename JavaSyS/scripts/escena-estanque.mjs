/*
  Dibuja la escena del estanque de la sección de contacto (public/estanque.svg):
  cañas de bambú con hojas, agua con ondas y nenúfares. Ilustración de línea fina en blanco
  roto y gris. La rana va aparte, en src/app/estanque/, porque se anima (mira y saca la lengua). El loto que nace en contacto es la etapa 1 (scripts/etapas-loto.mjs).

  Uso:
    node scripts/escena-estanque.mjs
*/
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HUESO = '#f2eee7';
const GRIS = '#8f8a85';
const OSCURO = '#3b3836';
const ANCHO = 640;
const ALTO = 440;
const AGUA = 360; // altura de la superficie del agua

// ── Bambú: caña levemente curva, con nudos y hojas lanceoladas ──
const hoja = (x, y, giro, largo = 46, opacidad = 0.55) =>
  `<path d="M0 0 C${largo * 0.25} ${-largo * 0.09} ${largo * 0.62} ${-largo * 0.12} ${largo} 0 C${largo * 0.62} ${largo * 0.08} ${largo * 0.25} ${largo * 0.07} 0 0 Z" ` +
  `transform="translate(${x} ${y}) rotate(${giro})" fill="${HUESO}" fill-opacity="0.07" stroke="${HUESO}" stroke-opacity="${opacidad}" stroke-width="1"/>`;

function cana(x, alto, curva, grosor, hojas) {
  const arriba = AGUA - alto;
  const cuerpo = `<path d="M${x} ${AGUA + 6} C${x + curva * 0.3} ${AGUA - alto * 0.35} ${x + curva * 0.8} ${AGUA - alto * 0.7} ${x + curva} ${arriba}" fill="none" stroke="${HUESO}" stroke-opacity="0.5" stroke-width="${grosor}" stroke-linecap="round"/>`;
  // Nudos: pequeñas líneas cruzadas a lo largo de la caña
  const nudos = [];
  for (let t = 0.14; t < 0.98; t += 0.17) {
    const ny = AGUA - alto * t;
    const nx = x + curva * Math.pow(t, 1.6);
    nudos.push(`<path d="M${nx - grosor * 1.6} ${ny} L${nx + grosor * 1.6} ${ny}" stroke="${HUESO}" stroke-opacity="0.55" stroke-width="1.1" stroke-linecap="round"/>`);
  }
  return cuerpo + nudos.join('') + hojas.join('');
}

const bambu = [
  cana(520, 330, -14, 3.2, [hoja(509, 112, -150, 52), hoja(509, 112, -118, 44), hoja(514, 168, -32, 48), hoja(514, 168, -8, 40, 0.4)]),
  cana(556, 270, 10, 2.6, [hoja(563, 150, -40, 46), hoja(563, 150, -72, 38, 0.4), hoja(560, 205, -140, 42)]),
  cana(590, 210, 4, 2.2, [hoja(593, 196, -28, 40), hoja(593, 196, -155, 36, 0.4)]),
].join('');

// ── Agua: líneas de superficie y ondas concéntricas ──
const superficie = [
  `<path d="M120 ${AGUA} L${ANCHO} ${AGUA}" stroke="${GRIS}" stroke-opacity="0.35" stroke-width="1"/>`,
  `<path d="M220 ${AGUA + 14} L${ANCHO - 20} ${AGUA + 14}" stroke="${GRIS}" stroke-opacity="0.22" stroke-width="1"/>`,
  `<path d="M300 ${AGUA + 28} L${ANCHO - 60} ${AGUA + 28}" stroke="${GRIS}" stroke-opacity="0.14" stroke-width="1"/>`,
].join('');
const ondas = (cx, cy, n) =>
  Array.from({ length: n }, (_, i) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${34 + i * 22}" ry="${7 + i * 4.5}" fill="none" stroke="${GRIS}" stroke-opacity="${0.32 - i * 0.08}" stroke-width="1"/>`).join('');

// ── Nenúfar: hoja con muesca, vista en perspectiva ──
function nenufar(cx, cy, rx, ry, muesca = [-28, 8]) {
  const punto = (t) => {
    const r = (t * Math.PI) / 180;
    return [(cx + rx * Math.cos(r)).toFixed(1), (cy + ry * Math.sin(r)).toFixed(1)];
  };
  const [ax, ay] = punto(muesca[0]);
  const [bx, by] = punto(muesca[1]);
  const venas = [50, 95, 140, 185, 230, 275, 320]
    .map((t) => {
      const [x, y] = punto(t);
      return `M${cx} ${cy} L${(cx + (x - cx) * 0.8).toFixed(1)} ${(cy + (y - cy) * 0.8).toFixed(1)}`;
    })
    .join(' ');
  return `<path d="M${cx} ${cy} L${bx} ${by} A${rx} ${ry} 0 1 1 ${ax} ${ay} Z" fill="${OSCURO}" fill-opacity="0.55" stroke="${HUESO}" stroke-opacity="0.45" stroke-width="1"/>` +
    `<path d="${venas}" fill="none" stroke="${HUESO}" stroke-opacity="0.18" stroke-width="0.8"/>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" aria-hidden="true">
  <!-- Escena del estanque: bambú, agua y nenúfares. Dibujo propio. -->
  ${bambu}
  ${superficie}
  ${ondas(330, AGUA + 22, 4)}
  ${nenufar(330, AGUA + 22, 46, 13)}
  ${nenufar(440, AGUA + 40, 34, 9, [160, 196])}
  ${nenufar(225, AGUA + 34, 26, 7, [-40, -8])}
</svg>
`;

const destino = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'estanque.svg');
writeFileSync(destino, svg);
console.log('escena del estanque en public/estanque.svg');

