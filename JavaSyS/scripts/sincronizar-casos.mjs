/*
  Copia los casos del portafolio (carpeta con proyectos/indice.js y un datos.js por caso)
  a public/casos/, que es de donde los lee el sitio.

  Uso:
    npm run casos                     (lee portafolio/, dentro de este repositorio)
    node scripts/sincronizar-casos.mjs "C:/otra/ruta"   (otra carpeta, si hiciera falta)

  portafolio/ está en .gitignore: el repositorio es público y el portafolio guarda fichas e
  informes internos. A GitHub solo llega lo que este script deja en public/casos/.

  · Solo lee del portafolio; nunca escribe en él.
  · Respeta la autorización: si el cliente no está autorizado, su nombre no se copia.
  · Copia solo las imágenes que el caso referencia.
  · El sitio es público: lo lee cualquiera. Del caso se publica solo lo necesario para
    mostrar el trabajo (ver `publicable`). No salen el entorno de pruebas, las ramas, los
    commits, las causas técnicas, los defectos sin cerrar, los documentos internos ni el
    detalle de las corridas (suites, conteos por suite, protocolos de medición y fechas).
  · La imagen de cada caso en la lista es la portada de su libro de marca, si existe
    (scripts/portadas/, generadas con scripts/portada-libro.mjs).
  · Las capturas con datos reales se publican en su versión censurada (scripts/censuradas/,
    la genera scripts/censurar-capturas.mjs) y las pesadas en su versión optimizada
    (scripts/optimizadas/, la genera scripts/optimizar-capturas.mjs).
  · También escribe el mapa del sitio (public/sitemap.xml), public/llms.txt y la lista de casos que usa el
    prerenderizado (src/app/casos/casos.generado.ts).
*/
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const args = process.argv.slice(2);
const aqui = dirname(fileURLToPath(import.meta.url));
const origen = args.find((a) => !a.startsWith('--')) ?? join(aqui, '..', 'portafolio');
if (!existsSync(join(origen, 'proyectos', 'indice.js'))) {
  console.error('No encuentro el portafolio en ' + resolve(origen) + ' (falta proyectos/indice.js).');
  process.exit(1);
}

const raiz = resolve(origen);
const destino = join(aqui, '..', 'public', 'casos');
const SITIO = 'https://javasys.netlify.app';
const esImagen = (ruta) => /\.(png|webp|jpe?g|svg|avif|gif)$/i.test(ruta);
const esExterna = (ruta) => /^https?:\/\//i.test(ruta);

// Ancho y alto de una imagen PNG o WebP, leídos de su cabecera (sin dependencias).
function medir(archivo) {
  const b = readFileSync(archivo);
  if (b.toString('ascii', 1, 4) === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b.toString('ascii', 8, 12) !== 'WEBP') return null;
  const tipo = b.toString('ascii', 12, 16);
  if (tipo === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (tipo === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (tipo === 'VP8L') {
    const n = b.readUInt32LE(21);
    return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)];
  }
  return null;
}

function leerGlobal(archivo, nombre) {
  const ventana = {};
  vm.runInNewContext(readFileSync(archivo, 'utf8'), { window: ventana });
  return ventana[nombre];
}

/*
  Casos que se publican. Los proyectos del empleador actual son confidenciales: el sitio
  menciona solo el cargo y la forma de trabajar (src/app/datos/perfil.ts), y el portafolio
  privado conserva esos casos completos.
*/
const PUBLICADOS = ['villahome', 'semestra-docente', 'marquesina'];
const indice = leerGlobal(join(raiz, 'proyectos', 'indice.js'), 'PORTAFOLIO')
  .filter((c) => !c.ejemplo)
  .filter((c) => PUBLICADOS.includes(c.carpeta.replace(/^\d{4}-\d{2}_/, '')));
// En el sitio los casos se numeran 01, 02, 03… en el orden en que aparecen; el portafolio
// privado conserva su propia numeración.
indice.forEach((c, i) => (c.numero = String(i + 1).padStart(2, '0')));

