export type Disciplina = 'uiux' | 'qa' | 'marca';

export const NOMBRE_DISCIPLINA: Record<Disciplina, string> = {
  uiux: 'Diseño UI/UX',
  qa: 'QA',
  marca: 'Marca',
};

/** Entrada de public/casos/indice.json: lo que muestra la portada. */
export interface CasoResumen {
  numero: string;
  slug: string;
  titulo: string;
  cliente: string;
  periodo: string;
  disciplinas: Disciplina[];
  resumen: string;
  kpi: { valor: string; etiqueta: string };
  portada: string;
  /** Ancho y alto de la portada, para reservar su espacio. */
  dimensiones: [number, number] | null;
}

export interface Kpi {
  etiqueta: string;
  antes: number;
  despues: number;
  unidad: string;
  mejor: 'menor' | 'mayor';
}

export interface Requerimiento {
  texto: string;
  estado: 'cumplido' | 'parcial' | 'fuera';
}

export interface Hallazgo {
  severidad: string;
  area: string;
  titulo: string;
  dato: string;
  esperado: string;
  porque: string;
  solucion: string;
  captura: string;
}

export interface Paso {
  titulo: string;
  detalle: string;
}

export interface Decision {
  decision: string;
  porque: string;
  alternativa: string;
}

export interface Marca {
  concepto: string;
  descripcion: string;
  paleta: { nombre: string; hex: string; uso: string }[];
  tipografias: { familia: string; uso: string; muestra: string; detalle: string; imagen: string }[];
  logo: { versiones: { nombre: string; src: string; fondo: 'claro' | 'oscuro' }[] };
  reglas: { si: string[]; no: string[] };
  tono: string;
  documento: string;
}

export interface Comparacion {
  titulo: string;
  antes: string;
  despues: string;
  pie: string;
  portada?: boolean;
}

export interface Metrica {
  metrica: string;
  operador: string;
  umbral: number;
  unidad: string;
  antes: number;
  despues: number;
}

/** public/casos/<slug>/datos.json: el caso, ya reducido a lo publicable por el sincronizador. */
export interface Caso {
  meta: {
    numero: string;
    titulo: string;
    bajada: string;
    objetivo: string;
    cliente: { nombre: string; autorizado: boolean; descripcion_anonima: string; sector: string };
    periodo: string;
    rol: string;
    disciplinas: Disciplina[];
    stack: string[];
    /** Dirección pública del producto, si está publicado. */
    sitio?: string;
  };
  resumen: { frase: string; descripcion: string };
  kpis: Kpi[];
  contexto: {
    problema: string;
    alcance: string;
    requerimientos: Requerimiento[];
  };
  diagnostico: { descripcion: string; capturas: { src: string; pie: string }[]; hallazgos: Hallazgo[] };
  intervencion: { enfoque: string; qa: Paso[]; uiux: Paso[]; marca: Paso[]; decisiones: Decision[] };
  marca: Marca | null;
  resultado: {
    descripcion: string;
    comparaciones: Comparacion[];
    metricas: Metrica[];
    galeria_titulo?: string;
    galeria: { src: string; pie: string }[];
  };
  pruebas: {
    descripcion: string;
    automatizadas: number | null;
    defectos: number | null;
    corregidos: number | null;
    tipos: { nombre: string; tipo: string; herramienta: string; casos: number | null }[];
  };
  herramientas: string[];
  aprendizajes: string[];
  anexos: { titulo: string; ruta: string }[];
  /** Ancho y alto de cada imagen del caso, por ruta. */
  dimensiones: Record<string, [number, number]>;
}
