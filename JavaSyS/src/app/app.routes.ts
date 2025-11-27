import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RepositorioComponent } from './repositorio/repositorio.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'repositorio', component: RepositorioComponent }
];