// Se vacía la carpeta sin borrarla: el servidor de desarrollo la tiene abierta.
mkdirSync(destino, { recursive: true });
for (const nombre of readdirSync(destino)) rmSync(join(destino, nombre), { recursive: true, force: true });

/*
  Deja en el caso solo lo que conviene que lea cualquiera: un reclutador, la competencia
  o alguien con malas intenciones. Lo demás se queda en el portafolio privado.
*/
function publicable(caso) {
  // Un defecto sin cerrar es una debilidad vigente del producto: no se publica.
  // Tampoco el que está corregido en el código pero aún no confirmado en producción.
  const sinCerrar = (h) =>
    /abiert|a medias|sin corregir|por confirmar en producción/i.test(h.estado ?? '') || /^propuesto/i.test(h.solucion ?? '');
  caso.diagnostico.hallazgos = caso.diagnostico.hallazgos
    .filter((h) => !sinCerrar(h))
    .map(({ severidad, area, titulo, dato, esperado, porque, solucion, captura }) => ({
      severidad, area, titulo, dato, esperado, porque, solucion, captura,
    }));

  // Requerimientos: sin identificadores internos y sin los que quedaron incumplidos.
  caso.contexto.requerimientos = caso.contexto.requerimientos
    .filter((r) => r.estado !== 'no')
    .map(({ texto, estado }) => ({ texto, estado }));
  // Sin fechas de proyecto: el período queda solo en el portafolio privado.
  delete caso.meta.periodo;
  delete caso.contexto.restricciones;
  delete caso.contexto.fuera_de_alcance;

  // Mediciones: solo las que mejoraron o se mantuvieron. Las que empeoraron quedan en el
  // registro privado del portafolio.
  const empeoro = (m) => (m.operador === '>=' ? m.despues < m.antes : m.despues > m.antes);
  caso.resultado.metricas = (caso.resultado.metricas ?? []).filter((m) => !empeoro(m));

  // Mediciones e indicadores: el resultado, sin el protocolo de medición.
  caso.resultado.metricas = caso.resultado.metricas.map(({ metrica, operador, umbral, unidad, antes, despues }) => ({
    metrica, operador, umbral, unidad, antes, despues,
  }));
  caso.kpis = (caso.kpis ?? []).map(({ etiqueta, antes, despues, unidad, mejor }) => ({ etiqueta, antes, despues, unidad, mejor }));

  // Pruebas: una frase, las cifras y los tipos de prueba (manual o automatizada, con su
  // herramienta y su número de casos). No se publica cuándo corrió ni cuántas veces pasó,
  // y tampoco el entorno ni el veredicto (es un juicio sobre el producto de un tercero).
  const sinFecha = (texto) => (texto ?? '').replace(/\s*·\s*corrida.*$/i, '').trim();
  const sinVersion = (texto) => (texto ?? '').replace(/\s+\d+(\.\d+)+/g, '').trim();
  caso.pruebas = {
    descripcion: caso.pruebas.descripcion,
    automatizadas: caso.pruebas.automatizadas ?? null,
    defectos: caso.pruebas.defectos?.detectados ?? null,
    corregidos: caso.pruebas.defectos?.cerrados || null,
    tipos: (caso.pruebas.suites ?? []).map(({ nombre, tipo, herramienta, casos }) => ({
      nombre: sinFecha(nombre), tipo, herramienta: sinVersion(herramienta), casos: casos ?? null,
    })),
  };
}

/** Se queda con el primer párrafo: el resto es detalle de la corrida. */
const primerParrafo = (texto) => (texto ?? '').split(/\n\s*\n/)[0].trim();

// Reemplaza un texto del caso por su versión de presentación (scripts/textos-publicos.json).
function ajustar(objeto, ruta, ajuste, slug) {
  const claves = ruta.split('.');
  const ultima = claves.pop();
  const padre = claves.reduce((o, k) => o?.[k], objeto);
  if (typeof padre?.[ultima] !== 'string' || !padre[ultima].includes(ajuste.contiene)) {
    avisos.push(`${slug}: el ajuste de «${ajuste.ruta}» ya no calza con el texto original; revisarlo`);
    return;
  }
  // Con `cambia`, se reemplaza solo esa frase y el resto del texto sigue al día con el portafolio.
  padre[ultima] = ajuste.cambia ? padre[ultima].replace(ajuste.cambia, () => ajuste.texto) : ajuste.texto;
}

