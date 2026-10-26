import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoWorkspace } from '../../components/demo-workspace/demo-workspace';
import { TourService } from '../../core/services/tour';

@Component({
  selector: 'app-builder',
  imports: [DemoWorkspace, ReactiveFormsModule, RouterLink],
  templateUrl: './builder.html',
  styleUrl: './builder.scss',
})
export class Builder {
  private readonly tourService = inject(TourService);

  private readonly titleInput = viewChild<ElementRef<HTMLInputElement>>('titleInput');

  protected readonly storageIssue = this.tourService.storageIssue;

  protected readonly editForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    targetId: new FormControl('create-project', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected readonly targets = [
    { value: 'create-project', label: 'New Project button' },
    { value: 'search', label: 'Project search' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'profile', label: 'Profile' },
  ];

  protected editingStepId: number | null = null;
  protected announcement = '';

  get tour() {
    return this.tourService.tour;
  }

  protected targetLabel(targetId: string): string {
    return this.targets.find((target) => target.value === targetId)?.label ?? targetId;
  }

  addStep(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.tourService.addStep(this.editForm.getRawValue());
    this.cancelEdit();

    this.announcement = 'Step added to your tour.';
  }

  deleteStep(stepId: number): void {
    this.tourService.deleteStep(stepId);

    if (this.editingStepId === stepId) {
      this.cancelEdit();
    }

    this.announcement = 'Step deleted.';
  }

  startEdit(stepId: number): void {
    const step = this.tour.steps.find((step) => step.id === stepId);

    if (!step) {
      return;
    }

    this.editingStepId = stepId;
    this.editForm.reset({
      title: step.title,
      description: step.description,
      targetId: step.targetId,
    });

    this.titleInput()?.nativeElement.focus();
  }

  saveChanges(): void {
    if (this.editForm.invalid || this.editingStepId === null) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.tourService.saveChanges(this.editingStepId, this.editForm.getRawValue());
    this.cancelEdit();

    this.announcement = 'Step changes saved.';
  }

  cancelEdit(): void {
    this.editingStepId = null;
    this.editForm.reset({ title: '', description: '', targetId: 'create-project' });
  }

  moveStep(stepId: number, direction: 'up' | 'down'): void {
    this.tourService.moveStep(stepId, direction);
    this.announcement = `Step moved ${direction}.`;
  }
}
