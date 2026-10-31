/*
  Las tres áreas del sitio. Cada una tiene su página: quien busca diseño, QA o frontend
  encuentra el método, las pruebas y los casos de esa área sin pasar por las otras dos.
  El contenido sale del QA toolkit, de la guía de estándares web, de los libros de marca
  y de los CV; se edita aquí.
*/

export type ClaveArea = 'diseno' | 'qa' | 'frontend';

export interface Bloque {
  titulo: string;
  /** «etapas»: pasos numerados con detalle. «lista»: enumeración breve. */
  tipo: 'etapas' | 'lista';
  introduccion?: string;
  etapas?: { titulo: string; detalle: string }[];
  puntos?: string[];
}

export interface Area {
  clave: ClaveArea;
  /** Dirección de la página, sin barra inicial. */
  ruta: string;
  numero: string;
  /** Nombre corto: menú y tarjetas de la portada. */
  nombre: string;
  /** Titular de la página. */
  titulo: string;
  /** Una frase: qué hago en esta área. */
  lema: string;
  descripcion: string;
  /** Tres ideas que resumen la página. */
  resumen: string[];
  bloques: Bloque[];
  entregables: string[];
  herramientas: string[];
  /** Posición del CV de esta área en PERFIL.cv. */
  cv: number;
  /** Casos del área, en el orden en que conviene leerlos, y qué muestra cada uno de ella. */
  casos: { slug: string; enfoque: string; ancla: string }[];
  seo: { titulo: string; descripcion: string };
}

