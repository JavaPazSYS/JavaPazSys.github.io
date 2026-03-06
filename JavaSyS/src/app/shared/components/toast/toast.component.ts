import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  toastService = inject(ToastService);

  // Getter proxy al signal (para acceso directo en el template)
  get toasts(): Toast[] {
    return this.toastService.toasts();
  }

  remove(id: number): void {
    this.toastService.remove(id);
  }

  trackByToastId(index: number, toast: Toast): number {
    return toast.id;
  }
}
