import { Component } from '@angular/core';
import { DemoWorkspace } from '../../components/demo-workspace/demo-workspace';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-builder',
  imports: [DemoWorkspace],
  templateUrl: './builder.html',
  styleUrl: './builder.scss',
})
export class Builder {
  tour : Tour = {
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
  }

}
