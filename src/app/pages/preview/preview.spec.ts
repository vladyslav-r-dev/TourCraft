import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TourService } from '../../core/services/tour';
import { Preview } from './preview';

describe('Preview', () => {
  let fixture: ComponentFixture<Preview>;
  let component: Preview;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Preview],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Preview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => expect(component).toBeTruthy());

  it('supports previous, next, finish and restart with the correct active target', async () => {
    component.previousStep();

    expect(component.currentStepIndex()).toBe(0);

    component.nextStep();
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.tour-target-active')?.getAttribute('data-tour-target')).toBe(
      'search',
    );

    component.previousStep();

    expect(component.currentStepIndex()).toBe(0);

    component.nextStep();
    component.nextStep();
    component.nextStep();
    await fixture.whenStable();

    expect(component.isFinished()).toBe(true);
    expect(element.querySelector('app-tour-tooltip')).toBeNull();
    expect(element.textContent).toContain('Tour completed!');

    component.previousStep();

    expect(component.currentStepIndex()).toBe(2);

    component.restartStep();
    await fixture.whenStable();

    expect(component.isFinished()).toBe(false);
    expect(component.currentStepIndex()).toBe(0);
    expect(element.querySelector('app-tour-tooltip')).not.toBeNull();
  });

  it('shows an empty state and does not finish an empty tour', async () => {
    const service = TestBed.inject(TourService);

    service.tour.steps.forEach((step) => service.deleteStep(step.id));
    component.nextStep();
    await fixture.whenStable();

    expect(component.isFinished()).toBe(false);

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Create your first step');
    expect(element.querySelector('app-tour-tooltip')).toBeNull();
  });
});
