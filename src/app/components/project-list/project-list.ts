import { Component, input, output } from '@angular/core';

import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  readonly projects = input.required<readonly Project[]>();

  readonly clearSearch = output<void>();
}
