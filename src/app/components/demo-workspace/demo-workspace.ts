import { Component, computed, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Project } from '../../core/models/project.model';
import { TourStep } from '../../core/models/tour-step.model';
import { ProjectList } from '../project-list/project-list';
import { TourTooltip } from '../tour-tooltip/tour-tooltip';

@Component({
  selector: 'app-demo-workspace',
  imports: [ReactiveFormsModule, TourTooltip, ProjectList],
  templateUrl: './demo-workspace.html',
  styleUrl: './demo-workspace.scss',
})
export class DemoWorkspace {
  readonly stepIndex = input(0);
  readonly stepsCount = input(0);
  readonly activeTargetId = input<string | null>(null);
  readonly activeStep = input<TourStep | null>(null);

  readonly onNextClicked = output<void>();
  readonly onPreviousClicked = output<void>();

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly projectName = new FormControl('', { nonNullable: true });

  protected readonly projects = signal<Project[]>([
    { id: 1, name: 'Website redesign', status: 'active', members: 5 },
    { id: 2, name: 'Mobile experience', status: 'paused', members: 3 },
    { id: 3, name: 'Design system', status: 'completed', members: 4 },
    { id: 4, name: 'Customer onboarding', status: 'active', members: 2 },
  ]);

  protected readonly searchQuery = signal('');
  protected readonly openPanel = signal<'create' | 'notifications' | 'profile' | null>(null);
  protected readonly notificationRead = signal(false);

  protected readonly filteredProjects = computed(() =>
    this.projects().filter((project) =>
      project.name.toLowerCase().includes(this.searchQuery().trim().toLowerCase()),
    ),
  );

  protected readonly activeProjects = computed(
    () => this.projects().filter((project) => project.status === 'active').length,
  );

  protected readonly completedProjects = computed(
    () => this.projects().filter((project) => project.status === 'completed').length,
  );

  constructor() {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.searchQuery.set(value));
  }

  protected togglePanel(panel: 'create' | 'notifications' | 'profile'): void {
    this.openPanel.update((current) => (current === panel ? null : panel));
  }

  protected createProject(): void {
    const name = this.projectName.value.trim();

    if (!name) {
      return;
    }

    this.projects.update((projects) => [
      ...projects,
      {
        id: Math.max(0, ...projects.map((project) => project.id)) + 1,
        name,
        status: 'active',
        members: 1,
      },
    ]);

    this.searchControl.reset();
    this.projectName.reset();
    this.openPanel.set(null);
  }
}
