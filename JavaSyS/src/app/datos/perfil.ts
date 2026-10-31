/* Contenido de la portada. Sale de los CV; se edita aquí. */

/* Datos del sitio publicado: URL canónica, imagen para compartir y medición. */
export const SITIO = {
  url: 'https://javasys.netlify.app',
  imagen: 'compartir.png',
  analitica: 'G-PJFE3W2KK8',
};

export const PERFIL = {
  nombre: 'Javiera Paz B.',
  rol: 'Diseño UI/UX · QA · Frontend',
  correo: 'jp.becerradiaz@gmail.com',
  linkedin: 'https://www.linkedin.com/in/javiera-paz-becerra-diaz-90517a196/',
  titular: 'Diseño interfaces, las implemento y verifico su calidad con evidencia.',
  intro:
    'Soy ingeniera en Informática. Trabajo en diseño UI/UX, aseguramiento de calidad y desarrollo frontend con un mismo criterio: cada decisión se justifica y cada resultado se mide.',
  cv: [
    { nombre: 'CV · Diseño UI/UX y Frontend', archivo: 'cv/cv-javiera-becerra-uiux-frontend.pdf' },
    { nombre: 'CV · QA', archivo: 'cv/cv-javiera-becerra-qa.pdf' },
  ],
};

/*
  Botón «Correo»: abre la redacción de Gmail en otra pestaña, con el asunto y un
  mensaje listo para completar. El correo no se muestra escrito en el sitio.
*/
const ASUNTO = 'Contacto desde tu portafolio';
const MENSAJE = `Hola, Javiera:

Me gustaría contactar contigo. Soy [tu nombre], de [empresa o proyecto], y te escribo por [una oportunidad laboral / un proyecto / una consulta].

[Cuéntame en pocas líneas qué necesitas.]

Puedes responderme a este correo o escribirme a [teléfono o LinkedIn].

Saludos,
[tu nombre]`;

export const ESCRIBIR_CORREO =
  'https://mail.google.com/mail/?view=cm&fs=1' +
  `&to=${encodeURIComponent(PERFIL.correo)}` +
  `&su=${encodeURIComponent(ASUNTO)}` +
  `&body=${encodeURIComponent(MENSAJE)}`;

/*
  Botón «LinkedIn»: abre el perfil en otra pestaña y deja copiado este mensaje para pegarlo en
  «Mensaje». LinkedIn no permite abrir un chat con texto precargado desde otro sitio.
*/
export const MENSAJE_LINKEDIN = `Hola, Javiera. Me gustaría contactar contigo. Soy [tu nombre], de [empresa o proyecto], y te escribo por [una oportunidad laboral / un proyecto / una consulta]. [Cuéntame en pocas líneas qué necesitas.] Saludos.`;

/* Principios que aplican a las tres áreas (el detalle de cada una está en areas.ts). */
export const PRINCIPIOS = [
  {
    titulo: 'Evidencia antes que opinión',
    texto:
      'Cada hallazgo responde cuatro preguntas: qué se observó, contra qué umbral y de qué fuente, por qué falla y cómo se soluciona.',
  },
  {
    titulo: 'Ninguna cifra sin su condición',
    texto:
      'Toda medición declara la herramienta, la condición y el número de repeticiones. En métricas de tiempo informo la mediana de al menos cinco ejecuciones.',
  },
  {
    titulo: 'Entorno reproducible',
    texto:
      'Las pruebas se ejecutan en un entorno aislado en Docker, con datos sintéticos. No utilizo datos de personas reales ni ambientes de producción.',
  },
  {
    titulo: 'Lo no ejecutado no se aprueba',
    texto:
      'Una prueba sin ejecutar se informa como no ejecutada. Un defecto se cierra únicamente con verificación sobre la versión corregida.',
  },
];

