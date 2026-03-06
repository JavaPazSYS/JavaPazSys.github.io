import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  // ── Estado del formulario ─────────────────────────────────────────────────
  email: string = '';
  user: string = '';
  password: string = '';
  passwordconfirm: string = '';
  showPassword: boolean = false;
  showPasswordConfirm: boolean = false;
  isFormValid: boolean = false;
  isLoading: boolean = false;

  // Estado post-submit
  registerSuccess: boolean = false;

  errors: {
    email?: string;
    user?: string;
    password?: string;
    passwordconfirm?: string;
  } = {};

  // ── Validaciones ──────────────────────────────────────────────────────────

  validateEmail(): void {
    const v = this.email.trim();
    if (!v) this.errors.email = 'El correo es obligatorio.';
    else if (!this.isEmailValid(v)) this.errors.email = 'Debe ser un correo válido.';
    else this.errors.email = '';
    this.checkFormValidity();
  }

  validateUser(): void {
    const v = this.user.trim();
    if (!v) this.errors.user = 'El usuario es obligatorio.';
    else if (v.length < 3) this.errors.user = 'Debe tener al menos 3 caracteres.';
    else this.errors.user = '';
    this.checkFormValidity();
  }

  validatePassword(): void {
    const v = this.password.trim();
    if (!v) this.errors.password = 'La contraseña es obligatoria.';
    else if (v.length < 6) this.errors.password = 'Debe tener al menos 6 caracteres.';
    else this.errors.password = '';
    // Re-validar confirmación al cambiar la contraseña principal
    if (this.passwordconfirm) this.validatePasswordConfirm();
    this.checkFormValidity();
  }

  validatePasswordConfirm(): void {
    const v = this.passwordconfirm.trim();
    if (!v) this.errors.passwordconfirm = 'Confirma tu contraseña.';
    else if (v !== this.password.trim()) this.errors.passwordconfirm = 'Las contraseñas no coinciden.';
    else this.errors.passwordconfirm = '';
    this.checkFormValidity();
  }

  private isEmailValid(email: string): boolean {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }

  private checkFormValidity(): void {
    this.isFormValid =
      !this.errors.email &&
      !this.errors.user &&
      !this.errors.password &&
      !this.errors.passwordconfirm &&
      this.email.trim() !== '' &&
      this.user.trim() !== '' &&
      this.password.trim() !== '' &&
      this.passwordconfirm.trim() !== '';
  }

  private clearErrors(): void {
    this.errors = {};
  }

  // ── Toggle contraseña ─────────────────────────────────────────────────────
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibility(): void {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  /**
   * Simula el registro de usuario con datos mock.
   * TODO: conectar con API de registro → POST /api/auth/register
   * TODO: reemplazar simulación por llamada al servicio:
   *   this.authService.register({ email, user, password }).subscribe(...)
   */
  onSubmit(): void {
    this.clearErrors();
    this.validateEmail();
    this.validateUser();
    this.validatePassword();
    this.validatePasswordConfirm();

    if (!this.isFormValid) return;

    this.isLoading = true;
    setTimeout(() => {
      // TODO: conectar base de datos aquí → guardar usuario real
      this.isLoading = false;
      this.registerSuccess = true;
      console.log('Registro mock:', { email: this.email, user: this.user });
    }, 1000);
  }

  /** Resetea el formulario para registrar otro usuario */
  resetForm(): void {
    this.email = '';
    this.user = '';
    this.password = '';
    this.passwordconfirm = '';
    this.registerSuccess = false;
    this.errors = {};
    this.isFormValid = false;
  }
}
