import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourTooltip } from './tour-tooltip';

describe('TourTooltip', () => {
  let component: TourTooltip;
  let fixture: ComponentFixture<TourTooltip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourTooltip],
    }).compileComponents();

    fixture = TestBed.createComponent(TourTooltip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
