import { Component, computed, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Tour } from '../../core/models/tour.model';
import { TourTooltip } from '../tour-tooltip/tour-tooltip';

@Component({
  selector: 'app-demo-workspace',
  imports: [ReactiveFormsModule, TourTooltip],
  templateUrl: './demo-workspace.html',
  styleUrl: './demo-workspace.scss',
})
export class DemoWorkspace {
  
  onNextClicked = output<void>();
  onPreviousClicked = output<void>();
  stepIndex = input<number>(0);
  stepsCount = input<number>(0);

  protected projects: Project[] = [{
    id: 1,
    name: "Demo Project",
    status: "active",
    members: 5
  }, {
    id: 2,
    name: "Another Project",
    status: "paused",
    members: 3
  },
  {
    id: 3,
    name: "Third Project",
    status: "completed",
    members: 4
  },
  {
    id: 4,
    name: "Fourth Project",
    status: "active",
    members: 2
  }];
  activeTargetId = input<string | null>(null);
  activeStep = input<Tour['steps'][number] | null>(null);
  protected searchControl = new FormControl('');
  protected searchQuery = signal('');
  protected filteredProjects = computed(() => {
    const query = this.searchQuery();
    return this.projects.filter(project => project.name.toLowerCase().includes(query.toLowerCase()));
  });

  constructor() {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.searchQuery.set(value ?? ''));
  }
}


export interface Project {
  id: number;
  name: string;
  status: 'active' | 'completed' | 'paused';
  members: number;
}