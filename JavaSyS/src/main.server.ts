import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Cada render del servidor recibe su propio contexto (evita que una petición vea datos de otra).
// La detección de cambios con zone.js ya viene en appConfig, que config incluye.
const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
