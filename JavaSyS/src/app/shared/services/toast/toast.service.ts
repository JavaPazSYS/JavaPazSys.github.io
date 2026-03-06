import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private idCounter = 0;

  constructor() { }

  /**
   * Muestra un nuevo toast
   */
  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    const id = this.idCounter++;
    const toast: Toast = { id, message, type, duration };

    this.toasts.update(current => [...current, toast]);

    // Auto eliminar después de duration
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  /**
   * Elimina un toast por ID (manual o automático)
   */
  remove(id: number): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
