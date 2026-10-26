import { effect, Injectable, signal } from '@angular/core';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root',
})

export class TourService  {

  constructor() {
  effect(() => {
    const state = this.tourState();
    JSON.stringify(state)
    localStorage.setItem('tourcraft-tour', JSON.stringify(state));
  });
  }

 private readonly tourState = signal<Tour>(
  this.loadTour() ??{
    id: 1,
    title: 'Getting Started',
    steps: [
      {
        id: 1,
        title: 'Create your first project',
        description: 'This is the first step.',
        targetId: 'create-project'
      },
      {
        id: 2,
        title: 'Find your projects',
        description: 'This is the second step.',
        targetId: 'search'
      },
      {
        id: 3,
        title: 'Check notifications',
        description: 'This is the third step.',
        targetId: 'notifications'
      }
    ]
  });

  get tour(): Tour {
  return this.tourState();
  }

  private loadTour(): Tour | null {
  try {
    const storedTour = localStorage.getItem('tourcraft-tour');

    if (!storedTour) {
      return null;
    }

    return JSON.parse(storedTour) as Tour;
  } catch {
    return null;
  }
  }

  addStep(step: Tour['steps'][number]) {
  this.tourState.update(currentTour => ({
    ...currentTour,
    steps: [...currentTour.steps, step]
  }));
  }

  deleteStep(stepId: number) {
  this.tourState.update(currentTour => ({
    ...currentTour,
    steps: currentTour.steps.filter(step => step.id !== stepId)
  }));
  }

  saveChanges(
  stepId: number,
  values: Omit<Tour['steps'][number], 'id'>
  ) {
  this.tourState.update(currentTour => ({
    ...currentTour,
    steps: currentTour.steps.map(step =>
      step.id === stepId ? { ...step, ...values } : step
    )
  }));
  }

  moveStep(stepId: number, direction: 'up' | 'down') {
  this.tourState.update(currentTour => {
    const index = currentTour.steps.findIndex(step => step.id === stepId);
    if (index === -1) return currentTour;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentTour.steps.length) return currentTour;

    const steps = [...currentTour.steps];
    const temp = steps[index];
    steps[index] = steps[newIndex];
    steps[newIndex] = temp;

    return {
      ...currentTour,
      steps
    };
  });
  }
}
