# Portafolio de Javiera Becerra

Sitio público del portafolio: diseño UI/UX, QA y desarrollo frontend.
Angular 19, prerenderizado a HTML estático. Se publica en https://javasys.netlify.app.

## Desarrollo

```bash
npm ci
npm start        # servidor de desarrollo en http://localhost:4200
npm run build    # genera dist/javasys/browser, con una página HTML por ruta
```

Para revisar el build tal como se publica (compresión, 404 real, páginas prerenderizadas):

```bash
node scripts/servir-build.mjs 4321
```

## De dónde sale el contenido

| Contenido | Dónde se edita |
|---|---|
| Portada: presentación, método, trayectoria, contacto | `src/app/datos/perfil.ts` |
| Casos | En el portafolio privado (un `datos.js` por caso). Aquí no se escriben: se sincronizan |
| Textos de presentación que reemplazan a los del portafolio | `scripts/textos-publicos.json` |
| Política de privacidad | `src/app/privacidad/` |

## Sincronizar los casos

```bash
node scripts/sincronizar-casos.mjs "C:/ruta/al/portafolio"
```

Copia a `public/casos/` solo lo publicable de cada caso. No salen el entorno de pruebas, las
ramas, los commits, las causas técnicas, los defectos sin cerrar ni los documentos internos.
También escribe `public/sitemap.xml` y `src/app/casos/casos.generado.ts`, que usa el
prerenderizado. Después de sincronizar hay que volver a compilar.

## Scripts de imágenes

Usan Playwright desde una instalación externa (se pasa la ruta de su `node_modules/playwright`),
para no sumar dependencias al sitio. Solo hace falta ejecutarlos cuando cambian las capturas.

| Script | Qué hace | Resultado |
|---|---|---|
| `censurar-capturas.mjs` | Tapa datos reales en las capturas indicadas | `scripts/censuradas/` |
| `optimizar-capturas.mjs` | Pasa las capturas pesadas a WebP de 1600 px | `scripts/optimizadas/` |
| `portada-libro.mjs` | Saca la portada de un libro de marca en PDF | `scripts/portadas/` |
| `imagen-compartir.mjs` | Genera la imagen de vista previa de los enlaces | `public/compartir.png` |

El sincronizador publica de cada captura la mejor versión disponible: optimizada, si no
censurada, si no la original.

## Publicación

En Netlify, el comando de compilación debe ser `npm run build` y la carpeta publicada
`dist/javasys/browser` (confirmarlo en la configuración del sitio).
`public/_redirects` hace que cualquier dirección inexistente responda con código 404.

## Privacidad y medición

Google Analytics 4 se carga únicamente si la persona acepta el aviso
(`src/app/consentimiento.service.ts`). Con la señal Global Privacy Control o Do Not Track del
navegador se entiende rechazado sin preguntar.
