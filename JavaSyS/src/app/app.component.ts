import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RepositorioComponent } from './repositorio/repositorio.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule,CommonModule,RepositorioComponent,RouterModule,HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
  
})
export class AppComponent {
  title = 'JavaSyS';
}
