import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CarouselSlide {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="carousel-container glass-panel">
      <button class="nav-btn prev" (click)="prev()" [disabled]="slots.length <= 1" aria-label="Anterior">
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="carousel-track-viewport">
        <div class="carousel-track" [style.transform]="'translateX(' + (-currentIndex() * 100) + '%)'">
          <div class="carousel-slide" *ngFor="let slide of slots; let i = index; trackBy: trackByTitle" [attr.aria-hidden]="i !== currentIndex()">
            <i class="fas {{ slide.icon }} slide-icon"></i>
            <h3>{{ slide.title }}</h3>
            <p>{{ slide.description }}</p>
          </div>
        </div>
      </div>

      <button class="nav-btn next" (click)="next()" [disabled]="slots.length <= 1" aria-label="Siguiente">
        <i class="fas fa-chevron-right"></i>
      </button>

      <div class="dots-container">
        <span 
          *ngFor="let slide of slots; let i = index; trackBy: trackByTitle" 
          class="dot" 
          [class.active]="i === currentIndex()"
          (click)="goTo(i)">
        </span>
      </div>
    </div>
  `,
  styles: [`
    .carousel-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      border-radius: var(--border-radius-lg);
      padding: 3rem 4rem;
      border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-modern);
      text-align: center;
      background: var(--glass-bg-solid);
    }

    .carousel-track-viewport {
      overflow: hidden;
      width: 100%;
    }

    .carousel-track {
      display: flex;
      transition: transform 0.4s ease-in-out;
      width: 100%;
    }

    .carousel-slide {
      min-width: 100%;
      box-sizing: border-box;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .slide-icon {
      font-size: 3rem;
      color: var(--color-accent);
      margin-bottom: 0.5rem;
    }

    .carousel-slide h3 {
      font-size: 1.5rem;
      margin: 0;
      color: var(--color-heading);
    }

    .carousel-slide p {
      color: var(--color-text-muted);
      max-width: 80%;
      margin: 0 auto;
      line-height: 1.6;
    }

    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: var(--color-surface-dark);
      border: 1px solid var(--glass-border);
      color: var(--color-text);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-fast);
      box-shadow: var(--shadow-soft);
    }

    .nav-btn:hover:not([disabled]) {
      background: var(--color-accent);
      color: var(--color-white);
      border-color: var(--color-accent);
    }

    .nav-btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nav-btn.prev {
      left: 1rem;
    }

    .nav-btn.next {
      right: 1rem;
    }

    .dots-container {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.5rem;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-text-muted);
      cursor: pointer;
      transition: var(--transition-fast);
      opacity: 0.5;
    }

    .dot.active {
      background: var(--color-accent);
      opacity: 1;
      transform: scale(1.2);
    }

    @media (max-width: 768px) {
      .carousel-container {
        padding: 3rem 2rem;
      }
      .nav-btn.prev { left: 0.5rem; }
      .nav-btn.next { right: 0.5rem; }
      .carousel-slide p { max-width: 100%; }
    }
  `]
})
export class CarouselComponent {
  @Input() slots: CarouselSlide[] = [];
  currentIndex = signal<number>(0);

  next() {
    this.currentIndex.update(i => (i + 1) % this.slots.length);
  }

  prev() {
    this.currentIndex.update(i => (i - 1 + this.slots.length) % this.slots.length);
  }

  goTo(index: number) {
    this.currentIndex.set(index);
  }

  trackByTitle(index: number, slide: CarouselSlide): string {
    return slide.title;
  }
}
