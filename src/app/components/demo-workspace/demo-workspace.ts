import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-demo-workspace',
  imports: [ReactiveFormsModule],
  templateUrl: './demo-workspace.html',
  styleUrl: './demo-workspace.scss',
})
export class DemoWorkspace {
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