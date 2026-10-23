import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoWorkspace } from './demo-workspace';

describe('DemoWorkspace', () => {
  let component: DemoWorkspace;
  let fixture: ComponentFixture<DemoWorkspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoWorkspace],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoWorkspace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
