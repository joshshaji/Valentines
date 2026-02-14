
export enum AppState {
  START = 'START',
  ASKING = 'ASKING',
  SUCCESS = 'SUCCESS'
}

export interface AvatarProps {
  type: 'boyfriend' | 'girlfriend';
  isHappy?: boolean;
  className?: string;
}

export interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}
