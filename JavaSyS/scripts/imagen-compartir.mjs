/*
  Genera las imágenes de marca para compartir:
    · public/compartir.png      1200 × 630: la que muestran WhatsApp, LinkedIn, Slack, etc.
                                al compartir un enlace del sitio (og:image).
    · marca/linkedin-banner.png 1584 × 396: la portada del perfil de LinkedIn. El contenido va
                                a la derecha porque la foto de perfil tapa la esquina inferior
                                izquierda.
  Usa el loto de public/loto.svg y las fuentes del sitio.

  Uso:
    node scripts/imagen-compartir.mjs "C:/ruta/a/node_modules/playwright"
*/
import { mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [rutaPlaywright] = process.argv.slice(2);
if (!rutaPlaywright) {
  console.error('Uso: node scripts/imagen-compartir.mjs "<node_modules/playwright>"');
  process.exit(1);
}
const { chromium } = createRequire(import.meta.url)(resolve(rutaPlaywright));
const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const loto = readFileSync(join(raiz, 'public', 'loto.svg'), 'utf8').replace(/<!--[\s\S]*?-->/, '');

const BASE = `
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,500&family=Inter:wght@300;400;600&display=block" rel="stylesheet">
  <style>
    * { margin: 0; box-sizing: border-box; }
    body { background: #0d0c0c; color: #f2eee7; font-family: Inter, sans-serif; overflow: hidden; position: relative; }
    .marca { display: inline-flex; align-items: center; gap: 14px; font-family: 'Cormorant Garamond', serif; font-weight: 500; line-height: 1; }
    .marca i { font-style: normal; font-family: Inter, sans-serif; font-weight: 300; color: #8f8a85; font-size: .62em; margin: 0 .12em; position: relative; top: -.12em; }
    .marca i.b { margin: 0 .06em 0 .1em; }
    .marca em { font-style: italic; }
    .marca svg { height: 1.25em; width: auto; }
    .rol { font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #bdb7b0; }
    .frase { font-family: 'Cormorant Garamond', serif; line-height: 1.15; }
    .web { color: #8f8a85; letter-spacing: 0.04em; }
  </style>`;
const MARCA = `<span class="marca">${loto}<span><i>&lt;</i>Java<i class="b">/</i>S<em>y</em>S<i>&gt;</i></span></span>`;

const COMPARTIR = `<!doctype html><html lang="es"><head><meta charset="utf-8">${BASE}
  <style>
    body { width: 1200px; height: 630px; padding: 64px 80px; display: flex; flex-direction: column; justify-content: space-between; }
    .marca { font-size: 40px; }
    h1 { font-family: 'Cormorant Garamond', serif; font-weight: 400; font-size: 150px; line-height: 0.9; text-transform: uppercase; margin-left: -6px; position: relative; }
    .rol { font-size: 20px; margin-bottom: 22px; }
    .pie { display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; padding-top: 26px; border-top: 1px solid #3b3836; position: relative; }
    .frase { font-size: 36px; max-width: 700px; }
    .web { font-size: 20px; }
  </style></head><body>
  <div>${MARCA}</div>
  <div><p class="rol">Diseño UI/UX · QA · Frontend</p><h1>Javiera<br>Paz B.</h1></div>
  <div class="pie"><p class="frase">Diseño interfaces, las implemento y verifico su calidad con evidencia.</p><p class="web">javasys.netlify.app</p></div>
</body></html>`;

const LINKEDIN = (frase, clase = '') => `<!doctype html><html lang="es"><head><meta charset="utf-8">${BASE}
  <style>
    body { width: 1584px; height: 396px;
           background: radial-gradient(ellipse 620px 360px at 640px 200px, rgba(107,30,43,.30), rgba(107,30,43,0) 70%),
                       linear-gradient(90deg, #1b1918 0%, #121110 45%, #0d0c0c 100%); }
    /* Centro: lo que hace, como sumario de revista. Queda a la derecha de la foto de perfil. */
    .oficios { position: absolute; left: 440px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; gap: 15px; }
    .oficios li { list-style: none; display: flex; align-items: baseline; gap: 14px; font-size: 22px; color: #eee8de; }
    .oficios em { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 26px; color: #a8a29b; width: 28px; }
    .divisor { position: absolute; left: 922px; top: 70px; bottom: 70px; width: 1px; background: linear-gradient(#3b3836, #8b2a3c, #3b3836); }
    .bloque { position: absolute; right: 80px; top: 0; bottom: 0; width: 560px; display: flex; flex-direction: column; justify-content: center; gap: 22px; }
    .marca { font-size: 46px; }
    .rol { font-size: 20px; color: #d4cec6; }
    .frase { font-size: 34px; max-width: 560px; }
    .linea { width: 72px; height: 3px; background: #8b2a3c; }
    .web { font-size: 20px; color: #b0aaa3; }
    .frase.cita { font-style: italic; font-size: 38px; }
  </style></head><body>
  <ul class="oficios">
    <li><em>01</em>Planes de prueba y QA</li>
    <li><em>02</em>Diseño UI/UX y sistemas de diseño</li>
    <li><em>03</em>Libros de marca</li>
    <li><em>04</em>Frontend accesible y rápido</li>
    <li><em>05</em>Pruebas automatizadas y manuales</li>
  </ul>
  <span class="divisor"></span>
  <div class="bloque">
    ${MARCA}
    <p class="rol">Diseño UI/UX · QA · Frontend</p>
    <span class="linea"></span>
    <p class="frase ${clase}">${frase}</p>
    <p class="web">javasys.netlify.app</p>
  </div>
</body></html>`;

const navegador = await chromium.launch();
/* escala 2 exporta al doble de resolución: LinkedIn achica la portada y, sin margen, el texto se ve borroso. */
async function dibujar(html, ancho, alto, destino, escala = 1) {
  mkdirSync(dirname(destino), { recursive: true });
  const hoja = await navegador.newPage({ viewport: { width: ancho, height: alto }, deviceScaleFactor: escala });
  await hoja.setContent(html, { waitUntil: 'networkidle' });
  await hoja.evaluate(() => document.fonts.ready);
  // La lista del centro no debe cruzar el divisor.
  const cruce = await hoja.evaluate(() => {
    const lista = document.querySelector('.oficios');
    const divisor = document.querySelector('.divisor');
    return lista && divisor ? lista.getBoundingClientRect().right - divisor.getBoundingClientRect().left : null;
  });
  if (cruce !== null && cruce > -24) console.warn(`  ¡la lista queda a ${-cruce}px del divisor!`);
  await hoja.screenshot({ path: destino });
  await hoja.close();
  console.log(`${ancho * escala} × ${alto * escala} → ${destino.slice(raiz.length + 1)}`);
}
await dibujar(COMPARTIR, 1200, 630, join(raiz, 'public', 'compartir.png'));
await dibujar(LINKEDIN('Diseño interfaces, las implemento y verifico su calidad con evidencia.'), 1584, 396, join(raiz, 'marca', 'linkedin-banner.png'), 2);
// Variante con su frase de marca.
await dibujar(LINKEDIN('«Entre arte y lógica nace la identidad»', 'cita'), 1584, 396, join(raiz, 'marca', 'linkedin-banner-frase.png'), 2);
await navegador.close();
