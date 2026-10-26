import { TestBed } from '@angular/core/testing';

import { TourService } from './tour';

const step = { title: 'Profile', description: 'Manage your profile', targetId: 'profile' };

describe('TourService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('creates a default tour without overwriting storage on initialization', () => {
    const service = TestBed.inject(TourService);

    TestBed.tick();

    expect(service.tour.steps.length).toBe(3);
    expect(localStorage.getItem('tourcraft-tour')).toBeNull();
  });

  it('loads existing tours unchanged, including empty tours and unknown targets', () => {
    const saved = {
      id: 9,
      title: 'My saved tour',
      steps: [{ id: 70, ...step, targetId: 'legacy-target' }],
    };

    localStorage.setItem('tourcraft-tour', JSON.stringify(saved));

    const service = TestBed.inject(TourService);

    expect(service.tour).toEqual(saved);

    service.addStep(step);

    expect(service.tour.steps[1].id).toBe(71);

    service.tour.steps.forEach((item) => service.deleteStep(item.id));
    TestBed.tick();
    TestBed.resetTestingModule();

    expect(TestBed.inject(TourService).tour.steps).toEqual([]);
  });

  it('adds, edits, reorders, deletes and persists steps with unique IDs', () => {
    const service = TestBed.inject(TourService);

    service.addStep(step);

    const id = service.tour.steps.at(-1)!.id;

    service.saveChanges(id, { ...step, title: 'Updated profile' });
    service.moveStep(id, 'up');

    expect(service.tour.steps[2].title).toBe('Updated profile');

    service.moveStep(id, 'down');
    service.moveStep(id, 'down');

    expect(service.tour.steps.at(-1)!.id).toBe(id);

    service.deleteStep(id);
    service.addStep(step);

    expect(service.tour.steps.at(-1)!.id).toBeGreaterThan(id);

    TestBed.tick();

    expect(JSON.parse(localStorage.getItem('tourcraft-tour')!)).toEqual(service.tour);
  });

  it('leaves existing unreadable data untouched on load', () => {
    localStorage.setItem('tourcraft-tour', '{broken');

    const service = TestBed.inject(TourService);

    TestBed.tick();

    expect(service.storageIssue()).toBe(true);
    expect(localStorage.getItem('tourcraft-tour')).toBe('{broken');

    service.addStep(step);
    TestBed.tick();

    expect(localStorage.getItem('tourcraft-tour')).toBe('{broken');
  });

  it('rejects an invalid stored shape without crashing', () => {
    localStorage.setItem('tourcraft-tour', JSON.stringify({ steps: null }));

    expect(TestBed.inject(TourService).tour.steps.length).toBe(3);
  });

  it('keeps editing usable when persistence fails', () => {
    const service = TestBed.inject(TourService);

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });

    service.addStep(step);
    TestBed.tick();

    expect(service.tour.steps.at(-1)?.title).toBe('Profile');
    expect(service.storageIssue()).toBe(true);
  });
});
