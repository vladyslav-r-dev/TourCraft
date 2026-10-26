import {
  afterRenderEffect,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

import { TourStep } from '../../core/models/tour-step.model';

@Component({
  selector: 'app-tour-tooltip',
  templateUrl: './tour-tooltip.html',
  styleUrl: './tour-tooltip.scss',
})
export class TourTooltip {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly step = input.required<TourStep>();
  readonly workspace = input<HTMLElement | null>(null);
  readonly stepIndex = input(0);
  readonly stepsCount = input(0);

  readonly nextClicked = output<void>();
  readonly previousClicked = output<void>();

  private target: HTMLElement | undefined;
  private frame = 0;

  constructor() {
    const schedulePosition = () => {
      cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(() => this.position());
    };

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedulePosition);

    observer?.observe(this.element);

    afterRenderEffect(() => {
      const workspace = this.workspace();

      if (workspace) {
        observer?.observe(workspace);
      }

      const targetId = this.step().targetId;

      this.stepIndex();
      this.target = Array.from(
        workspace?.querySelectorAll<HTMLElement>('[data-tour-target]') ?? [],
      ).find((element) => element.dataset['tourTarget'] === targetId);

      this.target?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      this.position();
      this.element.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
    });

    window.addEventListener('resize', schedulePosition);
    window.addEventListener('scroll', schedulePosition, true);

    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('resize', schedulePosition);
      window.removeEventListener('scroll', schedulePosition, true);
      observer?.disconnect();
      cancelAnimationFrame(this.frame);
    });
  }

  private position(): void {
    const margin = 16;
    const gap = 16;

    const bounds = this.target?.getBoundingClientRect();
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;

    const preferredTop = bounds ? bounds.bottom + gap : (window.innerHeight - height) / 2;
    const top =
      bounds && preferredTop + height > window.innerHeight - margin
        ? bounds.top - height - gap
        : preferredTop;
    const left = bounds
      ? bounds.left + bounds.width / 2 - width / 2
      : (window.innerWidth - width) / 2;

    this.element.style.top = `${Math.max(margin, Math.min(top, window.innerHeight - height - margin))}px`;
    this.element.style.left = `${Math.max(margin, Math.min(left, window.innerWidth - width - margin))}px`;
  }
}