/*
  Forma de trabajo común a las tres áreas: metodología ágil y normas de referencia.
  «areas» indica en qué páginas de área se muestra cada norma (claves de datos/areas.ts).
  Las normas son marcos de referencia para lo que se mide; no declaran certificaciones.
*/
export const FORMA_DE_TRABAJO = {
  agil: [
    {
      titulo: 'Scrum',
      texto:
        'Trabajo en sprints, con historias refinadas que llevan criterios de aceptación verificables. Participo en la planificación, la reunión diaria, la revisión y la retrospectiva.',
    },
    {
      titulo: 'Calidad dentro del sprint',
      texto:
        'Las pruebas no son una fase final. Una historia se da por terminada cuando su diseño está verificado, sus casos ejecutados y sus defectos cerrados o aceptados por producto.',
    },
    {
      titulo: 'Ramas y revisión de código',
      texto:
        'Cada trabajo va en su rama y se integra mediante una solicitud con revisión. Ningún cambio llega directo a la rama principal.',
    },
    {
      titulo: 'Integración y entrega continuas',
      texto:
        'Las suites automatizadas se ejecutan en el pipeline de Azure DevOps. Una prueba que falla detiene la entrega.',
    },
  ],
  normas: [
    {
      nombre: 'ISO/IEC 27001',
      ambito: 'Seguridad de la información',
      uso: 'Referencia para el manejo de datos y accesos: datos sintéticos en las pruebas, ambientes separados, control de acceso por rol verificado, ningún secreto en el código y dependencias revisadas.',
      areas: ['qa', 'frontend'],
    },
    {
      nombre: 'OWASP Top 10',
      ambito: 'Seguridad de aplicaciones web',
      uso: 'Base de las pruebas de seguridad: control de acceso, inyección, exposición de datos y configuración.',
      areas: ['qa', 'frontend'],
    },
    {
      nombre: 'WCAG 2.2, nivel AA',
      ambito: 'Accesibilidad',
      uso: 'Contraste, teclado, foco, etiquetas y adaptación. Se aplica en el diseño, en el código y en las pruebas.',
      areas: ['diseno', 'qa', 'frontend'],
    },
    {
      nombre: 'Core Web Vitals',
      ambito: 'Rendimiento',
      uso: 'Umbrales de carga, respuesta y estabilidad visual contra los que se mide cada página.',
      areas: ['qa', 'frontend'],
    },
    {
      nombre: 'Heurísticas de Nielsen',
      ambito: 'Usabilidad',
      uso: 'Criterio para evaluar flujos, estados y mensajes durante el diagnóstico de diseño.',
      areas: ['diseno'],
    },
  ],
};

export const EXPERIENCIA = [
  {
    cargo: 'QA y UI/UX',
    empresa: 'Capital Inteligente',
    periodo: 'Octubre 2026 – Presente',
    puntos: [
      'Planes y casos de prueba funcionales con trazabilidad a requisitos y criterios de aceptación.',
      'Automatización end-to-end con Cypress y Playwright, suites de regresión con Selenium y pruebas de APIs REST con Postman.',
      'Entornos de prueba aislados en Docker, con datos sintéticos.',
      'Gestión de defectos visuales y funcionales hasta su cierre, en coordinación con desarrollo.',
      'Continúo a cargo del diseño de interfaces y del sistema de diseño.',
    ],
  },
  {
    cargo: 'Diseñadora UI/UX',
    empresa: 'Capital Inteligente',
    periodo: 'Mayo – Septiembre 2026',
    puntos: [
      'Diseño de interfaces y prototipos funcionales en Figma, desde wireframes hasta alta fidelidad.',
      'Definición y mantenimiento de un design system: tokens, componentes, estados de interacción y guías de uso para desarrollo.',
      'Libros de marca que traducen la identidad visual a productos digitales.',
      'Revisión de accesibilidad y comportamiento responsive en cada pantalla entregada.',
    ],
  },
  {
    cargo: 'Desarrolladora Full Stack',
    empresa: 'EDSA',
    periodo: '2023 – 2025 · Híbrido',
    puntos: [
      'Interfaces modulares y responsivas en Angular, React y TypeScript a partir de diseños en Figma.',
      'Nuevas funcionalidades y mejoras sobre aplicaciones corporativas en producción.',
      'Integración con APIs REST: autenticación, consumo de datos, manejo de estado y control de errores.',
      'Resolución de incidencias de usuarios internos y clientes: reproducción, diagnóstico, corrección y verificación.',
      'Revisiones de código y trabajo ágil con Git, Azure DevOps y CI/CD.',
    ],
  },
];

export const EDUCACION = [
  { periodo: '2021 – 2024', titulo: 'Ingeniería en Informática', lugar: 'Duoc UC' },
  { periodo: '2020', titulo: 'Programación Java (210 h)', lugar: 'Universidad de Chile' },
];

export const CURSOS = [
  { anio: '2026', titulo: 'Node.js, Express y MongoDB Bootcamp' },
  { anio: '2026', titulo: 'SEO y Posicionamiento en Google' },
  { anio: '2025', titulo: 'Master en CSS: Responsive, Flexbox, Grid y SASS (210 h)', lugar: 'Universidad de Chile' },
  { anio: '2025', titulo: 'Diseño UX/UI + Figma' },
  { anio: '2024', titulo: 'Angular SSR In Depth (Angular Universal)' },
  { anio: '2024', titulo: 'Angular: De cero a experto' },
];
