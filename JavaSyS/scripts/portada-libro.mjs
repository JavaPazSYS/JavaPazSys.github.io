/*
  Saca la portada (primera página) de un libro de marca en PDF y la deja en
  scripts/portadas/<caso>.webp. sincronizar-casos.mjs la usa como imagen del caso
  en la lista de la portada del sitio.

  Uso:
    node scripts/portada-libro.mjs "<node_modules/playwright>" "<libro.pdf>" <caso> [x,y,ancho,alto] [x,y,ancho,alto]

  · <caso> es el nombre del caso en el sitio: villahome, marquesina…
  · El rectángulo opcional (en píxeles de una imagen de 1600 de ancho) tapa la leyenda
    «empresa · documento interno» del pie, que no debe publicarse. Usar - para no tapar nada.
  · El segundo rectángulo recorta la imagen: sirve para los libros en hoja vertical, de los
    que interesa solo la franja del título. Admite un quinto número: margen izquierdo.
  · Dibuja el PDF con pdf.js, cargado desde cdnjs: necesita conexión.
*/
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [rutaPlaywright, pdf, caso, tapar, recorte] = process.argv.slice(2);
const rectangulo = (texto) => (texto && texto !== '-' ? texto.split(',').map(Number) : null);
if (!rutaPlaywright || !pdf || !caso) {
  console.error('Uso: node scripts/portada-libro.mjs "<playwright>" "<libro.pdf>" <caso> [x,y,ancho,alto]');
  process.exit(1);
}
const { chromium } = createRequire(import.meta.url)(resolve(rutaPlaywright));
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168';
const ANCHO = 1600;

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.goto('about:blank');

const url = await pagina.evaluate(
  async ({ datos, ancho, tapar, recorte, PDFJS }) => {
    const pdfjs = await import(`${PDFJS}/pdf.min.mjs`);
    pdfjs.GlobalWorkerOptions.workerSrc = `${PDFJS}/pdf.worker.min.mjs`;
    const bytes = Uint8Array.from(atob(datos), (c) => c.charCodeAt(0));
    const hoja = await (await pdfjs.getDocument({ data: bytes }).promise).getPage(1);
    const vista = hoja.getViewport({ scale: ancho / hoja.getViewport({ scale: 1 }).width });
    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(vista.width);
    lienzo.height = Math.round(vista.height);
    const ctx = lienzo.getContext('2d');
    await hoja.render({ canvasContext: ctx, viewport: vista }).promise;

    if (tapar) {
      // Se rellena con el color del fondo que hay justo encima de la leyenda.
      const [x, y, w, h] = tapar;
      const [r, g, b] = ctx.getImageData(x + Math.round(w / 2), Math.max(0, y - 6), 1, 1).data;
      ctx.fillStyle = `rgb(${r} ${g} ${b})`;
      ctx.fillRect(x, y, w, h);
    }
    if (!recorte) return lienzo.toDataURL('image/webp', 0.9);

    // El quinto número deja un margen a la izquierda, del color del fondo.
    const [x, y, w, h, margen = 0] = recorte;
    const parte = document.createElement('canvas');
    parte.width = w;
    parte.height = h;
    const pincel = parte.getContext('2d');
    const [r, g, b] = ctx.getImageData(x + w - 4, y + 4, 1, 1).data;
    pincel.fillStyle = `rgb(${r} ${g} ${b})`;
    pincel.fillRect(0, 0, w, h);
    pincel.drawImage(lienzo, x, y, w - margen, h, margen, 0, w - margen, h);
    return parte.toDataURL('image/webp', 0.9);
  },
  {
    datos: readFileSync(resolve(pdf)).toString('base64'),
    ancho: ANCHO,
    tapar: rectangulo(tapar),
    recorte: rectangulo(recorte),
    PDFJS,
  },
);
await navegador.close();

const destino = join(dirname(fileURLToPath(import.meta.url)), 'portadas', `${caso}.webp`);
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, Buffer.from(url.split(',')[1], 'base64'));
console.log(`portada de ${caso} en scripts/portadas/${caso}.webp`);
