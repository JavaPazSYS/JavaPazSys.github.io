import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// ── Usuarios mock para simular autenticación ──────────────────────────────────
// TODO: reemplazar este mock por llamada al endpoint de autenticación
// TODO: endpoint de autenticación → POST /api/auth/login
const MOCK_USERS = [
  { email: 'admin@javapaz.dev', password: 'admin123', name: 'Admin Sys', role: 'admin' },
  { email: 'test@javapaz.dev', password: 'test123', name: 'Usuario Test', role: 'viewer' },
];

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // ── Estado del formulario ─────────────────────────────────────────────────
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isFormValid: boolean = false;
  isLoading: boolean = false;

  // Estado post-submit
  loginSuccess: boolean = false;
  loggedUserName: string = '';
  loginError: string = '';

  errors: { email?: string; password?: string } = {};

  // ── Validaciones ──────────────────────────────────────────────────────────

  validateEmail(): void {
    const v = this.email.trim();
    if (!v) {
      this.errors.email = 'El correo es obligatorio.';
    } else if (!this.isEmailValid(v)) {
      this.errors.email = 'Debe ser un correo válido.';
    } else {
      this.errors.email = '';
    }
    this.checkFormValidity();
  }

  validatePassword(): void {
    const v = this.password.trim();
    if (!v) {
      this.errors.password = 'La contraseña es obligatoria.';
    } else if (v.length < 6) {
      this.errors.password = 'Debe tener al menos 6 caracteres.';
    } else {
      this.errors.password = '';
    }
    this.checkFormValidity();
  }

  private isEmailValid(email: string): boolean {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }

  private checkFormValidity(): void {
    this.isFormValid =
      !this.errors.email &&
      !this.errors.password &&
      this.email.trim() !== '' &&
      this.password.trim() !== '';
  }

  private clearErrors(): void {
    this.errors = {};
    this.loginError = '';
  }

  // ── Toggle contraseña ─────────────────────────────────────────────────────
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  /**
   * Simula la autenticación contra datos mock.
   * TODO: reemplazar el bloque de mock por servicio real:
   *   this.authService.login(this.email, this.password).subscribe(...)
   */
  onSubmit(): void {
    this.clearErrors();
    this.validateEmail();
    this.validatePassword();

    if (!this.isFormValid) return;

    // Simular delay de red
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      // TODO: conectar API real aquí → POST /api/auth/login
      const found = MOCK_USERS.find(
        u => u.email === this.email.trim() && u.password === this.password
      );

      if (found) {
        // Login exitoso (mock)
        this.loginSuccess = true;
        this.loggedUserName = found.name;
        // TODO: guardar token JWT, redirigir con Router:
        //   this.router.navigate(['/dashboard']);
      } else {
        this.loginError = 'Usuario no existe';
      }
    }, 800); // 800ms simulando latencia de red
  }

  /** Cierra el estado de éxito y resetea el formulario */
  resetForm(): void {
    this.email = '';
    this.password = '';
    this.loginSuccess = false;
    this.loggedUserName = '';
    this.loginError = '';
    this.errors = {};
    this.isFormValid = false;
  }
}