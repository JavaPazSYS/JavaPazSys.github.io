import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-forget-pass',
  imports: [FormsModule, CommonModule],
  templateUrl: './forget-pass.component.html',
  styleUrl: './forget-pass.component.css'
})
export class ForgetPassComponent {
  // ── Estado formulario ─────────────────────────────────────
  email: string = '';
  isLoading: boolean = false;
  emailSent: boolean = false;

  errors: { email?: string } = {};

  // ── Validación email ──────────────────────────────────────
  validateEmail(): void {

    const v = this.email.trim();

    if (!v) {
      this.errors.email = 'El correo es obligatorio.';
    }
    else if (!this.isEmailValid(v)) {
      this.errors.email = 'Debe ser un correo válido.';
    }
    else {
      this.errors.email = '';
    }
  }

  private isEmailValid(email: string): boolean {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }

  // ── Simulación envío correo ───────────────────────────────
  onSubmit(): void {

    this.validateEmail();

    if (this.errors.email) return;

    setTimeout(() => {

      this.isLoading = false
      this.emailSent = true

      console.log('Mock email enviado a:', this.email)

      // iniciar bloqueo de reenvío
      this.startResendCountdown();

    }, 900)
  }

  // ── Reenviar correo ───────────────────────────────────────
  resendEmail(): void {

    if (this.resendDisabled) return

    // TODO: conectar API real
    // POST /api/auth/forgot-password

    console.log("Reenviando correo a:", this.email)

    this.startResendCountdown()

  }

  // ── Reset formulario ──────────────────────────────────────
  reset(): void {

    this.email = '';
    this.emailSent = false;
    this.errors = {};

  }
  // ── Estado reenviar correo ─────────────────────────────

  resendDisabled: boolean = true
  resendCountdown: number = 15

  private resendTimer: any
  startResendCountdown(): void {

    this.resendDisabled = true
    this.resendCountdown = 15

    this.resendTimer = setInterval(() => {

      this.resendCountdown--

      if (this.resendCountdown <= 0) {

        clearInterval(this.resendTimer)
        this.resendDisabled = false

      }

    }, 1000)

  }

}