export const AREAS: Area[] = [
  {
    clave: 'diseno',
    ruta: 'diseno-ui-ux',
    numero: '01',
    nombre: 'Diseño UI/UX',
    titulo: 'Diseño UI/UX e identidad de marca',
    lema: 'Diseño interfaces y sistemas de diseño que el equipo puede construir y sostener.',
    descripcion:
      'Diseño la interfaz desde el diagnóstico hasta la alta fidelidad, con un sistema de diseño detrás y la marca documentada en un libro. Trabajo contra una norma propia de 204 criterios verificables, cada uno clasificado como bloqueante, importante o recomendado.',
    resumen: [
      'El diagnóstico se mide antes de proponer: cada hallazgo queda con su evidencia.',
      'Ninguna pantalla está terminada sin sus cinco estados: ideal, vacío, carga, parcial y error.',
      'La identidad se entrega como libro de marca, con cada valor ligado a un token del código.',
    ],
    bloques: [
      {
        titulo: 'Etapas del diseño',
        tipo: 'etapas',
        etapas: [
          {
            titulo: 'Comprensión del producto',
            detalle:
              'Antes de diseñar recorro la aplicación completa: quién la usa, qué tareas resuelve y qué reglas de negocio la gobiernan. Registro el estado inicial con capturas y mediciones.',
          },
          {
            titulo: 'Diagnóstico',
            detalle:
              'Audito el estado inicial contra la norma: jerarquía visual, color y contraste, tipografía, contenido, adaptación móvil, navegación por teclado y los estados de cada componente. Cada hallazgo queda con su evidencia y su severidad.',
          },
          {
            titulo: 'Sistema de diseño',
            detalle:
              'Defino los tokens de color, tipografía, espaciado y radios, y los componentes con sus estados de interacción. El sistema se documenta junto al código para que el equipo pueda sostenerlo.',
          },
          {
            titulo: 'Diseño de pantallas y estados',
            detalle:
              'Trabajo en Figma, del wireframe a la alta fidelidad. El estado ideal se prueba con los datos más exigentes —el nombre más largo, la cifra de más dígitos—, no con el ejemplo favorable.',
          },
          {
            titulo: 'Verificación',
            detalle:
              'Ejecuto el plan de pruebas de UI/UX sobre la versión implementada, con el mismo protocolo que se utilizó en el diagnóstico.',
          },
          {
            titulo: 'Entrega',
            detalle:
              'Comparación antes y después con la misma vista, el mismo ancho y los mismos datos. Cada decisión de diseño queda documentada con su motivo y la alternativa descartada.',
          },
        ],
      },
      {
        titulo: 'Plan de pruebas de UI/UX',
        tipo: 'lista',
        puntos: [
          'Adaptación: desborde lateral medido en anchos de 300 a 1440 px; el resultado esperado es cero',
          'Teclado: recorrido completo con tabulador, foco visible y orden correcto',
          'Contraste: calculado con la fórmula de WCAG, en tema claro y oscuro, incluidas las capas translúcidas',
          'Accesibilidad automatizada con axe-core: cero violaciones críticas o serias',
          'Los cinco estados de cada componente, con inventario como evidencia',
          'Contenido: ortografía, rótulos y mensajes de error que indican qué ocurrió y qué hacer',
        ],
      },
      {
        titulo: 'Contenido del libro de marca',
        tipo: 'etapas',
        introduccion:
          'La identidad se entrega como un libro de marca y sistema de diseño: explica por qué el sistema es como es y sirve de referencia para resolver una pantalla concreta.',
        etapas: [
          {
            titulo: 'Fundamento',
            detalle:
              'Qué es el producto, quién lo usa y qué debe proteger el diseño. Incluye los principios con los que se resuelve cualquier caso que el libro no haya previsto.',
          },
          {
            titulo: 'Logotipo',
            detalle:
              'Construcción, versiones autorizadas, reducción mínima y usos indebidos. El símbolo debe funcionar en un solo color y en negativo.',
          },
          {
            titulo: 'Color',
            detalle:
              'Una paleta con función: el color de marca se mantiene separado de los colores de estado. Cada combinación de texto y fondo se publica con su contraste calculado.',
          },
          {
            titulo: 'Tipografía, retícula y espaciado',
            detalle:
              'Dos familias con funciones definidas, una escala de tamaños, cifras tabulares para los datos, escala de espaciado, ritmo vertical y radios.',
          },
          {
            titulo: 'Componentes',
            detalle: 'Botones, campos, tarjetas y estados vacíos, cada uno con sus variantes y sus estados de interacción.',
          },
          {
            titulo: 'Voz y escritura',
            detalle: 'Rótulos, nombres de estado, mensajes de error, formato de fechas y tratamiento de los datos ausentes.',
          },
          {
            titulo: 'Accesibilidad, temas y tokens',
            detalle:
              'Requisitos verificables sobre una pantalla terminada, el comportamiento de la marca en tema claro y oscuro, y el sistema expresado en variables listas para el código.',
          },
        ],
      },
    ],
    entregables: [
      'Diagnóstico inicial con evidencia',
      'Prototipo en Figma',
      'Sistema de diseño: tokens y componentes',
      'Libro de marca y sistema de diseño (PDF)',
      'Informe de verificación antes y después',
    ],
    herramientas: ['Figma', 'Prototipado', 'Wireframing', 'Design systems', 'Tokens de diseño', 'WCAG 2.2', 'axe-core'],
    cv: 0,
    casos: [
      {
        slug: 'villahome',
        enfoque: 'Rediseño editorial del sitio y del panel de un taller de tapicería: ficha de producto en cuatro pasos, categorías en árbol y un solo sistema de controles en 16 secciones, documentado en un libro de marca de 30 páginas.',
        ancla: 'intervencion',
      },
      {
        slug: 'semestra-docente',
        enfoque: 'Producto propio: 15 pantallas, cuatro paletas según el nivel de enseñanza y libro de marca.',
        ancla: 'marca',
      },
      {
        slug: 'marquesina',
        enfoque: 'Sitio de pedidos sin pagos: sistema visual propio, libro de marca de 29 páginas y la regla de que ninguna pantalla diga «pagar».',
        ancla: 'marca',
      },
    ],
    seo: {
      titulo: 'Diseño UI/UX y sistemas de diseño · JavaSyS',
      descripcion:
        'Cómo trabajo el diseño UI/UX: diagnóstico medido, sistema de diseño, los cinco estados de cada pantalla, plan de pruebas de UI/UX y libro de marca. Con casos reales.',
    },
  },
  {
    clave: 'qa',
    ruta: 'qa',
    numero: '02',
    nombre: 'QA',
    titulo: 'QA: aseguramiento de calidad',
    lema: 'Planifico y ejecuto el ciclo de pruebas completo, del plan al informe de cierre.',
    descripcion:
      'Cubro las aplicaciones web desde la ficha de inicio hasta el informe de cierre, con casos trazables a requisitos. Mi formación como desarrolladora me permite informar defectos reproducibles y con la causa raíz acotada.',
    resumen: [
      'El esfuerzo de prueba se asigna por riesgo: probabilidad por impacto.',
      'Todo se prueba en un entorno aislado en Docker, con datos sintéticos.',
      'Cada defecto se sigue hasta verificar su cierre sobre la versión corregida.',
    ],
    bloques: [
      {
        titulo: 'Etapas del ciclo de pruebas',
        tipo: 'etapas',
        etapas: [
          {
            titulo: 'Ficha de inicio',
            detalle:
              'Registro el producto, los ambientes, los accesos, los roles, los flujos críticos y las integraciones. Si falta un requisito obligatorio, el ciclo no comienza y el bloqueo queda documentado.',
          },
          {
            titulo: 'Entorno de pruebas',
            detalle:
              'Levanto la aplicación en Docker con una base sembrada con datos sintéticos y, como mínimo, un usuario por rol. Anoto la versión de la imagen y de la semilla, que se citan en cada resultado.',
          },
          {
            titulo: 'Plan de pruebas y matriz de riesgo',
            detalle:
              'Defino el objetivo, el alcance y las exclusiones con su justificación. Autenticación, autorización por rol, pagos, datos personales, correos y migraciones se tratan siempre como riesgo alto. El plan fija los umbrales no funcionales y los criterios de entrada, salida y suspensión.',
          },
          {
            titulo: 'Smoke y sanity',
            detalle:
              'En cada despliegue verifico un flujo real completo, con base de datos y dependencias. Tras una corrección ejecuto una comprobación acotada; si lo básico falla, la versión se devuelve antes de continuar.',
          },
          {
            titulo: 'Casos funcionales',
            detalle:
              'Diseño los casos a partir de un catálogo de suites por módulo: autenticación, permisos, formularios, listados, archivos, pagos, correos, y estado, flujos y concurrencia. Aplico partición de equivalencia, valores límite, tablas de decisión y transición de estados.',
          },
          {
            titulo: 'Sesiones exploratorias',
            detalle:
              'Sesiones de 60 minutos guiadas por un charter, con objetivo, notas, hallazgos y preguntas abiertas para el equipo.',
          },
          {
            titulo: 'Pruebas no funcionales',
            detalle:
              'Rendimiento, accesibilidad (WCAG 2.2 AA), seguridad (OWASP Top 10), compatibilidad y SEO técnico. Cada medición se registra en una tabla comparativa contra su umbral.',
          },
          {
            titulo: 'Gestión de defectos',
            detalle:
              'Una ficha por defecto, con severidad de S1 a S4, entorno, pasos de reproducción y causa. Realizo el seguimiento hasta verificar el cierre y la regresión asociada.',
          },
          {
            titulo: 'Informe de ciclo y cierre',
            detalle:
              'Trazabilidad de requisito a caso y resultado, métricas de la versión, riesgos residuales, desviaciones aceptadas y un veredicto: apto, apto con reservas o no apto.',
          },
        ],
      },
      {
        titulo: 'Tipos de prueba que ejecuto',
        tipo: 'lista',
        puntos: [
          'Funcionales, de regresión, de integración y de extremo a extremo',
          'Smoke y sanity en cada despliegue',
          'APIs REST: contratos, códigos de respuesta y manejo de errores',
          'Permisos y recorte por rol, por interfaz y por API',
          'Estado, valores nulos, borrado, reintentos y concurrencia',
          'Accesibilidad, rendimiento, seguridad y compatibilidad',
          'Automatización con Playwright, Cypress y Selenium',
        ],
      },
      {
        titulo: 'Criterios que no se negocian',
        tipo: 'lista',
        puntos: [
          'Un hallazgo responde cuatro preguntas: qué se observó, contra qué umbral, por qué falla y cómo se soluciona',
          'Ninguna cifra sin su condición de medición; en tiempos, la mediana de al menos cinco ejecuciones',
          'Lo que no se ejecutó se informa como no ejecutado, nunca como aprobado',
          'Tener sesión no es tener permiso: si la interfaz deniega, se intenta también por API',
          'Los datos de prueba no deben ser amables: nombres con apóstrofo, valores nulos y volumen',
        ],
      },
    ],
    entregables: [
      'Plan de pruebas con matriz de riesgo',
      'Registro de casos y trazabilidad a requisitos',
      'Fichas de defecto',
      'Tabla comparativa de mediciones',
      'Informe de cierre con veredicto',
    ],
    herramientas: ['Playwright', 'Cypress', 'Selenium', 'Postman', 'axe-core', 'Docker', 'CI/CD en Azure DevOps'],
    cv: 1,
    casos: [
      {
        slug: 'villahome',
        enfoque: 'Dos ciclos en Docker con una semilla de volumen: 108 pruebas automatizadas en verde, revisión manual guiada de 27 puntos y 13 de 14 defectos corregidos y verificados.',
        ancla: 'pruebas',
      },
      {
        slug: 'semestra-docente',
        enfoque: '481 pruebas escritas: 378 unitarias y 103 de extremo a extremo repartidas en perfiles de uso, más una auditoría de seguridad externa atendida.',
        ancla: 'pruebas',
      },
      {
        slug: 'marquesina',
        enfoque: 'Ciclo completo sobre el sitio ya publicado: 95 casos, 88 pruebas automatizadas y 12 defectos, 11 de ellos corregidos y verificados.',
        ancla: 'pruebas',
      },
    ],
    seo: {
      titulo: 'QA y aseguramiento de calidad: plan de pruebas · JavaSyS',
      descripcion:
        'Cómo trabajo en QA: ficha de inicio, entorno en Docker, plan de pruebas con matriz de riesgo, casos funcionales, automatización, gestión de defectos e informe de cierre.',
    },
  },
  {
    clave: 'frontend',
    ruta: 'frontend',
    numero: '03',
    nombre: 'Frontend',
    titulo: 'Desarrollo frontend',
    lema: 'Construyo interfaces rápidas, seguras y sin errores, fieles al diseño.',
    descripcion:
      'Implemento en Angular y React sobre aplicaciones en producción. Que la interfaz se vea como el diseño es el punto de partida: además debe cargar rápido, pedir al servidor solo lo necesario, no dejar errores en la consola y no confiar la seguridad a lo que la pantalla oculta.',
    resumen: [
      'El rendimiento se mide contra un presupuesto de peso y contra Core Web Vitals, no se estima.',
      'Las llamadas a la API se agrupan por pantalla y se paralelizan: sin cascadas ni peticiones repetidas.',
      'Ocultar un botón no es un control: lo que la interfaz deniega también lo deniega el servidor.',
    ],
    bloques: [
      {
        titulo: 'Etapas de la implementación',
        tipo: 'etapas',
        etapas: [
          {
            titulo: 'Lectura del diseño y de los datos',
            detalle:
              'Antes de escribir código identifico los componentes, sus estados y qué datos necesita cada pantalla: de dónde vienen, cuántas llamadas requieren y qué pasa cuando faltan.',
          },
          {
            titulo: 'Estructura semántica',
            detalle:
              'HTML semántico: un solo título principal por página, encabezados en orden, regiones identificadas y controles reales en vez de cajas con eventos.',
          },
          {
            titulo: 'Componentes y estado',
            detalle:
              'Componentes reutilizables en Angular o React con TypeScript, con el estado en un solo lugar y los estilos tomados de tokens, sin valores sueltos.',
          },
          {
            titulo: 'Integración con la API',
            detalle:
              'Autenticación, consumo de datos y control de errores. Una pantalla pide lo que necesita en el menor número de llamadas, en paralelo cuando no dependen entre sí, y los listados largos se paginan.',
          },
          {
            titulo: 'Estados y errores',
            detalle:
              'Cada vista se implementa con sus estados ideal, vacío, carga, parcial y error. Un fallo muestra qué ocurrió y permite reintentar sin recargar ni perder lo escrito; nunca una pantalla en blanco.',
          },
          {
            titulo: 'Rendimiento',
            detalle:
              'Código dividido por ruta, carga diferida de lo pesado, imágenes en formato moderno con dimensiones declaradas y contenido presente en el HTML servido.',
          },
          {
            titulo: 'Seguridad',
            detalle:
              'Ningún secreto en el código del cliente, entradas validadas y escapadas, y permisos comprobados contra el servidor, no solo en la interfaz.',
          },
          {
            titulo: 'Pruebas y revisión',
            detalle:
              'Pruebas unitarias y de extremo a extremo, consola y red sin errores, revisión de código y entrega por Git con integración continua.',
          },
        ],
      },
      {
        titulo: 'Rendimiento',
        tipo: 'lista',
        introduccion: 'Los umbrales están declarados de antemano; una página se mide contra ellos antes de publicarse.',
        puntos: [
          'Core Web Vitals en verde: LCP de 2,5 s o menos, INP de 200 ms o menos y CLS de 0,1 o menos',
          'Presupuesto de peso: hasta 170 KB de JavaScript comprimido en la ruta inicial y 1 MB en la primera carga',
          'Código dividido por ruta y carga diferida de lo pesado: editores, mapas, gráficos',
          'Sin librerías desproporcionadas: no se importa una librería completa por una sola función',
          'Imágenes en WebP o AVIF, con ancho y alto declarados para que la página no salte al cargar',
          'Archivos con huella en el nombre, caché de larga duración y compresión activa',
          'Cada script de terceros se justifica, se difiere y se mide',
        ],
      },
      {
        titulo: 'Llamadas eficientes',
        tipo: 'lista',
        puntos: [
          'Las llamadas se agrupan por pantalla y lo independiente se pide en paralelo: sin cascadas encadenadas',
          'La carga inicial se estabiliza en menos de 3 segundos y con un número acotado de peticiones',
          'Los listados largos se paginan, o la pantalla declara que muestra solo una parte',
          'Sin doble envío: el botón se deshabilita mientras procesa y hay confirmación explícita al terminar',
          'Reintentar no es repetir: un reintento no produce un segundo efecto',
          'Cero peticiones fallidas en la pestaña de red: fuentes, imágenes, iconos y servicios',
        ],
      },
      {
        titulo: 'Seguridad',
        tipo: 'lista',
        puntos: [
          'Cero secretos en el código del cliente: ni claves privadas, ni tokens, ni cadenas de conexión',
          'Lo que la interfaz oculta o deshabilita también está denegado en el servidor; se comprueba por API',
          'Validación en el cliente y en el servidor, con las entradas escapadas contra inyección de código',
          'Mapas de código fuente no expuestos en producción',
          'Dependencias sin vulnerabilidades altas ni críticas, revisadas en cada entrega',
          'Cookies con los atributos Secure, HttpOnly y SameSite, según su función',
          'Sin comentarios sensibles ni rutas internas en el HTML servido',
        ],
      },
      {
        titulo: 'Consola y errores',
        tipo: 'lista',
        puntos: [
          'Cero errores en la consola, al cargar y después de interactuar',
          'Cero advertencias del framework: hidratación, claves de listas, propiedades inválidas',
          'Sin registros de depuración en el código que se publica',
          'Sin código muerto ni componentes que nadie usa',
          'Un error inesperado muestra una pantalla útil y queda registrado',
        ],
      },
      {
        titulo: 'Este sitio como muestra',
        tipo: 'lista',
        introduccion: 'El portafolio está construido con los mismos criterios que describe.',
        puntos: [
          'Angular 19 con componentes standalone y signals, y código dividido por ruta',
          'Cada página se entrega como HTML ya generado, con su título, descripción y URL canónica',
          'Sin errores de consola y sin desplazamiento lateral desde 300 px de ancho',
          'Las capturas pesadas se sirven en WebP, y todas con sus dimensiones declaradas',
          'Una dirección inexistente responde con código 404, no con una página vacía',
          'La medición de visitas se carga solo con consentimiento previo',
        ],
      },
    ],
    entregables: [
      'Interfaz implementada y fiel al diseño',
      'Componentes reutilizables',
      'Pruebas automatizadas',
      'Medición de rendimiento contra el presupuesto',
      'Informe de verificación: consola, red, seguridad y accesibilidad',
    ],
    herramientas: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5 semántico', 'SCSS', 'APIs REST', 'SSR y prerenderizado', 'Playwright', 'Git', 'Azure DevOps'],
    cv: 0,
    casos: [
      {
        slug: 'villahome',
        enfoque: 'React con Supabase: el panel descarga 20 KB al entrar en vez de 129 y muestra las 1.206 órdenes paginadas en 281 ms, donde antes mostraba 200 en 931 ms.',
        ancla: 'diagnostico',
      },
      {
        slug: 'semestra-docente',
        enfoque: 'Aplicación completa en Angular 19, con standalone y signals; los nombres de los estudiantes se cifran en el navegador y el servidor guarda texto ilegible.',
        ancla: 'intervencion',
      },
      {
        slug: 'marquesina',
        enfoque: 'Angular 19 con Supabase: el panel pasó de mostrar 1.000 pedidos en 3,5 s a mostrarlos todos en 0,9 s, y la página de categoría dejó de saltar al cargar.',
        ancla: 'diagnostico',
      },
    ],
    seo: {
      titulo: 'Frontend: rendimiento, seguridad y código · JavaSyS',
      descripcion:
        'Cómo construyo interfaces en Angular y React: rendimiento medido contra presupuesto, llamadas eficientes a la API, seguridad, consola sin errores y código entregado con pruebas.',
    },
  },
];

export const areaPorRuta = (ruta: string): Area | undefined => AREAS.find((a) => a.ruta === ruta);
