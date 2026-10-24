import { Component, input, output } from '@angular/core';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-tour-tooltip',
  imports: [],
  templateUrl: './tour-tooltip.html',
  styleUrl: './tour-tooltip.scss',
})
export class TourTooltip {
  step = input.required<Tour['steps'][number]>();
  nextClicked = output<void>();
  previousClicked = output<void>();
  stepIndex = input<number>(0);
  stepsCount = input<number>(0);
}
