import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourTooltip } from './tour-tooltip';

describe('TourTooltip', () => {
  let fixture: ComponentFixture<TourTooltip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TourTooltip] }).compileComponents();

    fixture = TestBed.createComponent(TourTooltip);
    fixture.componentRef.setInput('step', {
      id: 1,
      title: 'Welcome',
      description: 'Start here',
      targetId: 'profile',
    });
    fixture.componentRef.setInput('stepsCount', 2);
    await fixture.whenStable();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());

  it('disables Previous on the first step and emits navigation events', async () => {
    const element: HTMLElement = fixture.nativeElement;
    const buttons = element.querySelectorAll('button');

    expect(buttons[0].disabled).toBe(true);

    const next = vi.fn();

    fixture.componentInstance.nextClicked.subscribe(next);
    buttons[1].click();

    expect(next).toHaveBeenCalledOnce();

    fixture.componentRef.setInput('stepIndex', 1);
    await fixture.whenStable();

    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].textContent).toContain('Finish');

    const previous = vi.fn();

    fixture.componentInstance.previousClicked.subscribe(previous);
    buttons[0].click();

    expect(previous).toHaveBeenCalledOnce();
  });

  it('clamps its position inside the viewport even without a recognized target', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(parseFloat(element.style.left)).toBeGreaterThanOrEqual(16);
    expect(parseFloat(element.style.top)).toBeGreaterThanOrEqual(16);
  });
});
