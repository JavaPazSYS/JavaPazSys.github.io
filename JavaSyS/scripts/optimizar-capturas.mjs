/*
  Genera versiones livianas (WebP, máximo 1600 px de ancho) de las capturas pesadas.
  Parte de la versión censurada si existe; si no, de la original del portafolio.

  Uso:
    node scripts/optimizar-capturas.mjs "C:/ruta/al/portafolio" "C:/ruta/a/node_modules/playwright"

  · Recorre las imágenes que el sitio publica hoy (public/casos/), así que primero hay que
    haber sincronizado una vez.
  · Escribe en scripts/optimizadas/<caso>/<ruta>.webp. sincronizar-casos.mjs las prefiere.
  · Solo guarda la versión nueva si pesa al menos un 20 % menos que la de partida.
  · Tras ejecutarlo hay que volver a sincronizar.
*/
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const [portafolio, rutaPlaywright] = process.argv.slice(2);
if (!portafolio || !rutaPlaywright) {
  console.error('Uso: node scripts/optimizar-capturas.mjs "<portafolio>" "<node_modules/playwright>"');
  process.exit(1);
}
const { chromium } = createRequire(import.meta.url)(resolve(rutaPlaywright));
const aqui = dirname(fileURLToPath(import.meta.url));
const publicadas = join(aqui, '..', 'public', 'casos');
const salida = join(aqui, 'optimizadas');
const ANCHO_MAXIMO = 1600;
const PESO_MINIMO = 150 * 1024; // por debajo de esto no vale la pena tocarla

// Carpeta del portafolio de cada caso: «villahome» → «2026-10_villahome».
const ventana = {};
vm.runInNewContext(readFileSync(join(resolve(portafolio), 'proyectos', 'indice.js'), 'utf8'), { window: ventana });
const carpetaDe = Object.fromEntries(ventana.PORTAFOLIO.map((c) => [c.carpeta.replace(/^\d{4}-\d{2}_/, ''), c.carpeta]));

rmSync(salida, { recursive: true, force: true });
const navegador = await chromium.launch();
const pagina = await navegador.newPage();
let ahorro = 0;

for (const caso of readdirSync(publicadas, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const raizCaso = join(publicadas, caso.name);
  for (const relativa of readdirSync(raizCaso, { recursive: true })) {
    const ruta = relativa.replaceAll('\\', '/');
    if (!/\.(png|webp|jpe?g)$/i.test(ruta) || ruta === 'portada-libro.webp') continue;

    // La imagen de partida nunca es una ya optimizada: se vuelve a la censurada o a la original.
    const censurada = join(aqui, 'censuradas', caso.name, ruta);
    const original = ['.png', '.webp', '.jpg', '.jpeg']
      .map((ext) => join(resolve(portafolio), 'proyectos', carpetaDe[caso.name], ruta.replace(/\.[a-z]+$/i, ext)))
      .find(existsSync);
    const censuradaReal = ['.png', '.webp', '.jpg', '.jpeg'].map((ext) => censurada.replace(/\.[a-z]+$/i, ext)).find(existsSync);
    const origen = censuradaReal ?? original;
    if (!origen || statSync(origen).size < PESO_MINIMO) continue;

    const extension = extname(origen).slice(1).toLowerCase();
    const tipo = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';
    const url = await pagina.evaluate(
      async ({ datos, ancho }) => {
        const imagen = new Image();
        imagen.src = datos;
        await imagen.decode();
        const escala = Math.min(1, ancho / imagen.naturalWidth);
        const lienzo = document.createElement('canvas');
        lienzo.width = Math.round(imagen.naturalWidth * escala);
        lienzo.height = Math.round(imagen.naturalHeight * escala);
        const ctx = lienzo.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
        return lienzo.toDataURL('image/webp', 0.86);
      },
      { datos: `data:${tipo};base64,${readFileSync(origen).toString('base64')}`, ancho: ANCHO_MAXIMO },
    );

    const nueva = Buffer.from(url.split(',')[1], 'base64');
    const antes = statSync(origen).size;
    if (nueva.length > antes * 0.8) continue;

    const destino = join(salida, caso.name, ruta.replace(/\.[a-z]+$/i, '.webp'));
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, nueva);
    ahorro += antes - nueva.length;
    console.log(`${caso.name}/${ruta}: ${Math.round(antes / 1024)} KB → ${Math.round(nueva.length / 1024)} KB`);
  }
}

await navegador.close();
console.log(`\nAhorro total: ${Math.round(ahorro / 1024)} KB. Ahora hay que volver a sincronizar los casos.`);
