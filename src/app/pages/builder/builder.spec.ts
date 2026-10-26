import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TourService } from '../../core/services/tour';
import { Builder } from './builder';

describe('Builder', () => {
  let fixture: ComponentFixture<Builder>;
  let component: Builder;
  let element: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Builder],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Builder);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  function fill(selector: string, value: string): void {
    const input = element.querySelector<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  it('should create', () => expect(component).toBeTruthy());

  it('updates the rendered step list immediately after adding and preserves unique IDs', async () => {
    fill('#title', 'A new step');
    fill('#description', 'A useful description');
    component.addStep();
    await fixture.whenStable();

    expect(element.querySelectorAll('.step-card').length).toBe(4);
    expect(element.textContent).toContain('A new step');
    expect(new Set(component.tour.steps.map((step) => step.id)).size).toBe(4);
    expect(element.querySelector<HTMLInputElement>('#title')?.value).toBe('');
  });

  it('edits, cancels and clears editing when the selected step is deleted', async () => {
    component.startEdit(1);
    fill('#title', 'Changed title');
    component.saveChanges();
    await fixture.whenStable();

    expect(component.tour.steps[0].title).toBe('Changed title');

    component.startEdit(1);
    fill('#title', 'Unsaved');
    component.cancelEdit();

    expect(component.tour.steps[0].title).toBe('Changed title');

    component.startEdit(1);
    component.deleteStep(1);
    await fixture.whenStable();

    expect(element.querySelector('.form-heading')?.textContent).toContain('Add a new step');
    expect(element.querySelector<HTMLInputElement>('#title')?.value).toBe('');
  });

  it('rejects whitespace-only values and disables boundary reorder actions', async () => {
    fill('#title', '   ');
    fill('#description', 'Description');
    component.addStep();
    await fixture.whenStable();

    expect(component.tour.steps.length).toBe(3);
    expect(element.querySelector('#title-error')?.textContent).toContain('Give this step a title');
    expect(
      element.querySelector<HTMLButtonElement>('[aria-label="Move step 1 up"]')?.disabled,
    ).toBe(true);
    expect(
      element.querySelector<HTMLButtonElement>('[aria-label="Move step 3 down"]')?.disabled,
    ).toBe(true);
  });

  it('renders the empty state after all steps are deleted', async () => {
    const service = TestBed.inject(TourService);

    service.tour.steps.forEach((step) => service.deleteStep(step.id));
    await fixture.whenStable();

    expect(element.textContent).toContain('Your story starts with a step');
  });
});
