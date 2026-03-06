import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.css']
})
export class EcommerceComponent {
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

  // ── FILTRO FUNCIONAL
  filteredProducts(): Product[] {
    return this.products.filter(p =>
      this.filterCategories[p.category] &&
      p.price <= this.filterMaxPrice
    );
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
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(item => item.id !== productId);
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