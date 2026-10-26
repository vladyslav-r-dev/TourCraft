import { TourStep } from './tour-step.model';

export interface Tour {
  id: number;
  title: string;
  steps: TourStep[];
}
