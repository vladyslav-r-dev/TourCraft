import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoWorkspace } from '../../components/demo-workspace/demo-workspace';
import { TourService } from '../../core/services/tour';

@Component({
  selector: 'app-preview',
  imports: [DemoWorkspace, RouterLink],
  templateUrl: './preview.html',
  styleUrl: './preview.scss',
})

export class Preview {
  private readonly tourService = inject(TourService);

  readonly isFinished = signal(false);
  readonly currentStepIndex = signal(0);

  get tour() {
    return this.tourService.tour;
  }

  currentStep() {
    return this.tour.steps.at(this.currentStepIndex());
  }

  nextStep(): void {
    if (this.isFinished() || this.tour.steps.length === 0) {
      return;
    }

    if (this.currentStepIndex() < this.tour.steps.length - 1) {
      this.currentStepIndex.update((index) => index + 1);
    } else {
      this.isFinished.set(true);
    }
  }

  previousStep(): void {
    if (!this.isFinished() && this.currentStepIndex() > 0) {
      this.currentStepIndex.update((index) => index - 1);
    }
  }

  restartStep(): void {
    this.currentStepIndex.set(0);
    this.isFinished.set(false);
  }
}
