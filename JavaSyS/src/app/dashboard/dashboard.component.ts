import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ── Modelos de datos ──────────────────────────────────────────────────────────

export type DashView = 'analytics' | 'usuarios' | 'config';
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface MockUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: 'activo' | 'inactivo';
  joined: string; // fecha simulada
}

export interface KpiCard {
  label: string;
  value: string;
  trend: string;
  positive: boolean;
  icon: string;
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  // ── Navegación interna del Dashboard ─────────────────────────────────────
  currentView: DashView = 'analytics';

  setView(view: DashView): void {
    this.currentView = view;
    // Cerrar edición al cambiar de vista
    this.editingUserId = null;
  }

  // ── KPIs (mock data) ──────────────────────────────────────────────────────
  // TODO: reemplazar por datos desde API/backend
  kpis: KpiCard[] = [
    { label: 'Ventas Totales', value: '$24,500', trend: '+15% desde ayer', positive: true, icon: 'fa-dollar-sign' },
    { label: 'Nuevos Usuarios', value: '1,250', trend: '+5% desde ayer', positive: true, icon: 'fa-users' },
    { label: 'Tasa de Rebote', value: '42%', trend: '-2% desde ayer', positive: false, icon: 'fa-chart-pie' },
    { label: 'Sesiones Activas', value: '3,842', trend: '+8% desde ayer', positive: true, icon: 'fa-eye' },
  ];

  // ── Usuarios (mock data) ──────────────────────────────────────────────────
  // TODO: reemplazar mock por llamada a servicio → this.userService.getUsers()
  users: MockUser[] = [
    { id: 1, name: 'Ana García', email: 'ana@javapaz.dev', role: 'admin', status: 'activo', joined: '2024-01-15' },
    { id: 2, name: 'Carlos López', email: 'carlos@javapaz.dev', role: 'editor', status: 'activo', joined: '2024-03-02' },
    { id: 3, name: 'Marta Ruiz', email: 'marta@javapaz.dev', role: 'viewer', status: 'inactivo', joined: '2024-04-20' },
    { id: 4, name: 'Javier Mora', email: 'javier@javapaz.dev', role: 'editor', status: 'activo', joined: '2024-06-11' },
    { id: 5, name: 'Sofía Herrera', email: 'sofia@javapaz.dev', role: 'viewer', status: 'activo', joined: '2024-08-30' },
    { id: 6, name: 'Diego Peralta', email: 'diego@javapaz.dev', role: 'viewer', status: 'inactivo', joined: '2025-01-05' },
  ];

  // Estado de búsqueda/filtro
  searchQuery: string = '';

  get filteredUsers(): MockUser[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.users;
    return this.users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }

  // ── CRUD de usuarios ──────────────────────────────────────────────────────

  editingUserId: number | null = null;
  // Copia temporal mientras se edita una fila
  editSnapshot: Partial<MockUser> = {};

  /** Inicia la edición en línea de un usuario */
  startEdit(user: MockUser): void {
    this.editingUserId = user.id;
    // Guardamos copia para poder cancelar
    this.editSnapshot = { ...user };
  }

  /** Confirma los cambios editados */
  saveEdit(user: MockUser): void {
    // TODO: conectar con API → this.userService.updateUser(user)
    // Por ahora sólo actualiza el estado local
    this.editingUserId = null;
    this.editSnapshot = {};
  }

  /** Cancela la edición y restaura los valores originales */
  cancelEdit(user: MockUser): void {
    Object.assign(user, this.editSnapshot);
    this.editingUserId = null;
    this.editSnapshot = {};
  }

  /** Elimina un usuario del listado local */
  deleteUser(id: number): void {
    // TODO: conectar con API → this.userService.deleteUser(id)
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    this.users = this.users.filter(u => u.id !== id);
  }

  /** Cambia el rol entre admin / editor / viewer cíclicamente */
  cycleRole(user: MockUser): void {
    // TODO: conectar con API → this.userService.updateRole(user.id, newRole)
    const roles: UserRole[] = ['viewer', 'editor', 'admin'];
    const current = roles.indexOf(user.role);
    user.role = roles[(current + 1) % roles.length];
  }

  /** Alterna el estado activo/inactivo del usuario */
  toggleStatus(user: MockUser): void {
    // TODO: conectar con API → this.userService.toggleStatus(user.id)
    user.status = user.status === 'activo' ? 'inactivo' : 'activo';
  }
  // Mensaje temporal en pantalla
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  notificationTimeout: any;

  /** Muestra una notificación temporal */
  showNotification(message: string, type: 'success' | 'error' = 'success', duration: number = 3000) {
    this.notificationMessage = message;
    this.notificationType = type;

    // Limpia cualquier timeout previo
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    this.notificationTimeout = setTimeout(() => {
      this.notificationMessage = '';
    }, duration);
  }
  // ── Exportar a Excel ──────────────────────────────────────────────────────

  /**
   * Genera y descarga un archivo .xlsx real con los datos actuales de usuarios.
   * TODO: reemplazar this.users por datos obtenidos desde el backend antes de exportar.
   * Usa la librería SheetJS (xlsx) que se importa dinámicamente para no afectar bundle inicial.
   */
  async exportToExcel(): Promise<void> {
    try {
      // Importación dinámica para lazy-loading del bundle de xlsx
      const XLSX = await import('xlsx');

      // Preparamos los datos para la hoja: mapeamos el array de usuarios a filas legibles
      const rows = this.users.map(u => ({
        'ID': u.id,
        'Nombre': u.name,
        'Email': u.email,
        'Rol': u.role,
        'Estado': u.status,
        'Alta': u.joined,
      }));

      // Creamos la hoja de trabajo a partir del array de objetos
      const ws = XLSX.utils.json_to_sheet(rows);

      // Ajuste de ancho de columnas automático
      ws['!cols'] = [
        { wch: 6 },   // ID
        { wch: 22 },  // Nombre
        { wch: 28 },  // Email
        { wch: 10 },  // Rol
        { wch: 10 },  // Estado
        { wch: 14 },  // Alta
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

      // Descargamos el archivo con la fecha de hoy en el nombre
      const fecha = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `usuarios_javapaz_${fecha}.xlsx`);

    } catch (err) {
      console.error('Error al exportar Excel:', err);
      alert('No se pudo generar el archivo.');
    }
  }

  // ── Configuración (placeholder) ───────────────────────────────────────────
  // TODO: conectar con API de configuración del sistema
  siteName: string = 'JavaPaz SyS';
  siteEmail: string = 'contacto@javapaz.dev';

  saveConfig(): void {
    // TODO: conectar con API → this.configService.save({ siteName, siteEmail })
    this.showNotification(`Configuración guardada!`, 'success');
  }

  // ── Roles disponibles para el <select> ───────────────────────────────────
  availableRoles: UserRole[] = ['admin', 'editor', 'viewer'];

  ngOnInit(): void {
    // TODO: cargar datos reales al inicializar
    // this.loadKpis();
    // this.loadUsers();
  }
}