// Si el caso tiene libro de marca, su portada (scripts/portadas/<caso>.webp) es la imagen de la lista.
function portadaLibro(slug, salida) {
  const libro = join(aqui, 'portadas', `${slug}.webp`);
  if (!existsSync(libro)) return null;
  copyFileSync(libro, join(salida, 'portada-libro.webp'));
  return 'portada-libro.webp';
}

const textosPublicos = JSON.parse(
  readFileSync(join(aqui, 'textos-publicos.json'), 'utf8'),
);
const avisos = [];
const resumen = [];
const censuradas = new Set();

for (const entrada of indice) {
  const carpeta = join(raiz, 'proyectos', entrada.carpeta);
  const slug = entrada.carpeta.replace(/^\d{4}-\d{2}_/, '');
  const caso = leerGlobal(join(carpeta, 'datos.js'), 'PROYECTO');
  caso.meta.numero = entrada.numero;
  const salida = join(destino, slug);
  const dimensiones = {};
  let copiados = 0;

  // Devuelve la ruta si el archivo se publica; si no, cadena vacía.
  const publicar = (ruta) => {
    if (!ruta) return '';
    if (esExterna(ruta)) return ruta;
    ruta = ruta.split(' · ')[0]; // algún campo trae dos rutas juntas: vale la primera
    if (!esImagen(ruta)) return ''; // ningún documento interno se publica
    if (!existsSync(join(carpeta, ruta))) {
      avisos.push(`${slug}: no existe ${ruta}`);
      return '';
    }
    // De cada captura se publica la mejor versión disponible: la optimizada (WebP más
    // liviano), si no la censurada, y si no la original del portafolio.
    const censurada = join(aqui, 'censuradas', slug, ruta);
    const rutaWebp = ruta.replace(/.[a-z]+$/i, '.webp');
    const optimizada = join(aqui, 'optimizadas', slug, rutaWebp);
    let desde = existsSync(censurada) ? censurada : join(carpeta, ruta);
    if (existsSync(censurada)) censuradas.add(`${slug}/${ruta}`);
    if (existsSync(optimizada)) {
      desde = optimizada;
      ruta = rutaWebp;
    }
    const hacia = join(salida, ruta);
    mkdirSync(dirname(hacia), { recursive: true });
    copyFileSync(desde, hacia);
    const medida = medir(desde);
    if (medida) dimensiones[ruta] = medida;
    copiados++;
    return ruta;
  };

  if (!caso.meta.cliente.autorizado) caso.meta.cliente.nombre = '';

  for (const h of caso.diagnostico.hallazgos) {
    h.captura = publicar(h.captura);
    h.evidencia = publicar(h.evidencia);
  }
  caso.diagnostico.capturas = caso.diagnostico.capturas.filter((c) => (c.src = publicar(c.src)));
  caso.resultado.comparaciones = caso.resultado.comparaciones.filter((c) => {
    c.antes = publicar(c.antes);
    c.despues = publicar(c.despues);
    return c.antes && c.despues;
  });
  caso.resultado.galeria = (caso.resultado.galeria ?? []).filter((g) => (g.src = publicar(g.src)));
  if (caso.marca) {
    caso.marca.logo.versiones = caso.marca.logo.versiones.filter((v) => (v.src = publicar(v.src)));
    for (const t of caso.marca.tipografias) t.imagen = publicar(t.imagen);
    caso.marca.documento = publicar(caso.marca.documento);
  }
  caso.anexos = (caso.anexos ?? []).filter((a) => (a.ruta = publicar(a.ruta)));

  publicable(caso);
  const ajustes = textosPublicos[slug] ?? [];
  for (const a of ajustes.filter((a) => !a.ruta.startsWith('indice.'))) ajustar(caso, a.ruta, a, slug);
  for (const a of ajustes.filter((a) => a.ruta.startsWith('indice.'))) ajustar(entrada, a.ruta.slice(7), a, slug);
  // Después de los ajustes, para que tampoco un texto de presentación traiga el detalle.
  caso.pruebas.descripcion = caso.pruebas.automatizadas
    ? 'Las pruebas se hacen contra un entorno aislado en Docker.'
    : primerParrafo(caso.pruebas.descripcion);

  // Ancho y alto de cada imagen: la página reserva su espacio y no salta al cargarlas.
  caso.dimensiones = dimensiones;

  mkdirSync(salida, { recursive: true });
  writeFileSync(join(salida, 'datos.json'), JSON.stringify(caso));

  const principal = caso.resultado.comparaciones.find((c) => c.portada) ?? caso.resultado.comparaciones[0];
  resumen.push({
    numero: entrada.numero,
    slug,
    titulo: caso.meta.titulo || entrada.titulo,
    cliente: caso.meta.cliente.autorizado ? caso.meta.cliente.nombre : caso.meta.cliente.descripcion_anonima,
    periodo: caso.meta.periodo,
    disciplinas: entrada.disciplinas,
    resumen: entrada.resumen,
    kpi: entrada.kpi,
    portada: portadaLibro(slug, salida) ?? principal?.despues ?? caso.resultado.galeria[0]?.src ?? '',
  });
  const ultimo = resumen.at(-1);
  ultimo.dimensiones = ultimo.portada ? (medir(join(salida, ultimo.portada)) ?? dimensiones[ultimo.portada] ?? null) : null;
  console.log(`${entrada.numero} ${slug}: ${copiados} archivos`);
}

