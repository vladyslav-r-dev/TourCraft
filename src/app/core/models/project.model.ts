export interface Project {
  id: number;
  name: string;
  status: 'active' | 'completed' | 'paused';
  members: number;
}
