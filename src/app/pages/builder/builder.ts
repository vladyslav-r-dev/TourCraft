import { Component } from '@angular/core';
import { DemoWorkspace } from '../../components/demo-workspace/demo-workspace';
import { Tour } from '../../core/models/tour.model';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-builder',
  imports: [DemoWorkspace, ReactiveFormsModule],
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

  protected editForm = new FormGroup(
    {title: new FormControl('', {nonNullable: true, validators: [Validators.required] }), 
    description: new FormControl('', {nonNullable: true, validators: [Validators.required] }), 
    targetId:new FormControl('', {nonNullable: true, validators: [Validators.required] })});

    targets = [
    { value: 'create-project', label: 'Create Project' },
    { value: 'search', label: 'Search' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'profile', label: 'Profile' }
  ];

  private nextStepId =
  Math.max(0, ...this.tour.steps.map(step => step.id)) + 1;

  protected editingStepId: number | null = null;

  addStep() {
  if (this.editForm.invalid) {
    return;
  }

  const newStep = this.editForm.getRawValue();

  this.tour.steps.push({
    id: this.nextStepId++,
    title: newStep.title,
    description: newStep.description,
    targetId: newStep.targetId
  });

  this.editForm.reset({
    title: '',
    description: '',
    targetId: 'search'
  });
  }

  deleteStep(stepId: number) {
    this.tour.steps = this.tour.steps.filter(step => step.id !== stepId);
  }

  startEdit(stepId: number) {
    const step = this.tour.steps.find(s => s.id === stepId);
    if (!step) return;

    this.editingStepId = stepId;

    this.editForm.patchValue({
      title: step.title,
      description: step.description,
      targetId: step.targetId
    });
  }

  saveChanges() {
  if (this.editForm.invalid || this.editingStepId === null) {
    return;
  }

  const step = this.tour.steps.find(
    step => step.id === this.editingStepId
  );

  if (!step) {
    return;
  }

  const values = this.editForm.getRawValue();

  step.title = values.title;
  step.description = values.description;
  step.targetId = values.targetId;

  this.editingStepId = null;

  this.editForm.reset({
    title: '',
    description: '',
    targetId: 'search'
  });
}
  moveStep(stepId: number, direction: 'up' | 'down') {
    const index = this.tour.steps.findIndex(step => step.id === stepId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= this.tour.steps.length) return;

    const temp = this.tour.steps[index];
    this.tour.steps[index] = this.tour.steps[newIndex];
    this.tour.steps[newIndex] = temp;
  }
}
