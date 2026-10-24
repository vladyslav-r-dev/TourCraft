import { Component, inject } from '@angular/core';
import { DemoWorkspace } from '../../components/demo-workspace/demo-workspace';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TourService  } from '../../core/services/tour';

@Component({
  selector: 'app-builder',
  imports: [DemoWorkspace, ReactiveFormsModule],
  templateUrl: './builder.html',
  styleUrl: './builder.scss',
})
export class Builder {
  private tourService = inject(TourService);
  tour = this.tourService.tour;
  
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

  this.tourService.addStep({
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
    this.tourService.deleteStep(stepId);
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

  this.tourService.saveChanges(this.editingStepId, this.editForm.getRawValue());

  this.editingStepId = null;

  this.editForm.reset({
    title: '',
    description: '',
    targetId: 'search'
  });
  }
  
  moveStep(stepId: number, direction: 'up' | 'down') {
  this.tourService.moveStep(stepId, direction);
  }
}
