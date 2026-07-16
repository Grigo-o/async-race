export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface CreateCarPayload {
  name: string;
  color: string;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerWithCar extends Winner {
  name: string;
  color: string;
}

export type EngineStatus = 'started' | 'stopped';

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export interface DriveResponse {
  success: boolean;
}

export type SortField = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export type CarAnimationState = 'idle' | 'driving' | 'finished' | 'broken';
