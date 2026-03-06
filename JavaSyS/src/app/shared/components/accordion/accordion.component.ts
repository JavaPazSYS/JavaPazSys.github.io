import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AccordionItem {
    title: string;
    content: string;
}

@Component({
    selector: 'app-accordion',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="accordion-container">
      <div 
        class="accordion-item glass-panel" 
        *ngFor="let item of items; let i = index; trackBy: trackByTitle">
        
        <button 
          class="accordion-header" 
          (click)="toggle(i)" 
          [attr.aria-expanded]="activeIndex() === i">
          <span>{{ item.title }}</span>
          <i class="fas" [class.fa-chevron-down]="activeIndex() !== i" [class.fa-chevron-up]="activeIndex() === i"></i>
        </button>

        <div class="accordion-content" [class.open]="activeIndex() === i">
          <div class="content-inner">
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .accordion-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
    .accordion-item {
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius-sm);
      overflow: hidden;
      background: var(--glass-bg-solid);
    }
    .accordion-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: none;
      border: none;
      color: var(--color-heading);
      font-family: var(--font-title);
      font-size: 1.05rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .accordion-header:hover {
      color: var(--color-accent);
      background: var(--glass-border-light);
    }
    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
    }
    .accordion-content.open {
      max-height: 500px;
    }
    .content-inner {
      padding: 0 1.25rem 1.25rem;
      color: var(--color-text);
      font-family: var(--font-body);
      line-height: 1.6;
    }
  `]
})
export class AccordionComponent {
    @Input() items: AccordionItem[] = [];
    activeIndex = signal<number | null>(null);

    toggle(index: number) {
        this.activeIndex.update(current => current === index ? null : index);
    }

    trackByTitle(index: number, item: AccordionItem): string {
        return item.title;
    }
}
