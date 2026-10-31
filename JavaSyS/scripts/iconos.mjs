/*
  Genera el juego de iconos del sitio a partir de public/favicon.svg:
  favicon.ico (32 px), apple-touch-icon.png (180 px), icono-192.png e icono-512.png,
  y public/manifest.webmanifest.

  Uso:
    node scripts/iconos.mjs "C:/ruta/a/node_modules/playwright"
*/
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [rutaPlaywright] = process.argv.slice(2);
if (!rutaPlaywright) {
  console.error('Uso: node scripts/iconos.mjs "<node_modules/playwright>"');
  process.exit(1);
}
const { chromium } = createRequire(import.meta.url)(resolve(rutaPlaywright));
const publico = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const svg = readFileSync(join(publico, 'favicon.svg'), 'utf8');

const navegador = await chromium.launch();
const pagina = await navegador.newPage();

async function png(lado) {
  await pagina.setViewportSize({ width: lado, height: lado });
  await pagina.setContent(`<style>*{margin:0}svg{display:block;width:${lado}px;height:${lado}px}</style>${svg}`);
  return pagina.screenshot({ omitBackground: true });
}

// Un .ico puede llevar dentro un PNG: cabecera de 6 bytes + una entrada de 16 + la imagen.
function ico(imagen, lado) {
  const cabecera = Buffer.alloc(22);
  cabecera.writeUInt16LE(1, 2); // tipo: icono
  cabecera.writeUInt16LE(1, 4); // una imagen
  cabecera.writeUInt8(lado, 6);
  cabecera.writeUInt8(lado, 7);
  cabecera.writeUInt16LE(1, 10); // planos
  cabecera.writeUInt16LE(32, 12); // bits por píxel
  cabecera.writeUInt32LE(imagen.length, 14);
  cabecera.writeUInt32LE(22, 18); // dónde empieza la imagen
  return Buffer.concat([cabecera, imagen]);
}

writeFileSync(join(publico, 'favicon.ico'), ico(await png(32), 32));
writeFileSync(join(publico, 'apple-touch-icon.png'), await png(180));
writeFileSync(join(publico, 'icono-192.png'), await png(192));
writeFileSync(join(publico, 'icono-512.png'), await png(512));
await navegador.close();

writeFileSync(
  join(publico, 'manifest.webmanifest'),
  JSON.stringify(
    {
      name: 'JavaSyS · Portafolio',
      short_name: 'JavaSyS',
      description: 'Diseño UI/UX, QA y desarrollo frontend',
      lang: 'es',
      start_url: '/',
      display: 'browser',
      background_color: '#0d0c0c',
      theme_color: '#0d0c0c',
      icons: [
        { src: 'icono-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icono-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ) + '\n',
);
console.log('iconos y manifiesto generados en public/');
