import { Component, inject } from '@angular/core';
import { TourService } from '../../core/services/tour';
import { DemoWorkspace } from '../../components/demo-workspace/demo-workspace';

@Component({
  selector: 'app-preview',
  imports: [DemoWorkspace],
  templateUrl: './preview.html',
  styleUrl: './preview.scss',
})
export class Preview {

  isFinished = false;

  tourService = inject(TourService);

  get tour() {
  return this.tourService.tour;
  }

  currentStepIndex = 0;

  currentStep() {
  return this.tour.steps.at(this.currentStepIndex);
  }

  nextStep() {
  if (this.isFinished || this.tour.steps.length === 0) {
    return;
  }

  if (this.currentStepIndex < this.tour.steps.length - 1) {
    this.currentStepIndex++;
  } else {
    this.isFinished = true;
  }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  restartStep() {
    this.currentStepIndex = 0;
    this.isFinished = false;
  }
}
