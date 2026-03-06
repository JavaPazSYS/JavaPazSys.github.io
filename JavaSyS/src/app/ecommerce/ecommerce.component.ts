import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../shared/services/toast/toast.service';
import { AccordionComponent, AccordionItem } from '../shared/components/accordion/accordion.component';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule, FormsModule, AccordionComponent],
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.css']
})
export class EcommerceComponent {
  toastService = inject(ToastService);

  products: Product[] = [
    { id: 1, name: 'Chaqueta Minimalista', price: 120, image: 'https://via.placeholder.com/200x200/242631/e0e0e0?text=Chaqueta', description: 'Abrigo elegante con textura suave.', category: 'Ropa' },
    { id: 2, name: 'Bolso de Cuero', price: 85.5, image: 'https://via.placeholder.com/200x200/242631/e0e0e0?text=Bolso', description: 'Cuero genuino, ideal para uso diario.', category: 'Accesorios' },
    { id: 3, name: 'Zapatos Urbanos', price: 90, image: 'https://via.placeholder.com/200x200/242631/e0e0e0?text=Zapatos', description: 'Estilo moderno con comodidad premium.', category: 'Calzado' },
    { id: 4, name: 'Reloj Elegante', price: 150, image: 'https://via.placeholder.com/200x200/242631/e0e0e0?text=Reloj', description: 'Precisión y diseño impecable.', category: 'Accesorios' }
  ];

  filterCategories: { [key: string]: boolean } = { Ropa: true, Accesorios: true, Calzado: true };
  filterMaxPrice: number = 200;

  cart: CartItem[] = [];
  currentView: 'catalog' | 'cart' = 'catalog';

  // Datos para el acordeón de FAQs
  faqItems: AccordionItem[] = [
    { title: '¿Cuáles son los métodos de pago?', content: 'Aceptamos todas las tarjetas de crédito, débito, PayPal y pagos locales.' },
    { title: '¿Cuánto tarda el envío?', content: 'Nuestros envíos estándar tardan entre 3 y 5 días hábiles. El envío exprés toma 24-48hrs.' },
    { title: '¿Tienen política de devoluciones?', content: '¡Sí! Tienes 30 días para devolver el producto si no estás satisfecho, sin costo adicional.' }
  ];

  // ── FILTRO FUNCIONAL
  filteredProducts(): Product[] {
    return this.products.filter(p =>
      this.filterCategories[p.category] &&
      p.price <= this.filterMaxPrice
    );
  }

  // ── OPTIMIZACIÓN RENDIMIENTO
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  trackByCartItem(index: number, item: CartItem): number {
    return item.id;
  }

  // ── VISTAS
  setView(view: 'catalog' | 'cart') {
    this.currentView = view;
  }

  // ── CARRITO
  addToCart(product: Product) {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.toastService.show(`${product.name} agregado al carrito`, 'success');
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.toastService.show('Artículo eliminado', 'info');
  }

  updateQuantity(productId: number, change: number) {
    const item = this.cart.find(i => i.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) this.removeFromCart(productId);
    }
  }

  get cartTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  get cartSubtotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}