import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });

  it('renders branding and real navigation destinations', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.brand')?.textContent).toContain('TourCraft');
    expect(
      Array.from(element.querySelectorAll('nav a')).map((link) => link.getAttribute('href')),
    ).toEqual(['/', '/preview']);
  });
});