writeFileSync(join(destino, 'indice.json'), JSON.stringify(resumen));

// Lista de casos para el prerenderizado: Angular genera una página HTML por cada uno.
writeFileSync(
  join(aqui, '..', 'src', 'app', 'casos', 'casos.generado.ts'),
  `// Generado por scripts/sincronizar-casos.mjs. No editar a mano.
export const CASOS_PUBLICADOS = ${JSON.stringify(resumen.map((c) => c.slug))};
`,
);

// Mapa del sitio, con la fecha de esta sincronización.
const hoy = new Date().toISOString().slice(0, 10);
// Las páginas de área coinciden con «ruta» en src/app/datos/areas.ts.
const areas = ['/diseno-ui-ux', '/qa', '/frontend'];
const paginas = [
  ['/', '1.0'],
  ...areas.map((ruta) => [ruta, '0.9']),
  ...resumen.map((c) => [`/casos/${c.slug}`, '0.8']),
  ['/privacidad', '0.2'],
];
writeFileSync(
  join(aqui, '..', 'public', 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginas.map(([ruta, prioridad]) => `  <url><loc>${SITIO}${ruta}</loc><lastmod>${hoy}</lastmod><priority>${prioridad}</priority></url>`).join('\n')}
</urlset>
`,
);

// llms.txt: resumen del sitio para asistentes de IA (robots.txt les permite leerlo).
writeFileSync(
  join(aqui, '..', 'public', 'llms.txt'),
  `# Javiera Paz B.

> Portafolio de Javiera Paz B., ingeniera en Informática: diseño UI/UX, QA y desarrollo frontend. Describe su método de trabajo por área y documenta casos reales con sus pruebas.

## Áreas

- [Diseño UI/UX](${SITIO}/diseno-ui-ux): diagnóstico medido, sistema de diseño, plan de pruebas de UI/UX y libro de marca.
- [QA](${SITIO}/qa): ciclo de pruebas completo, del plan con matriz de riesgo al informe de cierre.
- [Frontend](${SITIO}/frontend): rendimiento, llamadas eficientes, seguridad y código con pruebas.

## Casos

${resumen.map((c) => `- [${c.titulo}](${SITIO}/casos/${c.slug}): ${c.resumen}`).join('\n')}

## Contacto

- [Portada y contacto](${SITIO}/)
`,
);

console.log(`${censuradas.size} capturas publicadas en su versión censurada`);
console.log(`\n${resumen.length} casos en public/casos/`);
if (avisos.length) console.warn('\nAvisos:\n' + avisos.map((a) => '  · ' + a).join('\n'));

