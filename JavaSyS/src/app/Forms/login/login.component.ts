import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  isFormValid: boolean = false;
  showPassword: boolean = false;

  errors: { email?: string; password?: string } = {};

  // Validación de email
  validateEmail(): void {
    const emailTrimmed = this.email.trim();
    if (!emailTrimmed) {
      this.errors.email = 'El correo es obligatorio.';
    } else if (!this.isEmailValid(emailTrimmed)) {
      this.errors.email = 'Debe ser un correo válido.';
    } else {
      this.errors.email = '';
    }

    this.checkFormValidity();  // Actualiza la validez del formulario después de validar el campo
  }

  // Validación de contraseña
  validatePassword(): void {
    const passwordTrimmed = this.password.trim();
    if (!passwordTrimmed) {
      this.errors.password = 'La contraseña es obligatoria.';
    } else if (passwordTrimmed.length < 6) {
      this.errors.password = 'Debe tener al menos 6 caracteres.';
    } else {
      this.errors.password = '';
    }

    this.checkFormValidity();  // Actualiza la validez del formulario después de validar el campo
  }

  // Función para validar el formulario en el submit
  onSubmit(): void {
    this.clearErrors();
    this.validateEmail();
    this.validatePassword();

    if (this.errors.email || this.errors.password) {
      console.log('Formulario inválido');
      return;
    }

    console.log('Login válido:', { email: this.email, password: this.password });
  }

  // Función para verificar si el email es válido
  private isEmailValid(email: string): boolean {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }

  // Limpiar los errores previos
  private clearErrors(): void {
    this.errors = {};
  }

  // Verificar si todos los campos son válidos
  private checkFormValidity(): void {
    // Formulario es válido solo si no hay errores y los campos no están vacíos
    this.isFormValid = !this.errors.email && !this.errors.password && this.email.trim() !== '' && this.password.trim() !== '';
  }

  togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;}
}