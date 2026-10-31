/*
  Sirve el build de producción (dist/javasys/browser) como lo hace Netlify:
  cada página prerenderizada desde su carpeta, compresión, caché larga para los archivos
  con huella y, para lo que no existe, la página de error con código 404.
  Sirve para auditar o revisar el sitio tal como se publica.

  Uso:
    npm run build
    node scripts/servir-build.mjs [puerto]
*/
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'javasys', 'browser');
const puerto = Number(process.argv[2] ?? 4321);
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};
const DE_TEXTO = new Set(['.html', '.js', '.css', '.json', '.svg', '.xml', '.txt']);

if (!existsSync(join(raiz, 'index.html'))) {
  console.error('No existe el build. Ejecuta primero: npm run build');
  process.exit(1);
}

const esArchivo = (ruta) => existsSync(ruta) && statSync(ruta).isFile();

createServer((peticion, respuesta) => {
  const ruta = normalize(decodeURIComponent(new URL(peticion.url, 'http://x').pathname));
  let archivo = join(raiz, ruta);
  let estado = 200;

  if (!archivo.startsWith(raiz)) archivo = '';
  else if (!esArchivo(archivo)) archivo = join(archivo, 'index.html'); // /casos/x → /casos/x/index.html
  if (!esArchivo(archivo)) {
    archivo = join(raiz, 'index.csr.html'); // igual que public/_redirects
    estado = 404;
  }

  const extension = extname(archivo).toLowerCase();
  const cabeceras = {
    'Content-Type': TIPOS[extension] ?? 'application/octet-stream',
    'Cache-Control': /-[A-Z0-9]{8}\.(js|css)$/.test(archivo) ? 'public, max-age=31536000, immutable' : 'no-cache',
    // Copia local de revisión: no debe indexarse.
    'X-Robots-Tag': 'noindex, nofollow',
  };
  let cuerpo;
  try {
    cuerpo = readFileSync(archivo);
  } catch {
    // Mientras se recompila, la carpeta del build queda vacía unos segundos: se avisa y se
    // reintenta solo, en vez de botar el servidor.
    respuesta.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Retry-After': '2' });
    respuesta.end('<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="2"><title>Compilando…</title>' +
      '<body style="background:#0d0c0c;color:#f2eee7;font:16px system-ui;display:grid;place-items:center;height:100vh;margin:0">' +
      'Compilando el sitio… se recarga sola en un momento.</body>');
    return;
  }
  if (DE_TEXTO.has(extension) && /\bgzip\b/.test(peticion.headers['accept-encoding'] ?? '')) {
    cuerpo = gzipSync(cuerpo);
    cabeceras['Content-Encoding'] = 'gzip';
    cabeceras['Vary'] = 'Accept-Encoding';
  }
  respuesta.writeHead(estado, cabeceras);
  respuesta.end(cuerpo);
}).listen(puerto, () => console.log(`Build servido en http://localhost:${puerto}`));
