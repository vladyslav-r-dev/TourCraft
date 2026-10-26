import { effect, Injectable, signal } from '@angular/core';

import { TourStep } from '../models/tour-step.model';
import { Tour } from '../models/tour.model';

function isTour(value: unknown): value is Tour {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (
    !('id' in value) ||
    typeof value.id !== 'number' ||
    !('title' in value) ||
    typeof value.title !== 'string' ||
    !('steps' in value) ||
    !Array.isArray(value.steps)
  ) {
    return false;
  }

  const ids = new Set<number>();

  return value.steps.every((step: unknown) => {
    if (
      typeof step !== 'object' ||
      step === null ||
      !('id' in step) ||
      typeof step.id !== 'number' ||
      !Number.isSafeInteger(step.id) ||
      ids.has(step.id) ||
      !('title' in step) ||
      typeof step.title !== 'string' ||
      !('description' in step) ||
      typeof step.description !== 'string' ||
      !('targetId' in step) ||
      typeof step.targetId !== 'string'
    ) {
      return false;
    }

    ids.add(step.id);
    return true;
  });
}

@Injectable({ providedIn: 'root' })
export class TourService {
  private readonly storageKey = 'tourcraft-tour';

  private canPersist = true;
  private readonly storageIssueState = signal(false);
  readonly storageIssue = this.storageIssueState.asReadonly();

  private readonly tourState = signal<Tour>(
    this.loadTour() ?? {
      id: 1,
      title: 'Getting Started',
      steps: [
        {
          id: 1,
          title: 'Create your first project',
          description:
            'Bring your next idea to life. Create a project to organize your work and keep your team moving together.',
          targetId: 'create-project',
        },
        {
          id: 2,
          title: 'Find your projects',
          description:
            'Less searching, more doing. Find a project by name to pick up right where you left off.',
          targetId: 'search',
        },
        {
          id: 3,
          title: 'Check notifications',
          description:
            'Stay in the loop with the latest updates from your workspace, all in one place.',
          targetId: 'notifications',
        },
      ],
    },
  );

  private nextStepId = Math.max(0, ...this.tour.steps.map((step) => step.id)) + 1;

  constructor() {
    let previousState = this.tourState();

    effect(() => {
      const state = this.tourState();

      if (state === previousState || !this.canPersist) {
        return;
      }

      previousState = state;

      try {
        localStorage.setItem(this.storageKey, JSON.stringify(state));
        this.storageIssueState.set(false);
      } catch {
        this.storageIssueState.set(true);
      }
    });
  }

  get tour(): Tour {
    return this.tourState();
  }

  private loadTour(): Tour | null {
    try {
      const storedTour = localStorage.getItem(this.storageKey);

      if (!storedTour) {
        return null;
      }

      const parsed: unknown = JSON.parse(storedTour);

      if (isTour(parsed)) {
        return parsed;
      }

      this.canPersist = false;
      this.storageIssueState.set(true);

      return null;
    } catch {
      this.canPersist = false;
      this.storageIssueState.set(true);

      return null;
    }
  }

  addStep(values: Omit<TourStep, 'id'>): void {
    this.tourState.update((tour) => ({
      ...tour,
      steps: [...tour.steps, { ...values, id: this.nextStepId++ }],
    }));
  }

  deleteStep(stepId: number): void {
    this.tourState.update((tour) => ({
      ...tour,
      steps: tour.steps.filter((step) => step.id !== stepId),
    }));
  }

  saveChanges(stepId: number, values: Omit<TourStep, 'id'>): void {
    this.tourState.update((tour) => ({
      ...tour,
      steps: tour.steps.map((step) => (step.id === stepId ? { ...step, ...values } : step)),
    }));
  }

  moveStep(stepId: number, direction: 'up' | 'down'): void {
    this.tourState.update((tour) => {
      const index = tour.steps.findIndex((step) => step.id === stepId);
      const nextIndex = index + (direction === 'up' ? -1 : 1);

      if (index < 0 || nextIndex < 0 || nextIndex >= tour.steps.length) {
        return tour;
      }

      const steps = [...tour.steps];
      [steps[index], steps[nextIndex]] = [steps[nextIndex], steps[index]];

      return { ...tour, steps };
    });
  }
}
